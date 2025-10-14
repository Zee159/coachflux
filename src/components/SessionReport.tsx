import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SessionReportProps {
  sessionId: Id<"sessions">;
  onClose: () => void;
}

export function SessionReport({ sessionId, onClose }: SessionReportProps) {
  const session = useQuery(api.queries.getSession, { sessionId });
  const reflections = useQuery(api.queries.getSessionReflections, { sessionId });

  if (session === null || session === undefined || reflections === null || reflections === undefined) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  // Extract data from reflections
  const goalReflection = reflections.find((r) => r.step === "goal");
  const realityReflection = reflections.find((r) => r.step === "reality");
  const optionsReflection = reflections.find((r) => r.step === "options");
  const willReflection = reflections.find((r) => r.step === "will");
  const reviewReflection = reflections.find((r) => r.step === "review");

  const goalPayload = goalReflection?.payload as Record<string, unknown> | undefined;
  const realityPayload = realityReflection?.payload as Record<string, unknown> | undefined;
  const optionsPayload = optionsReflection?.payload as Record<string, unknown> | undefined;
  const willPayload = willReflection?.payload as Record<string, unknown> | undefined;
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full my-4 sm:my-8 shadow-2xl print:shadow-none">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 sm:p-6 rounded-t-lg print:bg-indigo-600">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Coaching Session Report</h1>
          <p className="text-indigo-100 text-xs sm:text-sm">
            {session.framework} Framework • {new Date(session.startedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-h-[70vh] overflow-y-auto print:max-h-none">
          {/* Goal Section */}
          {goalPayload !== undefined && goalPayload !== null && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                  G
                </span>
                Goal
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                {typeof goalPayload['goal'] === 'string' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Your Goal</p>
                    <p className="text-gray-900 dark:text-white">{goalPayload['goal']}</p>
                  </div>
                ) : null}
                {typeof goalPayload['why_now'] === 'string' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Why Now</p>
                    <p className="text-gray-900 dark:text-white">{goalPayload['why_now']}</p>
                  </div>
                ) : null}
                {Array.isArray(goalPayload['success_criteria']) ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Success Criteria</p>
                    <ul className="list-disc list-inside space-y-1">
                      {(goalPayload['success_criteria'] as string[]).map((criterion, idx) => (
                        <li key={idx} className="text-gray-900 dark:text-white">{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {typeof goalPayload['horizon_weeks'] === 'number' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Timeframe</p>
                    <p className="text-gray-900 dark:text-white">{goalPayload['horizon_weeks']} weeks</p>
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {/* Reality Section */}
          {realityPayload !== undefined && realityPayload !== null && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                  R
                </span>
                Reality
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                {typeof realityPayload['current_state'] === 'string' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Current State</p>
                    <p className="text-gray-900 dark:text-white">{realityPayload['current_state']}</p>
                  </div>
                ) : null}
                {Array.isArray(realityPayload['constraints']) && (realityPayload['constraints'] as unknown[]).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Constraints</p>
                    <ul className="list-disc list-inside space-y-1">
                      {(realityPayload['constraints'] as string[]).map((constraint, idx) => (
                        <li key={idx} className="text-gray-900 dark:text-white">{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(realityPayload['resources']) && (realityPayload['resources'] as unknown[]).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Resources</p>
                    <ul className="list-disc list-inside space-y-1">
                      {(realityPayload['resources'] as string[]).map((resource, idx) => (
                        <li key={idx} className="text-gray-900 dark:text-white">{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(realityPayload['risks']) && (realityPayload['risks'] as unknown[]).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Risks</p>
                    <ul className="list-disc list-inside space-y-1">
                      {(realityPayload['risks'] as string[]).map((risk, idx) => (
                        <li key={idx} className="text-gray-900 dark:text-white">{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Options Section */}
          {optionsPayload !== undefined && optionsPayload !== null && Array.isArray(optionsPayload['options']) && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                  O
                </span>
                Options
              </h2>
              <div className="space-y-3">
                {(optionsPayload['options'] as Array<{ label: string; pros?: string[]; cons?: string[] }>).map((option, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">{option.label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      {option.pros !== undefined && option.pros !== null && option.pros.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase mb-1">Pros</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {option.pros.map((pro, pIdx) => (
                              <li key={pIdx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {option.cons !== undefined && option.cons !== null && option.cons.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase mb-1">Cons</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {option.cons.map((con, cIdx) => (
                              <li key={cIdx}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Will Section */}
          {willPayload !== undefined && willPayload !== null && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                  W
                </span>
                Will (Action Plan)
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                {typeof willPayload['chosen_option'] === 'string' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Chosen Option</p>
                    <p className="text-gray-900 dark:text-white font-medium">{willPayload['chosen_option']}</p>
                  </div>
                ) : null}
                {Array.isArray(willPayload['actions']) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Action Items</p>
                    <div className="space-y-2">
                      {(willPayload['actions'] as Array<{ title: string; owner: string; due_days: number }>).map((action, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3">
                          <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>👤 {action.owner}</span>
                            <span>📅 Due in {action.due_days} days</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Review Section */}
          {reviewPayload !== undefined && reviewPayload !== null && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                  R
                </span>
                Review
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                {typeof reviewPayload['summary'] === 'string' ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Summary</p>
                    <p className="text-gray-900 dark:text-white">{reviewPayload['summary']}</p>
                  </div>
                ) : null}
                {typeof reviewPayload['alignment_score'] === 'number' && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Alignment Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Number(reviewPayload['alignment_score']))}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
                        {String(reviewPayload['alignment_score'])}/100
                      </span>
                    </div>
                  </div>
                )}
                {Array.isArray(reviewPayload['value_tags']) && (reviewPayload['value_tags'] as unknown[]).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Aligned Values</p>
                    <div className="flex flex-wrap gap-2">
                      {(reviewPayload['value_tags'] as string[]).map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Insights & Analysis */}
              <div className="mt-4 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-indigo-600">🤖</span>
                  AI Insights & Analysis
                </h3>

                {typeof reviewPayload['ai_insights'] === 'string' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase mb-1">Key Insights</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{reviewPayload['ai_insights']}</p>
                  </div>
                )}

                {Array.isArray(reviewPayload['unexplored_options']) && (reviewPayload['unexplored_options'] as unknown[]).length > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 uppercase mb-2">💡 Unexplored Options</p>
                    <ul className="space-y-2">
                      {(reviewPayload['unexplored_options'] as string[]).map((option, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-800 dark:text-gray-200">
                          <span className="text-purple-600 dark:text-purple-400 font-bold">→</span>
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(reviewPayload['identified_risks']) && (reviewPayload['identified_risks'] as unknown[]).length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-orange-900 dark:text-orange-100 uppercase mb-2">⚠️ Identified Risks</p>
                    <ul className="space-y-2">
                      {(reviewPayload['identified_risks'] as string[]).map((risk, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-800 dark:text-gray-200">
                          <span className="text-orange-600 dark:text-orange-400 font-bold">!</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(reviewPayload['potential_pitfalls']) && (reviewPayload['potential_pitfalls'] as unknown[]).length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-red-900 dark:text-red-100 uppercase mb-2">🚨 Potential Pitfalls</p>
                    <ul className="space-y-2">
                      {(reviewPayload['potential_pitfalls'] as string[]).map((pitfall, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-800 dark:text-gray-200">
                          <span className="text-red-600 dark:text-red-400 font-bold">×</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
