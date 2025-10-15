import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SessionReport } from "./SessionReport";
import { ThemeToggle } from "./ThemeToggle";
import { FeedbackWidget } from "./FeedbackWidget";
import { VoiceControl, VoiceButtons, VoiceSettingsModal, LiveTranscript } from "./VoiceControl";

type StepName = "goal" | "reality" | "options" | "will" | "review";

function formatReflectionDisplay(_step: string, payload: Record<string, unknown>): JSX.Element {
  const entries = Object.entries(payload);
  
  // Separate coach_reflection from other fields
  const coachReflection = entries.find(([key]) => key === 'coach_reflection');
  const otherEntries = entries.filter(([key]) => key !== 'coach_reflection');
  
  return (
    <div className="space-y-4">
      {/* Coach Reflection - displayed first with special styling */}
      {coachReflection !== undefined && (
        <div className="bg-white dark:bg-gray-700 border-l-4 border-indigo-600 dark:border-indigo-400 p-3 rounded-r-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
            💬 {String(coachReflection[1])}
          </p>
        </div>
      )}
      
      {/* Other fields */}
      <div className="space-y-3">
        {otherEntries.map(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          
          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
                  {label}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {value.map((item, idx) => {
                    // Handle options array specially
                    if (typeof item === 'object' && item !== null && 'label' in item) {
                      const option = item as { label: string; pros?: string[]; cons?: string[] };
                      return (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{option.label}</span>
                          {(option.pros !== null && option.pros !== undefined && option.pros.length > 0) && (
                            <div className="ml-4 mt-1 text-xs text-green-700 dark:text-green-400">
                              ✓ {option.pros.join(', ')}
                            </div>
                          )}
                          {(option.cons !== null && option.cons !== undefined && option.cons.length > 0) && (
                            <div className="ml-4 text-xs text-red-700 dark:text-red-400">
                              ✗ {option.cons.join(', ')}
                            </div>
                          )}
                        </li>
                      );
                    }
                    // Handle actions array specially
                    if (typeof item === 'object' && item !== null && 'title' in item) {
                      const action = item as { title: string; owner?: string; due_days?: number };
                      return (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{action.title}</span>
                          {(action.owner !== null && action.owner !== undefined && action.owner.length > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> (Owner: {action.owner})</span>}
                          {(action.due_days !== null && action.due_days !== undefined && action.due_days > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> • Due in {action.due_days} days</span>}
                        </li>
                      );
                    }
                    // Default: simple string
                    return (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                        {String(item)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
          
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={key}>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
                  {label}
                </p>
                <div className="text-sm text-gray-700 dark:text-gray-300 pl-4 space-y-1">
                  {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-medium">{k}:</span> {String(v)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          return (
            <div key={key}>
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{String(value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STEP_DESCRIPTIONS: Record<StepName, string> = {
  goal: "Clarify your desired outcome for the next 1-12 weeks.",
  reality: "Assess your current situation, constraints, and resources.",
  options: "Explore at least three viable paths forward.",
  will: "Choose an option and define specific actions.",
  review: "Review your plan and alignment with organizational values.",
};

const COACHING_PROMPTS: Record<StepName, { title: string; questions: string[] }> = {
  goal: {
    title: "Clarify the Topic and Goal",
    questions: [
      "What is it you wish to discuss?",
      "What outcomes would you like to achieve from this conversation?",
      "What does success look like for you?",
      "Why is this important to you right now?",
      "What timeframe are you working with?"
    ]
  },
  reality: {
    title: "Explore the Reality",
    questions: [
      "What's actually happening right now?",
      "Describe the issue as you see it",
      "What's the impact of this situation?",
      "What constraints or barriers are you facing?",
      "What resources do you currently have available?",
      "Who else is involved or affected?"
    ]
  },
  options: {
    title: "Generate Options",
    questions: [
      "What are the possible ways forward?",
      "What else could you do?",
      "What are the pros and cons of each option?",
      "Which option feels most aligned with your goals?",
      "What would you do if there were no constraints?"
    ]
  },
  will: {
    title: "Commit to Action",
    questions: [
      "Which option will you choose?",
      "What specific actions will you take?",
      "Who will be responsible for each action?",
      "When will you complete these actions?",
      "What support or resources do you need?",
      "How will you know you've succeeded?"
    ]
  },
  review: {
    title: "Review & Summarize",
    questions: [
      "What are the key takeaways from this conversation?",
      "How does this plan align with your organization's values?",
      "On a scale of 0-100, how confident are you in this plan?",
      "What commitment are you making to yourself?",
      "What's your next immediate step?"
    ]
  }
};

export function SessionView() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [notification, setNotification] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastReflectionRef = useRef<string | null>(null);

  const session = useQuery(
    api.queries.getSession,
    sessionId !== undefined && sessionId !== null && sessionId !== '' 
      ? { sessionId: sessionId as Id<"sessions"> } 
      : "skip"
  );

  const reflections = useQuery(
    api.queries.getSessionReflections,
    sessionId !== undefined && sessionId !== null && sessionId !== '' 
      ? { sessionId: sessionId as Id<"sessions"> } 
      : "skip"
  );

  const nextStepAction = useAction(api.coach.nextStep);
  const closeSession = useMutation(api.mutations.closeSession);
  const incrementSkip = useMutation(api.mutations.incrementSkipCount);

  // Voice control hook
  const voiceControl = VoiceControl({
    onTranscript: (transcript) => {
      setText(transcript);
      // Auto-submit when voice input completes
      setTimeout(() => {
        void handleSubmit(transcript);
      }, 100);
    },
    disabled: submitting,
    selectedVoice,
  });

  useEffect(() => {
    // Auto-scroll to latest message when new reflection appears
    if (chatEndRef.current === null || chatEndRef.current === undefined) {
      return;
    }
    
    // Small delay to ensure DOM has updated with new content
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [reflections?.length]); // Trigger only when count changes

  // Auto-play coach responses with voice
  useEffect(() => {
    if (!autoPlayVoice || reflections === null || reflections === undefined || reflections.length === 0) {
      return;
    }

    const latestReflection = reflections[reflections.length - 1];
    if (latestReflection === undefined) {
      return;
    }

    const reflectionId = latestReflection._id;

    // Only play if this is a new reflection
    if (lastReflectionRef.current === reflectionId) {
      return;
    }

    lastReflectionRef.current = reflectionId;

    // Extract coach_reflection text to speak
    const payload = latestReflection.payload as Record<string, unknown>;
    const coachReflection = payload['coach_reflection'];

    if (typeof coachReflection === 'string' && coachReflection.length > 0) {
      // Small delay to let the UI update first
      setTimeout(() => {
        voiceControl.speak(coachReflection);
      }, 500);
    }
  }, [reflections, autoPlayVoice, voiceControl]);

  // Load saved voice preference
  useEffect(() => {
    const savedVoiceName = localStorage.getItem('coachflux_voice');
    const savedAutoPlay = localStorage.getItem('coachflux_autoplay');
    
    if (savedAutoPlay !== null) {
      setAutoPlayVoice(savedAutoPlay === 'true');
    }

    if (savedVoiceName !== null && savedVoiceName.length > 0) {
      const loadVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === savedVoiceName);
        if (voice !== undefined) {
          setSelectedVoice(voice);
        }
      };

      loadVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoice;
      }
    }
  }, []);

  const handleVoiceSelect = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    localStorage.setItem('coachflux_voice', voice.name);
  };

  const toggleAutoPlay = () => {
    const newValue = !autoPlayVoice;
    setAutoPlayVoice(newValue);
    localStorage.setItem('coachflux_autoplay', String(newValue));
  };

  if (session === null || session === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading session...</div>
      </div>
    );
  }

  const currentStep = session.step as StepName;
  
  // Get skip count for current step
  const sessionState = session.state as { skips?: Record<string, number> } | undefined;
  const skipCount = sessionState?.skips?.[currentStep] ?? 0;
  const canSkip = skipCount < 2 && currentStep !== "review"; // No skip on review step
  
  // Check if session is complete (review step done OR session closed)
  const reviewReflection = reflections?.find((r) => r.step === "review");
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;
  const isReviewComplete = Boolean(
    reviewPayload !== null && reviewPayload !== undefined &&
    typeof reviewPayload['summary'] === 'string' && reviewPayload['summary'].length > 0 &&
    typeof reviewPayload['alignment_score'] === 'number' &&
    typeof reviewPayload['ai_insights'] === 'string' && reviewPayload['ai_insights'].length > 0 &&
    Array.isArray(reviewPayload['unexplored_options']) &&
    Array.isArray(reviewPayload['identified_risks']) &&
    Array.isArray(reviewPayload['potential_pitfalls'])
  );
  const isSessionComplete = (currentStep === "review" && isReviewComplete) || 
    (session.closedAt !== null && session.closedAt !== undefined);

  async function handleSubmit(skipText?: string): Promise<void> {
    const inputText = skipText ?? text;
    if (session === null || session === undefined || inputText.trim() === '' || submitting) {
      return;
    }

    // Check if session is already closed
    if (session.closedAt !== null && session.closedAt !== undefined) {
      setNotification({ type: "info", message: "This session has been completed. Please view your report or start a new session." });
      return;
    }

    if (inputText.length > 800) {
      setNotification({ type: "error", message: `Please keep your response under 800 characters (currently ${inputText.length} characters).` });
      return;
    }

    setSubmitting(true);
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const result = await nextStepAction({
          orgId: session.orgId,
          userId: session.userId,
          sessionId: session._id,
          stepName: currentStep,
          userTurn: inputText,
        });

        if (!result.ok) {
          setNotification({ type: "error", message: result.message ?? "Unable to process your input. Please try rephrasing." });
          break;
        } else {
          setText("");
          if (result.sessionClosed === true) {
            setNotification({ type: "success", message: "🎉 Coaching session complete! Your report is now ready." });
          }
          break;
        }
      } catch (error: unknown) {
        console.error("Submission error (attempt " + (retryCount + 1) + "):", error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        
        const errorMessage = error instanceof Error ? error.message : "Network error occurred";
        const userMessage = errorMessage.includes("ANTHROPIC_API_KEY")
          ? "AI service is not configured. Please contact support."
          : errorMessage.includes("Organization not found")
          ? "Session error. Please return to dashboard and try again."
          : "Connection failed after multiple attempts. Please check your internet and try again.";
        
        setNotification({ type: "error", message: userMessage });
        break;
      }
    }
    
    setSubmitting(false);
  }

  async function handleSkip(): Promise<void> {
    if (session === null || session === undefined || !canSkip || submitting) {
      return;
    }

    try {
      await incrementSkip({ sessionId: session._id, step: currentStep });
      // Note: Skip provides general guidance but shouldn't advance the step
      // The AI will guide them toward providing more specific information
      await handleSubmit("I'd like to skip this specific question for now. Can we explore this from a different angle?");
    } catch (error: unknown) {
      console.error("Skip error:", error);
      setNotification({ type: "error", message: "Failed to skip question. Please try again." });
    }
  }

  function handleCloseSession(): void {
    if (session === null || session === undefined) {
      return;
    }
    setShowCloseConfirm(true);
  }

  async function confirmCloseSession(): Promise<void> {
    if (session === null || session === undefined) {
      return;
    }
    setShowCloseConfirm(false);
    await closeSession({ sessionId: session._id });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification Toast */}
      {notification !== null && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className={`p-4 rounded-xl shadow-lg border-2 ${
            notification.type === "success" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" :
            notification.type === "error" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
            "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" && (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === "error" && (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === "info" && (
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${
                  notification.type === "success" ? "text-green-800 dark:text-green-200" :
                  notification.type === "error" ? "text-red-800 dark:text-red-200" :
                  "text-blue-800 dark:text-blue-200"
                }`}>{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Close Session?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to close this session? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => void confirmCloseSession()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                CoachFlux Session
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {session.framework} Framework · Step:{" "}
                <span className="uppercase font-medium">{currentStep}</span>
                {skipCount > 0 && (
                  <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                    ({skipCount}/2 skips used)
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto items-center">
              <ThemeToggle />
              {/* Voice Settings Button */}
              <button
                onClick={() => setShowVoiceSettings(true)}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                title="Voice Settings"
              >
                🎙️
              </button>
              {/* Auto-play Toggle */}
              <button
                onClick={toggleAutoPlay}
                className={`px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                  autoPlayVoice
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                title={autoPlayVoice ? 'Auto-play ON' : 'Auto-play OFF'}
              >
                {autoPlayVoice ? '🔊' : '🔇'}
              </button>
              {isSessionComplete === true && (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  📊 Report
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 sm:flex-none px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleCloseSession}
                className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8 lg:px-8 pb-32 sm:pb-40 lg:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                    {currentStep.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {STEP_DESCRIPTIONS[currentStep]}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 min-h-[400px]">
              {reflections !== null && reflections !== undefined && reflections.length > 0 ? (
                <div className="space-y-4">
                  {reflections.map((reflection) => (
                    <div key={reflection._id} className="space-y-3">
                      {/* User Input Message */}
                      {(reflection.userInput !== null && reflection.userInput !== undefined && reflection.userInput.length > 0) && (
                        <div className="flex justify-end">
                          <div className="max-w-[85%] sm:max-w-[75%]">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(reflection.createdAt).toLocaleTimeString()}
                              </span>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                You
                              </span>
                            </div>
                            <div className="bg-indigo-600 text-white rounded-lg rounded-tr-sm p-3 sm:p-4">
                              <p className="text-sm whitespace-pre-wrap">{reflection.userInput}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[75%]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                              Coach
                            </span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              {reflection.step}
                            </span>
                            {(reflection.userInput === null || reflection.userInput === undefined || reflection.userInput.length === 0) && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(reflection.createdAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-sm p-3 sm:p-4">
                            {formatReflectionDisplay(reflection.step, reflection.payload as Record<string, unknown>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Start by sharing your thoughts below...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </section>

          <aside className="hidden lg:block lg:col-span-1 space-y-4">
            {/* Dynamic Coaching Sidebar: Questions or Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentStep.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {COACHING_PROMPTS[currentStep].title}
                </h3>
              </div>
              
              {/* Show questions if no reflections, otherwise show summary */}
              {(reflections === null || reflections === undefined || reflections.length === 0) ? (
                <>
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Coaching Questions
                    </p>
                    <ul className="space-y-2">
                      {COACHING_PROMPTS[currentStep].questions.map((question, _idx) => (
                        <li key={_idx} className="flex gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                      {currentStep === "goal" ? "Focus on what you want to achieve and why it matters now." : ""}
                      {currentStep === "reality" ? "Describe the facts and current situation without judgment." : ""}
                      {currentStep === "options" ? "Generate multiple possibilities before evaluating them." : ""}
                      {currentStep === "will" ? "Commit to specific actions with clear ownership and timelines." : ""}
                      {currentStep === "review" ? "Reflect on your commitments and their alignment with your values." : ""}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Discussion Summary
                    </p>
                    
                    {/* Show summary of current step reflections */}
                    {reflections
                      ?.filter((r) => r.step === currentStep)
                      .slice(-1)
                      .map((reflection) => {
                        const payload = reflection.payload as Record<string, unknown>;
                        const coachReflection = payload['coach_reflection'];
                        
                        return (
                          <div key={reflection._id} className="space-y-3">
                            {/* Show coach's latest reflection */}
                            {typeof coachReflection === 'string' ? (
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-400 p-3 rounded-r-lg">
                                <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                                  💬 {coachReflection}
                                </p>
                              </div>
                            ) : null}
                            
                            {/* Show key points from payload */}
                            <div className="space-y-2 text-sm">
                              {Object.entries(payload)
                                .filter(([key]) => key !== 'coach_reflection')
                                .slice(0, 3)
                                .map(([key, value]) => {
                                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                                  
                                  if (Array.isArray(value) && value.length > 0) {
                                    return (
                                      <div key={key}>
                                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">{label}:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                          {value.slice(0, 3).map((item, idx) => {
                                            // Format options
                                            if (typeof item === 'object' && item !== null && 'label' in item) {
                                              const option = item as { label: string };
                                              return (
                                                <li key={idx} className="text-xs">
                                                  {option.label.substring(0, 60)}{option.label.length > 60 ? '...' : ''}
                                                </li>
                                              );
                                            }
                                            // Format actions
                                            if (typeof item === 'object' && item !== null && 'title' in item) {
                                              const action = item as { title: string };
                                              return (
                                                <li key={idx} className="text-xs">
                                                  {action.title.substring(0, 60)}{action.title.length > 60 ? '...' : ''}
                                                </li>
                                              );
                                            }
                                            // Simple strings
                                            const itemStr = String(item).substring(0, 60) + (String(item).length > 60 ? '...' : '');
                                            return (
                                              <li key={idx} className="text-xs">
                                                {itemStr}
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    );
                                  }
                                  
                                  if (typeof value === 'string' && value.length > 0) {
                                    return (
                                      <div key={key}>
                                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">{label}:</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                          {value.substring(0, 100) + (value.length > 100 ? '...' : '')}
                                        </p>
                                      </div>
                                    );
                                  }
                                  
                                  return null;
                                })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600 mt-4">
                    <details className="group">
                      <summary className="text-xs font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 list-none flex items-center gap-2">
                        <span className="transform group-open:rotate-90 transition-transform">▶</span>
                        View All Questions
                      </summary>
                      <ul className="mt-3 space-y-2">
                        {COACHING_PROMPTS[currentStep].questions.map((question, _idx) => (
                          <li key={_idx} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">•</span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </>
              )}
            </div>

            {/* GROW Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                GROW Progress
              </h3>
              <div className="space-y-2">
                {(["goal", "reality", "options", "will", "review"] as StepName[]).map(
                  (step) => (
                    <div
                      key={step}
                      className={`p-3 rounded-md transition-all ${
                        currentStep === step
                          ? "bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-600"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {currentStep === step ? (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            currentStep === step
                              ? "text-indigo-900 dark:text-indigo-100"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-xs sm:text-xs text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> This is a reflection tool, not therapy.
                  For urgent matters, contact HR or a healthcare professional.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Fixed Input Box at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="py-2 sm:py-3">
            <div className="max-w-4xl">
              <div className="flex gap-2 items-end">
                {/* Voice Control Buttons */}
                <VoiceButtons
                  onStartListening={voiceControl.startListening}
                  onStopListening={voiceControl.stopListening}
                  onStopSpeaking={voiceControl.stopSpeaking}
                  isListening={voiceControl.isListening}
                  isSpeaking={voiceControl.isSpeaking}
                  disabled={submitting}
                  error={voiceControl.error}
                />
                
                {/* Input with inline send button and live transcript overlay */}
                <div className="flex-1 relative">
                  {/* Live transcript overlay */}
                  <LiveTranscript
                    transcript={voiceControl.transcript}
                    interimTranscript={voiceControl.interimTranscript}
                    isListening={voiceControl.isListening}
                  />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSubmit();
                      }
                    }}
                    onFocus={(e) => {
                      // Scroll input into view on mobile when keyboard appears
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                    placeholder={`Share your thoughts for the ${currentStep ?? 'current'} step...`}
                    className="w-full pl-3 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows={2}
                    disabled={submitting}
                    maxLength={800}
                  />
                  {/* Send button inside input */}
                  <button
                    onClick={() => void handleSubmit()}
                    disabled={text.trim() === '' || submitting}
                    className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    title="Send (Enter)"
                  >
                    {submitting ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Skip button */}
                {canSkip && (
                  <button
                    onClick={() => void handleSkip()}
                    disabled={submitting}
                    className="px-2 sm:px-3 py-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-md hover:bg-orange-100 dark:hover:bg-orange-800/30 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors border border-orange-200 dark:border-orange-800 whitespace-nowrap"
                    title={`Skip this question (${2 - skipCount} skips remaining)`}
                  >
                    Skip
                  </button>
                )}
              </div>
              
              {/* Footer info */}
              <div className="mt-1 sm:mt-1.5 flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span className="hidden sm:inline">
                  {canSkip ? `${2 - skipCount} skip${2 - skipCount === 1 ? '' : 's'} available` : 'No skips remaining'}
                </span>
                <span className="sm:hidden">
                  {canSkip ? `${2 - skipCount} skip${2 - skipCount === 1 ? '' : 's'}` : 'No skips'}
                </span>
                <span>{text.length}/800</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show Report Modal */}
      {showReport && (
        <SessionReport 
          sessionId={session._id} 
          onClose={() => setShowReport(false)} 
        />
      )}

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
        selectedVoice={selectedVoice}
        onVoiceSelect={handleVoiceSelect}
      />

      {/* Feedback Widget - Only show when session is complete */}
      {isSessionComplete && <FeedbackWidget sessionId={session._id} />}
    </div>
  );
}
