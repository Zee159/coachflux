import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { hasCoachReflection } from "../../convex/types";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { NudgeUsageSummary } from "./NudgeDisplay";

interface ReportSection {
  heading: string;
  content: string;
  type: string;
  data?: Record<string, unknown>;
}

interface SessionReportProps {
  sessionId: Id<"sessions">;
  onClose: () => void;
}

interface ReflectionData {
  userInput?: string;
  payload: Record<string, unknown>;
  step: string;
}

// Generate COMPASS-specific report sections
function generateCOMPASSReportSections(reflections: ReflectionData[]): ReportSection[] {
  const sections: ReportSection[] = [];
  
  // Extract confidence tracking data
  const confidenceData = reflections
    .map(r => r.payload['confidence_tracking'])
    .filter(Boolean)
    .map(ct => ct as {
      initial_confidence?: number;
      post_clarity_confidence?: number;
      post_ownership_confidence?: number;
      final_confidence?: number;
      confidence_change?: number;
      confidence_percent_increase?: number;
    });
  
  // Extract nudge usage data
  const nudgeData = reflections
    .map(r => r.payload['nudge_used'])
    .filter(Boolean)
    .map(nu => nu as {
      nudge_type?: string;
      nudge_category?: string;
      nudge_name?: string;
      triggered_at?: string;
      user_input?: string;
    });
  
  // Confidence Progression Section
  if (confidenceData.length > 0) {
    const latestConfidence = confidenceData[confidenceData.length - 1];
    if (latestConfidence?.initial_confidence !== null && latestConfidence?.initial_confidence !== undefined && 
        latestConfidence?.final_confidence !== null && latestConfidence?.final_confidence !== undefined) {
      sections.push({
        heading: "Confidence Progression",
        content: `Your confidence increased from ${latestConfidence.initial_confidence}/5 to ${latestConfidence.final_confidence}/5, representing a ${latestConfidence.confidence_percent_increase}% improvement.`,
        type: "scores",
        data: latestConfidence
      });
    }
  }
  
  // Nudge Usage Section
  if (nudgeData.length > 0) {
    sections.push({
      heading: "AI Nudge Usage",
      content: `The AI provided ${nudgeData.length} targeted nudges to help you progress through the session.`,
      type: "insights",
      data: { nudgesUsed: nudgeData }
    });
  }
  
  // Change Navigation Summary
  const clarityReflection = reflections.find(r => r.step === 'clarity');
  const ownershipReflection = reflections.find(r => r.step === 'ownership');
  const mappingReflection = reflections.find(r => r.step === 'mapping');
  const practiceReflection = reflections.find(r => r.step === 'practice');
  
  if (clarityReflection !== undefined && clarityReflection !== null && ownershipReflection !== undefined && ownershipReflection !== null && mappingReflection !== undefined && mappingReflection !== null && practiceReflection !== undefined && practiceReflection !== null) {
    const changeDescription = clarityReflection.payload['change_description'] as string;
    const personalBenefit = ownershipReflection.payload['personal_benefit'] as string;
    const committedAction = mappingReflection.payload['committed_action'] as string;
    const keyTakeaway = practiceReflection.payload['key_takeaway'] as string;
    
    sections.push({
      heading: "Change Navigation Summary",
      content: `You navigated the change "${changeDescription}" by identifying personal benefits (${personalBenefit}), committing to action (${committedAction}), and learning key insights (${keyTakeaway}).`,
      type: "transformation"
    });
  }
  
  return sections;
}

// Component: Render a dynamic report section
function ReportSectionComponent({ section }: { section: ReportSection }) {
  const { heading, content, type } = section;
  
  // Different styling based on section type
  const sectionStyles: Record<string, string> = {
    transformation: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500',
    scores: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500',
    insights: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500',
    actions: 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-l-4 border-orange-500',
    text: 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
  };
  
  const sectionClass = sectionStyles[type] ?? sectionStyles['text'];
  
  return (
    <section className={`${sectionClass} rounded-r-lg p-6 print:p-3 print:break-inside-avoid`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        {heading}
      </h2>
      <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
      
      {/* COMPASS-specific data rendering */}
      {section.data !== undefined && section.data !== null && (
        <div className="mt-4">
          {/* Confidence Meter */}
          {'initial_confidence' in section.data && 'final_confidence' in section.data && 
           section.data['initial_confidence'] !== undefined && section.data['initial_confidence'] !== null &&
           section.data['final_confidence'] !== undefined && section.data['final_confidence'] !== null && (
            <div className="mt-4">
              <ConfidenceMeter
                initialConfidence={section.data['initial_confidence'] as number}
                finalConfidence={section.data['final_confidence'] as number}
                showProgress={true}
                size="md"
              />
            </div>
          )}
          
          {/* Nudge Usage Summary */}
          {'nudgesUsed' in section.data && section.data['nudgesUsed'] !== undefined && section.data['nudgesUsed'] !== null && (
            <div className="mt-4">
              <NudgeUsageSummary nudgesUsed={section.data['nudgesUsed'] as Array<{
                nudge_type: string;
                nudge_category: string;
                nudge_name: string;
                triggered_at: string;
                user_input: string;
              }>} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Component: Display conversation transcript for a step
function ConversationTranscript({ reflections }: { reflections: ReflectionData[] }) {
  if (reflections.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No conversation recorded for this step.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">💬 Conversation</p>
      {reflections.map((reflection, idx) => (
        <div key={idx} className="space-y-3">
          {/* User Input */}
          {reflection.userInput !== undefined && reflection.userInput !== null && reflection.userInput.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg p-3">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">👤 You</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{reflection.userInput}</p>
            </div>
          )}
          
          {/* Coach Response */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            {/* Coach Reflection Text */}
            {hasCoachReflection(reflection.payload) && (
              <div className="border-l-4 border-indigo-500 pl-3">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">🤖 Coach</p>
                <div className="text-sm text-gray-800 dark:text-gray-200 italic whitespace-pre-line">{reflection.payload.coach_reflection}</div>
              </div>
            )}
            
            {/* Structured Reflection Data */}
            {Object.entries(reflection.payload)
              .filter(([key]) => key !== 'coach_reflection')
              .map(([key, value]) => {
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                
                // Arrays
                if (Array.isArray(value) && value.length > 0) {
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase mb-1">{label}</p>
                      <ul className="list-disc list-inside space-y-1">
                        {value.map((item, itemIdx) => {
                          // Handle options with pros/cons
                          if (typeof item === 'object' && item !== null && 'label' in item) {
                            const option = item as { label: string; pros?: string[]; cons?: string[] };
                            return (
                              <li key={itemIdx} className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">{option.label}</span>
                                {option.pros !== undefined && option.pros !== null && option.pros.length > 0 && (
                                  <div className="ml-6 text-xs text-green-700 dark:text-green-400 mt-1">
                                    ✓ Pros: {option.pros.join(', ')}
                                  </div>
                                )}
                                {option.cons !== undefined && option.cons !== null && option.cons.length > 0 && (
                                  <div className="ml-6 text-xs text-red-700 dark:text-red-400">
                                    ✗ Cons: {option.cons.join(', ')}
                                  </div>
                                )}
                              </li>
                            );
                          }
                          // Handle actions with owner/due_days
                          if (typeof item === 'object' && item !== null && 'title' in item) {
                            const action = item as { title: string; owner?: string; due_days?: number };
                            return (
                              <li key={itemIdx} className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-medium">{action.title}</span>
                                {action.owner !== undefined && action.owner !== null && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400"> (Owner: {action.owner})</span>
                                )}
                                {action.due_days !== undefined && action.due_days !== null && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400"> • Due in {action.due_days} days</span>
                                )}
                              </li>
                            );
                          }
                          // Simple strings
                          return (
                            <li key={itemIdx} className="text-sm text-gray-700 dark:text-gray-300">
                              {String(item)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
                
                // Strings
                if (typeof value === 'string' && value.length > 0) {
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase mb-1">{label}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
                    </div>
                  );
                }
                
                // Numbers
                if (typeof value === 'number') {
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase mb-1">{label}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
                    </div>
                  );
                }
                
                return null;
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SessionReport({ sessionId, onClose }: SessionReportProps) {
  const session = useQuery(api.queries.getSession, { sessionId });
  const reflections = useQuery(api.queries.getSessionReflections, { sessionId });
  const dynamicReport = useQuery(api.queries.generateReport, { sessionId });
  const user = useQuery(api.queries.getUser, session !== null && session !== undefined ? { userId: session.userId } : "skip");
  const org = useQuery(api.queries.getOrg, session !== null && session !== undefined ? { orgId: session.orgId } : "skip");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Determine if we should use dynamic report (COMPASS with completed session)
  const useDynamicReport = dynamicReport !== null && dynamicReport !== undefined && 
    session?.framework === 'COMPASS' && 
    session?.closedAt !== undefined;

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

  // Get unique steps from reflections (framework-agnostic)
  const uniqueSteps = Array.from(new Set(reflections.map(r => r.step)));
  
  // Group reflections by step
  const stepReflectionGroups: Record<string, typeof reflections> = {};
  uniqueSteps.forEach(step => {
    stepReflectionGroups[step] = reflections.filter(r => r.step === step);
  });
  
  // Get review reflection for summary/insights
  const reviewReflections = reflections.filter((r) => r.step === "review");
  const reviewReflection = reviewReflections[reviewReflections.length - 1];
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;
  
  // Step display info
  const stepInfo: Record<string, { label: string; icon: string }> = {
    goal: { label: "Goal", icon: "G" },
    reality: { label: "Reality", icon: "R" },
    options: { label: "Options", icon: "O" },
    will: { label: "Will (Action Plan)", icon: "W" },
    clarity: { label: "Clarity", icon: "🧭" },
    ownership: { label: "Ownership", icon: "💪" },
    mapping: { label: "Mapping", icon: "🗺️" },
    practice: { label: "Practice", icon: "🎯" },
    anchoring: { label: "Anchoring", icon: "⚓" },
    review: { label: "Review", icon: "✓" }
  };
  

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto print:p-0 print:static print:bg-white"
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
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full my-4 sm:my-8 shadow-2xl print:shadow-none print:max-w-full print:my-0 print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 sm:p-6 rounded-t-lg print:bg-indigo-600 print:p-3 print:rounded-none print:break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 id="report-title" className="text-xl sm:text-2xl font-bold mb-2">Coaching Session Report</h1>
              <p className="text-indigo-100 text-xs sm:text-sm mb-2">
                {session.framework} Framework • {new Date(session.startedAt).toLocaleDateString()}
              </p>
              {user !== undefined && user !== null && (
                <div className="flex flex-col gap-1 text-indigo-100">
                  <p className="text-sm font-medium">
                    <span className="opacity-75">Participant:</span> {user.displayName}
                  </p>
                  {org !== undefined && org !== null && (
                    <p className="text-xs opacity-75">
                      {org.name}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              className="print:hidden px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
              title="Coming soon: Email this report"
            >
              <span>✉️</span>
              <span>Email Report</span>
              <span className="text-xs opacity-75">(Soon)</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-h-[70vh] overflow-y-auto print:max-h-none print:p-3 print:space-y-3">
          {/* Dynamic Report (COMPASS) */}
          {useDynamicReport && dynamicReport !== null && dynamicReport !== undefined ? (
            <>
              {/* Report Summary */}
              <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-l-4 border-indigo-500 print:p-3 print:break-inside-avoid">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {dynamicReport.title}
                </h2>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                  {dynamicReport.summary}
                </p>
              </section>
              
              {/* Dynamic Report Sections */}
              {dynamicReport.sections.map((section, idx) => (
                <ReportSectionComponent key={idx} section={section} />
              ))}
              
              {/* COMPASS-specific sections */}
              {session.framework === 'COMPASS' && (
                <>
                  {generateCOMPASSReportSections(reflections.map(r => ({
                    userInput: r.userInput,
                    payload: r.payload as Record<string, unknown>,
                    step: r.step
                  }))).map((section, idx) => (
                    <ReportSectionComponent key={`compass-${idx}`} section={section} />
                  ))}
                </>
              )}
              
              {/* Show transcript toggle for details */}
              <details className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 print:hidden">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  📋 View Full Session Transcript
                </summary>
                <div className="mt-4 space-y-6">
                  {uniqueSteps.filter(step => step !== 'review').map((step) => {
                    const info = stepInfo[step] ?? { label: step.charAt(0).toUpperCase() + step.slice(1), icon: step.charAt(0).toUpperCase() };
                    const stepReflections = stepReflectionGroups[step] ?? [];
                    
                    return (
                      <section key={step}>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">
                            {info.icon}
                          </span>
                          {info.label}
                        </h3>
                        <ConversationTranscript reflections={stepReflections.map(r => ({
                          userInput: r.userInput,
                          payload: r.payload as Record<string, unknown>,
                          step: r.step
                        }))} />
                      </section>
                    );
                  })}
                </div>
              </details>
            </>
          ) : (
            /* Traditional Report (GROW or legacy sessions) */
            <>
              {/* Session Summary & AI Insights - Top Section */}
              {reviewPayload !== undefined && reviewPayload !== null && (
            <>
              {/* Session Summary */}
              {typeof reviewPayload['summary'] === 'string' && reviewPayload['summary'].length > 0 && (
                <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-l-4 border-indigo-500 print:p-3 print:break-inside-avoid">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <span>Session Summary</span>
                  </h2>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{reviewPayload['summary']}</p>
                </section>
              )}

              {/* AI Insights & Analysis */}
              {(typeof reviewPayload['ai_insights'] === 'string' || 
                (Array.isArray(reviewPayload['unexplored_options']) && (reviewPayload['unexplored_options'] as unknown[]).length > 0) ||
                (Array.isArray(reviewPayload['identified_risks']) && (reviewPayload['identified_risks'] as unknown[]).length > 0) ||
                (Array.isArray(reviewPayload['potential_pitfalls']) && (reviewPayload['potential_pitfalls'] as unknown[]).length > 0)) && (
                <section className="print:break-inside-avoid">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print:text-sm print:mb-2">
                    <span className="text-2xl">🤖</span>
                    <span>AI Insights & Analysis</span>
                  </h2>
                  <div className="space-y-4">
                    {typeof reviewPayload['ai_insights'] === 'string' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase mb-2">Key Insights</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{reviewPayload['ai_insights']}</p>
                      </div>
                    )}

                    {Array.isArray(reviewPayload['unexplored_options']) && (reviewPayload['unexplored_options'] as unknown[]).length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
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
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
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
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
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

              {/* Divider */}
              <div className="border-t-2 border-gray-300 dark:border-gray-600 my-8">
                <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 -mt-3 bg-white dark:bg-gray-800 inline-block px-4 relative left-1/2 -translate-x-1/2">
                  SESSION DETAILS
                </p>
              </div>
            </>
          )}

          {/* Dynamic Step Sections - Show only steps that exist in this session */}
          {uniqueSteps.filter(step => step !== 'review').map((step) => {
            const info = stepInfo[step] ?? { label: step.charAt(0).toUpperCase() + step.slice(1), icon: step.charAt(0).toUpperCase() };
            const stepReflections = stepReflectionGroups[step] ?? [];
            
            return (
              <section key={step} className="print:break-inside-avoid">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">
                    {info.icon}
                  </span>
                  {info.label}
                </h2>
                <ConversationTranscript reflections={stepReflections.map(r => ({
                  userInput: r.userInput,
                  payload: r.payload as Record<string, unknown>,
                  step: r.step
                }))} />
              </section>
            );
          })}


          {/* User Reflections - Bottom Section */}
          {reviewPayload !== undefined && reviewPayload !== null && (
            <section className="print:break-inside-avoid">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <span>Your Reflections</span>
              </h2>
              
              {/* Check if this is an incomplete session (Phase 1 only) */}
              {typeof reviewPayload['summary'] !== 'string' && typeof reviewPayload['coach_reflection'] === 'string' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ This session was completed before all review questions were answered. The full analysis is not available.
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                {typeof reviewPayload['key_takeaways'] === 'string' && reviewPayload['key_takeaways'].length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Key Takeaways</p>
                    <p className="text-gray-900 dark:text-white leading-relaxed">{reviewPayload['key_takeaways']}</p>
                  </div>
                )}
                
                {typeof reviewPayload['immediate_step'] === 'string' && reviewPayload['immediate_step'].length > 0 && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg p-4">
                    <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100 uppercase mb-2">Next Immediate Step</p>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 text-xl">→</span>
                      <span>{reviewPayload['immediate_step']}</span>
                    </p>
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
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Confidence Level</p>
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
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Commitment</p>
                    <p className="text-gray-900 dark:text-white">{reviewPayload['commitment']}</p>
                  </div>
                )}
              </div>
            </section>
          )}
            </>
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
