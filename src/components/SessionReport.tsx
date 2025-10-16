import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";

interface SessionReportProps {
  sessionId: Id<"sessions">;
  onClose: () => void;
}


export function SessionReport({ sessionId, onClose }: SessionReportProps) {
  const session = useQuery(api.queries.getSession, { sessionId });
  const reflections = useQuery(api.queries.getSessionReflections, { sessionId });
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (session === null || session === undefined || reflections === null || reflections === undefined) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Loading session report"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p role="status" aria-live="polite">Loading report...</p>
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full my-4 sm:my-8 shadow-2xl print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 sm:p-6 rounded-t-lg print:bg-indigo-600">
          <h1 id="report-title" className="text-xl sm:text-2xl font-bold mb-2">Coaching Session Report</h1>
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
                {typeof goalPayload['timeframe'] === 'string' && goalPayload['timeframe'].length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Timeframe</p>
                    <p className="text-gray-900 dark:text-white">{goalPayload['timeframe']}</p>
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
                          <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase mb-1">
                            <span aria-hidden="true">✓</span> Pros
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {option.pros.map((pro, pIdx) => (
                              <li key={pIdx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {option.cons !== undefined && option.cons !== null && option.cons.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase mb-1">
                            <span aria-hidden="true">✗</span> Cons
                          </p>
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
                {Array.isArray(willPayload['actions']) && (willPayload['actions'] as unknown[]).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Action Items</p>
                    <div className="space-y-2">
                      {(willPayload['actions'] as Array<{ title: string; owner: string; due_days: number }>).map((action, idx) => {
                        const dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + action.due_days);
                        return (
                          <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <span className="text-indigo-600 dark:text-indigo-400 text-lg mt-0.5">✓</span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <span>👤</span>
                                    <span>{action.owner}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>📅</span>
                                    <span>Due: {dueDate.toLocaleDateString()} ({action.due_days} days)</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                {/* Check if this is an incomplete session (Phase 1 only) */}
                {typeof reviewPayload['summary'] !== 'string' && typeof reviewPayload['coach_reflection'] === 'string' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ This session was completed before all review questions were answered. The full analysis is not available.
                    </p>
                  </div>
                )}
                
                {/* User Reflections */}
                {typeof reviewPayload['key_takeaways'] === 'string' && reviewPayload['key_takeaways'].length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Key Takeaways</p>
                    <p className="text-gray-900 dark:text-white">{reviewPayload['key_takeaways']}</p>
                  </div>
                )}
                
                {typeof reviewPayload['confidence_level'] === 'number' && (() => {
                  const confidenceValue = Number(reviewPayload['confidence_level']);
                  const progressBarProps = {
                    role: 'progressbar' as const,
                    'aria-valuenow': confidenceValue,
                    'aria-valuemin': 0,
                    'aria-valuemax': 100,
                    'aria-label': `Confidence level: ${confidenceValue} percent`
                  };
                  return (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Confidence Level</p>
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3"
                          {...progressBarProps}
                        >
                          <div 
                            className="bg-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${confidenceValue}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400" aria-hidden="true">
                          {confidenceValue}/100
                        </span>
                      </div>
                    </div>
                  );
                })()}
                
                {typeof reviewPayload['commitment'] === 'string' && reviewPayload['commitment'].length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Commitment</p>
                    <p className="text-gray-900 dark:text-white">{reviewPayload['commitment']}</p>
                  </div>
                )}
                
                {typeof reviewPayload['immediate_step'] === 'string' && reviewPayload['immediate_step'].length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Next Immediate Step</p>
                    <p className="text-gray-900 dark:text-white font-medium">→ {reviewPayload['immediate_step']}</p>
                  </div>
                )}
                
                {/* Summary */}
                {typeof reviewPayload['summary'] === 'string' && reviewPayload['summary'].length > 0 && (
                  <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Session Summary</p>
                    <p className="text-gray-900 dark:text-white">{reviewPayload['summary']}</p>
                  </div>
                )}
              </div>

              {/* AI Insights & Analysis - Only show if there's actual analysis data */}
              {(typeof reviewPayload['ai_insights'] === 'string' || 
                (Array.isArray(reviewPayload['unexplored_options']) && (reviewPayload['unexplored_options'] as unknown[]).length > 0) ||
                (Array.isArray(reviewPayload['identified_risks']) && (reviewPayload['identified_risks'] as unknown[]).length > 0) ||
                (Array.isArray(reviewPayload['potential_pitfalls']) && (reviewPayload['potential_pitfalls'] as unknown[]).length > 0)) && (
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
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            aria-label="Print or save report as PDF"
          >
            <span aria-hidden="true">🖨️</span> Print / Save as PDF
          </button>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            aria-label="Close report dialog"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
