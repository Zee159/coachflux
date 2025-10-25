import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SessionReport } from "./SessionReport";
import { ThemeToggle } from "./ThemeToggle";
import { FeedbackWidget } from "./FeedbackWidget";
import { StarRating } from "./StarRating";
import { useVoiceRecognition, useVoiceSynthesis } from "../hooks";
import { VoiceButton } from "./VoiceButton";
import { LiveTranscriptDisplay } from "./LiveTranscriptDisplay";
import { VoiceSettingsModal } from "./VoiceSettingsModal";
import { CompactConfidenceDisplay } from "./ConfidenceMeter";
import { NudgeIndicator } from "./NudgeDisplay";
import { ConfidenceTracker } from "./ConfidenceTracker";

type StepName = "introduction" | "goal" | "reality" | "options" | "will" | "review" | "clarity" | "ownership" | "mapping" | "practice" | "anchoring";

function formatReflectionDisplay(step: string, payload: Record<string, unknown>): JSX.Element {
  const entries = Object.entries(payload);
  
  // Separate coach_reflection from other fields
  const coachReflection = entries.find(([key]) => key === 'coach_reflection');
  const otherEntries = entries.filter(([key]) => key !== 'coach_reflection');
  
  // Extract confidence tracking for COMPASS framework
  const confidenceTracking = payload['confidence_tracking'] as {
    initial_confidence?: number;
    post_clarity_confidence?: number;
    post_ownership_confidence?: number;
    final_confidence?: number;
    confidence_change?: number;
    confidence_percent_increase?: number;
  } | undefined;
  
  // Extract nudge usage for COMPASS framework
  const nudgeUsed = payload['nudge_used'] as {
    nudge_type?: string;
    nudge_category?: string;
    nudge_name?: string;
    triggered_at?: string;
    user_input?: string;
  } | undefined;
  
  return (
    <div className="space-y-4">
      {/* Coach Reflection - displayed first with special styling */}
      {coachReflection !== undefined && (
        <div className="bg-white dark:bg-gray-700 border-l-4 border-indigo-600 dark:border-indigo-400 p-3 rounded-r-lg">
          <div className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed whitespace-pre-line">
            💬 {String(coachReflection[1])}
          </div>
        </div>
      )}
      
      {/* COMPASS Framework: Confidence and Nudge Indicators */}
      {(step === 'ownership' || step === 'mapping' || step === 'practice') && (
        <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Confidence Display */}
          {confidenceTracking !== undefined && confidenceTracking !== null && (
            <div className="flex items-center space-x-2">
              {step === 'ownership' && confidenceTracking.initial_confidence !== undefined && confidenceTracking.initial_confidence !== null && (
                <CompactConfidenceDisplay 
                  confidence={confidenceTracking.initial_confidence} 
                  label="Initial" 
                />
              )}
              {step === 'ownership' && confidenceTracking.post_clarity_confidence !== undefined && confidenceTracking.post_clarity_confidence !== null && (
                <CompactConfidenceDisplay 
                  confidence={confidenceTracking.post_clarity_confidence} 
                  label="Current" 
                />
              )}
              {step === 'mapping' && confidenceTracking.post_ownership_confidence !== undefined && confidenceTracking.post_ownership_confidence !== null && (
                <CompactConfidenceDisplay 
                  confidence={confidenceTracking.post_ownership_confidence} 
                  label="Current" 
                />
              )}
              {step === 'practice' && confidenceTracking.final_confidence !== undefined && confidenceTracking.final_confidence !== null && (
                <CompactConfidenceDisplay 
                  confidence={confidenceTracking.final_confidence} 
                  label="Final" 
                />
              )}
            </div>
          )}
          
          {/* Nudge Indicator */}
          {nudgeUsed !== undefined && nudgeUsed !== null && (
            <NudgeIndicator 
              nudgeType={nudgeUsed.nudge_type ?? ''} 
              nudgeCategory={nudgeUsed.nudge_category ?? ''} 
            />
          )}
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
                    // Handle actions array specially (GROW format with 'title' or COMPASS format with 'action')
                    if (typeof item === 'object' && item !== null && ('title' in item || 'action' in item)) {
                      const growAction = item as { title?: string; owner?: string; due_days?: number };
                      const compassAction = item as { action?: string; timeline?: string; resources_needed?: string };
                      const actionText = growAction.title ?? compassAction.action ?? '';
                      const timeline = compassAction.timeline;
                      const resources = compassAction.resources_needed;
                      const owner = growAction.owner;
                      const dueDays = growAction.due_days;
                      
                      return (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{actionText}</span>
                          {(timeline !== null && timeline !== undefined && timeline.length > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> • {timeline}</span>}
                          {(resources !== null && resources !== undefined && resources.length > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> • Resources: {resources}</span>}
                          {(owner !== null && owner !== undefined && owner.length > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> • Owner: {owner}</span>}
                          {(dueDays !== null && dueDays !== undefined && dueDays > 0) && <span className="text-xs text-gray-600 dark:text-gray-400"> • Due in {dueDays} days</span>}
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
  introduction: "Welcome to the session. Learn about the framework and give your consent to begin.",
  goal: "Clarify your desired outcome and timeframe.",
  reality: "Assess your current situation, constraints, resources, and risks.",
  options: "Explore at least two viable options (you can ask for AI suggestions).",
  will: "Choose an option and define specific actions.",
  review: "Review key takeaways and define your next immediate step.",
  clarity: "Understand the change and identify what you can control.",
  ownership: "Transform resistance into commitment. Build confidence.",
  mapping: "Identify ONE specific action with day, time, and backup plan.",
  practice: "Lock in 10/10 commitment and recognize your transformation.",
  anchoring: "Make it stick - design your environment and lead by example.",
};

const STEP_LABELS: Record<StepName, string> = {
  introduction: "👋 WELCOME: Understanding the Framework",
  goal: "🎯 GOAL: What do you want to achieve?",
  reality: "📍 REALITY: What's your current situation?",
  options: "🤔 OPTIONS: What are your possibilities?",
  will: "✅ WILL: What will you actually do?",
  review: "🔍 REVIEW: What have you learned?",
  clarity: "🧭 CLARITY: What's changing? What can you control?",
  ownership: "💪 OWNERSHIP: Building your confidence and commitment",
  mapping: "🗺️ MAPPING: Your specific action plan",
  practice: "🎯 PRACTICE: Locking in your commitment",
  anchoring: "⚓ ANCHORING: How will you make it stick and lead?",
};

const STEP_TIPS: Record<StepName, string> = {
  introduction: "Take a moment to understand what this session will be like. This sets you up for success.",
  goal: "Be specific. Instead of 'do better,' say 'finish my certification by March.'",
  reality: "Describe what's true NOW, not what you wish were true.",
  options: "Let yourself brainstorm. Even wild ideas can spark practical solutions.",
  will: "Pick ONE option. You can always revisit others later.",
  review: "Reflect on what surprised you. That's where learning happens.",
  clarity: "You can't control the change, but you CAN control your response and attitude.",
  ownership: "Your confidence can increase 3-4 points in this stage. Let it happen.",
  mapping: "Be specific: 'Thursday 2-4pm' not 'soon'. Small action beats big plan.",
  practice: "You've had a transformation. Recognize it. Celebrate it.",
  anchoring: "Your team watches what you do, not what you say. Design your environment and lead visibly.",
};

const COACHING_PROMPTS: Record<StepName, { title: string; questions: string[] }> = {
  introduction: {
    title: "Welcome",
    questions: [
      "Does this framework feel right for what you want to work on today?",
      "Are you ready to begin?"
    ]
  },
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
      "What's one option you're considering?",
      "What are the pros and cons of that option?",
      "Would you like to share another option or get AI suggestions?",
      "Which option would you like to move forward with?"
    ]
  },
  will: {
    title: "Commit to Action",
    questions: [
      "What action will you take?",
      "When will you do it?",
      "Who's responsible?",
      "How will you track progress?",
      "What support do you need?"
    ]
  },
  review: {
    title: "Review & Summarize",
    questions: [
      "What are the key takeaways from this conversation?",
      "What's your next immediate step?"
    ]
  },
  clarity: {
    title: "Understand the Change",
    questions: [
      "What specific change are you dealing with?",
      "On a scale of 1-5, how well do you understand what's happening and why?",
      "What's most confusing or unclear about this change?",
      "What parts of this can you control vs. what's beyond your control?"
    ]
  },
  ownership: {
    title: "Build Confidence & Commitment",
    questions: [
      "On a scale of 1-10, how confident do you feel about navigating this successfully?",
      "What's making you feel unconfident or worried?",
      "What's the cost if you stay stuck in resistance?",
      "What could you gain personally if you adapt well to this?",
      "Tell me about a time you successfully handled change before.",
      "What strengths from that experience can you use now?",
      "Where's your confidence now, 1-10?"
    ]
  },
  mapping: {
    title: "Create Specific Action Plan",
    questions: [
      "Given what you've realized, what's ONE small action you could take this week?",
      "What's the smallest possible step? What feels doable?",
      "What specifically will you do, and when? (day, time, duration)",
      "What might get in your way, and how will you handle that?",
      "Who could support you with this?"
    ]
  },
  practice: {
    title: "Lock In Commitment",
    questions: [
      "On a scale of 1-10, how confident are you that you'll do this?",
      "What would make it a 10?",
      "After you complete this action, what will you have proven to yourself?",
      "When we started, confidence was [X]/10. Where is it now?",
      "What's the one thing you're taking away from today?"
    ]
  },
  anchoring: {
    title: "Make It Stick (Personal + Team)",
    questions: [
      "What's the ONE thing in your environment that makes the old way easier?",
      "What could you change to make the new way easier?",
      "What habits do you need to build?",
      "How will you lead by example?",
      "Who can hold you accountable?"
    ]
  }
};

export function SessionView() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [notification, setNotification] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastReflectionRef = useRef<string | null>(null);

  // Voice recognition and synthesis hooks
  const { isListening, transcript, interimTranscript, startListening, stopListening } = useVoiceRecognition({
    onTranscript: (text) => {
      // Update text state first so user sees the transcript
      setText(text);
      // Then submit after a brief delay to ensure state is updated
      setTimeout(() => {
        void handleSubmit(text);
      }, 100);
    },
    language: 'en-GB',
    silenceThresholdMs: 3000,
    autoSendOnSilence: true,
  });

  const { isSpeaking, speak, stop: stopSpeaking } = useVoiceSynthesis({
    rate: 0.95,
    pitch: 1.0,
    volume: 1.0,
    voice: selectedVoice,
  });

  // Cleanup voice when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Stop voice recognition if active
      if (isListening) {
        stopListening();
      }
      // Stop voice synthesis if speaking
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [isListening, isSpeaking, stopListening, stopSpeaking]);

  // Cleanup voice when user navigates away or closes tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Stop voice recognition if active
      if (isListening) {
        stopListening();
      }
      // Stop voice synthesis if speaking
      if (isSpeaking) {
        stopSpeaking();
      }
    };

    const handleVisibilityChange = () => {
      // Stop voice when tab becomes hidden (user switches tabs)
      if (document.hidden) {
        if (isListening) {
          stopListening();
        }
        if (isSpeaking) {
          stopSpeaking();
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isListening, isSpeaking, stopListening, stopSpeaking]);

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
  const generateReviewAnalysisAction = useAction(api.coach.generateReviewAnalysis);
  const closeSession = useMutation(api.mutations.closeSession);
  const incrementSkip = useMutation(api.mutations.incrementSkipCount);
  const submitRating = useMutation(api.mutations.submitSessionRating);

  // Keep mutation references stable for effects to avoid dependency array size changes
  const closeSessionRef = useRef(closeSession);
  useEffect(() => {
    closeSessionRef.current = closeSession;
  }, [closeSession]);

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

  // Load voice preferences from localStorage
  useEffect(() => {
    const savedVoiceName = localStorage.getItem('coachflux_voice');
    const savedAutoPlay = localStorage.getItem('coachflux_autoplay');

    if (savedAutoPlay !== null) {
      setAutoPlayVoice(savedAutoPlay === 'true');
    }

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Try to load saved voice first
      if (savedVoiceName !== null && savedVoiceName.length > 0) {
        const savedVoice = voices.find((v) => v.name === savedVoiceName);
        if (savedVoice !== null && savedVoice !== undefined) {
          setSelectedVoice(savedVoice);
          return;
        }
      }
      
      // Default to Microsoft Steffan Online (Natural)
      const defaultVoice = voices.find((v) => v.name.includes('Steffan') && v.name.includes('Natural'));
      if (defaultVoice !== null && defaultVoice !== undefined) {
        setSelectedVoice(defaultVoice);
        localStorage.setItem('coachflux_voice', defaultVoice.name);
      }
    };

    loadVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
  }, []);

  // Auto-play coach responses with voice
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (!autoPlayVoice || reflections === null || reflections === undefined || reflections.length === 0) {
      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
      };
    }

    const latestReflection = reflections[reflections.length - 1];
    if (latestReflection === undefined) {
      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
      };
    }

    const reflectionId = latestReflection._id;

    // Only play if this is a new reflection
    if (lastReflectionRef.current === reflectionId) {
      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
      };
    }

    lastReflectionRef.current = reflectionId;

    // Extract coach_reflection text to speak
    const payload = latestReflection.payload as Record<string, unknown>;
    const coachReflection = payload['coach_reflection'];

    if (typeof coachReflection === 'string' && coachReflection.length > 0) {
      // Small delay to let the UI update first
      timeoutId = setTimeout(() => {
        speak(coachReflection);
      }, 500);
    }

    // Cleanup: clear timeout if component unmounts before it fires
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [reflections, autoPlayVoice, speak]);

  // Detect review step completion and trigger report generation (framework-aware)
  useEffect(() => {
    if (session?.step !== 'review' || session === null || session === undefined || reflections === null || reflections === undefined) {
      return;
    }

    // Check if session is already closed
    if (session.closedAt !== null && session.closedAt !== undefined) {
      return;
    }

    // Check if we're already generating
    if (generatingReport) {
      return;
    }

    // Find the LAST review reflection (in case there are multiple)
    const reviewReflections = reflections.filter((r) => r.step === 'review');
    const reviewReflection = reviewReflections[reviewReflections.length - 1];
    if (reviewReflection === undefined || reviewReflection === null) {
      return;
    }

    const reviewPayload = reviewReflection.payload as Record<string, unknown>;
    
    // Check if analysis is already complete (to prevent duplicate generation)
    const hasSummary = typeof reviewPayload['summary'] === 'string';
    const hasAnalysis = typeof reviewPayload['ai_insights'] === 'string' && reviewPayload['ai_insights'].length > 0;
    
    // Framework-specific completion detection
    let isReviewComplete = false;
    
    if (session.framework === 'GROW') {
      // GROW: key_takeaways + immediate_step
      const hasKeyTakeaways = typeof reviewPayload['key_takeaways'] === 'string' && reviewPayload['key_takeaways'].length > 0;
      const hasImmediateStep = typeof reviewPayload['immediate_step'] === 'string' && reviewPayload['immediate_step'].length > 0;
      isReviewComplete = hasKeyTakeaways && hasImmediateStep;
    } else if (session.framework === 'COMPASS') {
      // COMPASS: primary_barrier + next_actions + confidence_level
      const hasPrimaryBarrier = typeof reviewPayload['primary_barrier'] === 'string' && reviewPayload['primary_barrier'].length > 0;
      const hasNextActions = Array.isArray(reviewPayload['next_actions']) && reviewPayload['next_actions'].length > 0;
      const hasConfidenceLevel = typeof reviewPayload['confidence_level'] === 'number';
      isReviewComplete = hasPrimaryBarrier && hasNextActions && hasConfidenceLevel;
    }

    // If review complete but no summary/analysis yet, trigger completion
    if (isReviewComplete && !hasSummary && !hasAnalysis) {
      const closeSessionMutation = closeSessionRef.current;
      const completeSession = async () => {
        setGeneratingReport(true);

        try {
          if (session.framework === 'GROW') {
            // GROW: Generate full AI analysis
            const analysisResult = await generateReviewAnalysisAction({
              sessionId: session._id,
              orgId: session.orgId,
              userId: session.userId
            });

            if (analysisResult.ok) {
              setNotification({ type: "success", message: "🎉 Coaching session complete! Your report is now ready." });
            } else {
              setNotification({ type: "error", message: `Report generation failed: ${analysisResult.message ?? 'Unknown error'}` });
            }
          } else if (session.framework === 'COMPASS' && closeSessionMutation !== undefined) {
            // COMPASS: Just close the session (no AI analysis needed)
            await closeSessionMutation({ sessionId: session._id });
            setNotification({ type: "success", message: "🎉 COMPASS session complete! Your report is now ready." });
          }
        } catch (error: unknown) {
          console.error("Session completion error:", error);
          setNotification({ type: "error", message: "Failed to complete session. Please try again." });
        } finally {
          setGeneratingReport(false);
        }
      };

      void completeSession();
    }
  }, [session, reflections, generatingReport, generateReviewAnalysisAction]);



  if (session === null || session === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading session...</div>
      </div>
    );
  }

  const currentStep = session.step as StepName;
  
  // Framework-specific step sequences
  const GROW_STEPS = ["introduction", "goal", "reality", "options", "will", "review"];
  const COMPASS_STEPS = ["introduction", "clarity", "ownership", "mapping", "practice"]; // New 4-stage COMPASS model
  const frameworkSteps = session.framework === "COMPASS" ? COMPASS_STEPS : GROW_STEPS;
  const totalSteps = frameworkSteps.length;
  const currentStepIndex = Math.max(0, frameworkSteps.indexOf(currentStep)); // Fallback to 0 if step not found
  
  // Get skip count for current step
  const sessionState = session.state as { skips?: Record<string, number> } | undefined;
  const skipCount = sessionState?.skips?.[currentStep] ?? 0;
  const canSkip = skipCount < 2 && currentStep !== "review" && currentStep !== "introduction"; // No skip on introduction or review step
  
  // Check if session is complete (review step done OR session closed)
  // Find the LAST review reflection (in case there are multiple after analysis generation)
  const reviewReflections = reflections?.filter((r) => r.step === "review") ?? [];
  const reviewReflection = reviewReflections[reviewReflections.length - 1];
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;
  const isReviewComplete = Boolean(
    reviewPayload !== null && reviewPayload !== undefined &&
    typeof reviewPayload['summary'] === 'string' && reviewPayload['summary'].length > 0 &&
    typeof reviewPayload['ai_insights'] === 'string' && reviewPayload['ai_insights'].length > 0 &&
    Array.isArray(reviewPayload['unexplored_options']) && reviewPayload['unexplored_options'].length > 0 &&
    Array.isArray(reviewPayload['identified_risks']) && reviewPayload['identified_risks'].length > 0 &&
    Array.isArray(reviewPayload['potential_pitfalls']) && reviewPayload['potential_pitfalls'].length > 0
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
          const errorMsg = result.message ?? "Unable to process your input. Please try rephrasing.";
          const hintMsg = (result as { hint?: string }).hint;
          const fullMessage = hintMsg !== undefined ? `${errorMsg}\n\n${hintMsg}` : errorMsg;
          setNotification({ type: "error", message: fullMessage });
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

  const handleVoiceSelect = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    localStorage.setItem('coachflux_voice', voice.name);
  };

  const handleRatingSubmit = (rating: number): void => {
    if (session === null || session === undefined) {
      return;
    }

    void (async () => {
      try {
        await submitRating({ sessionId: session._id, rating });
        setRatingSubmitted(true);
        setNotification({ type: "success", message: "Thank you for your feedback!" });
      } catch (error: unknown) {
        console.error("Rating submission error:", error);
        setNotification({ type: "error", message: "Failed to submit rating. Please try again." });
      }
    })();
  };

  const toggleAutoPlay = () => {
    const newValue = !autoPlayVoice;
    setAutoPlayVoice(newValue);
    localStorage.setItem('coachflux_autoplay', String(newValue));
  };

  async function handleContinueToNextStep(): Promise<void> {
    if (session === null || session === undefined || submitting || currentStep === 'review') {
      return;
    }

    try {
      await incrementSkip({ sessionId: session._id, step: currentStep });
      
      // For OPTIONS step, use explicit "proceed to will step" phrase to trigger user_ready_to_proceed
      // For other steps, use generic continue message
      const continueMessage = currentStep === 'options' 
        ? "proceed to will step"
        : "I'd like to move to the next step now with what we've covered so far.";
      
      await handleSubmit(continueMessage);
    } catch (error: unknown) {
      console.error("Continue error:", error);
      setNotification({ type: "error", message: "Failed to continue. Please try again." });
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

      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                Step {currentStepIndex + 1} of {totalSteps}:{" "}
                <span className="text-indigo-600 dark:text-indigo-400 capitalize">{currentStep}</span>
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300 progress-bar-dynamic"
                style={{['--progress-width' as string]: `${((currentStepIndex + 1) / totalSteps) * 100}%`} as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8 lg:px-8 pb-40 sm:pb-44 lg:pb-48">
        <div className={`grid grid-cols-1 ${isSessionComplete ? '' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
          <section className={`${isSessionComplete ? '' : 'lg:col-span-2'} bg-white dark:bg-gray-800 rounded-lg shadow`}>
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
                  {reflections.map((reflection, index) => {
                    // Check if this is the first reflection of a new step
                    const isFirstOfStep = index === 0 || reflections[index - 1]?.step !== reflection.step;
                    const stepTip = isFirstOfStep ? (STEP_TIPS[reflection.step as StepName] ?? null) : null;
                    const stepLabel = isFirstOfStep ? (STEP_LABELS[reflection.step as StepName] ?? null) : null;
                    
                    // Check if this is the last reflection and session is complete
                    const isLastReflection = index === reflections.length - 1;
                    const showCompletionActions = isLastReflection && isSessionComplete;
                    
                    return (
                    <div key={reflection._id} className="space-y-3">
                      {/* Step Label and Tip - shown at start of each new step */}
                      {isFirstOfStep && stepLabel !== null && stepTip !== null && (
                        <div className="space-y-2 mb-4">
                          {/* Step Label */}
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                              {stepLabel}
                            </p>
                          </div>
                          {/* Step Tip */}
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-2">
                              <span className="text-amber-600 dark:text-amber-400 text-lg">💡</span>
                              <div>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                                  Tip for this step:
                                </p>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                  {stepTip}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
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
                          
                          {/* ⚠️ FIX P1-1: Display nudges used in this reflection */}
                          {(() => {
                            const payload = reflection.payload as Record<string, unknown> | undefined;
                            if (payload === null || payload === undefined || typeof payload !== 'object') {
                              return null;
                            }
                            
                            const nudgesUsed = payload['nudges_used'];
                            if (!Array.isArray(nudgesUsed) || nudgesUsed.length === 0) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {nudgesUsed.map((nudge: unknown, idx: number) => {
                                  const nudgeObj = nudge as Record<string, string>;
                                  return (
                                    <NudgeIndicator
                                      key={idx}
                                      nudgeType={nudgeObj['nudge_type'] ?? ''}
                                      nudgeCategory={nudgeObj['nudge_category'] ?? ''}
                                      className="text-xs"
                                    />
                                  );
                                })}
                              </div>
                            );
                          })()}
                          
                          {/* ⚠️ FIX P1-2: Display confidence tracker when confidence captured */}
                          {(() => {
                            const payload = reflection.payload as Record<string, unknown> | undefined;
                            if (payload === null || payload === undefined || typeof payload !== 'object') {
                              return null;
                            }
                            
                            const initialConf = payload['initial_confidence'];
                            const currentConf = payload['current_confidence'];
                            const finalConf = payload['final_confidence'];
                            
                            // Ownership stage: Show current confidence vs initial
                            if (reflection.step === 'ownership' && 
                                typeof initialConf === 'number' &&
                                typeof currentConf === 'number' &&
                                currentConf > initialConf) {
                              return (
                                <div className="mt-3">
                                  <ConfidenceTracker
                                    initialConfidence={initialConf}
                                    currentConfidence={currentConf}
                                    stage="ownership"
                                  />
                                </div>
                              );
                            }
                            
                            // Practice stage: Show final confidence transformation
                            if (reflection.step === 'practice' && 
                                typeof initialConf === 'number' &&
                                typeof finalConf === 'number') {
                              return (
                                <div className="mt-3">
                                  <ConfidenceTracker
                                    initialConfidence={initialConf}
                                    currentConfidence={finalConf}
                                    stage="practice"
                                  />
                                </div>
                              );
                            }
                            
                            return null;
                          })()}
                        </div>
                      </div>
                      
                      {/* Completion Actions - shown after last message when session is complete */}
                      {showCompletionActions && (
                        <div className="mt-6 space-y-3">
                          {/* Completion message */}
                          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">🎉</span>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                                  Session Complete!
                                </p>
                                <p className="text-sm text-green-800 dark:text-green-200">
                                  Your coaching session is complete. View your full report or scroll to the top to access additional options.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Star Rating */}
                          <StarRating 
                            onRatingSubmit={handleRatingSubmit}
                            isSubmitted={ratingSubmitted}
                            submittedRating={session.rating ?? 0}
                          />
                          
                          {/* Action buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => setShowReport(true)}
                              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <span>📊</span>
                              <span>View Full Report</span>
                            </button>
                            <button
                              onClick={() => navigate("/dashboard")}
                              className="flex-1 px-4 py-3 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <span>📋</span>
                              <span>Dashboard</span>
                            </button>
                            <button
                              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <span>↑</span>
                              <span>Scroll to Top</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );})}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Start by sharing your thoughts below...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </section>

          {/* Hide sidebar when session is complete to give full focus to summary */}
          {!isSessionComplete && (
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

            {/* Framework Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {session.framework} Progress
              </h3>
              <div className="space-y-2">
                {(frameworkSteps as StepName[]).map(
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
          )}
        </div>
      </main>

      {/* Fixed Input Box at Bottom - HIDE IF SESSION IS CLOSED */}
      {/* ⚠️ FIX P0-2: Show input during all active coaching stages, including introduction and review */}
      {(currentStep === 'introduction' || currentStep === 'clarity' || currentStep === 'ownership' || currentStep === 'mapping' || currentStep === 'practice' || currentStep === 'goal' || currentStep === 'reality' || currentStep === 'options' || currentStep === 'will' || currentStep === 'review' || currentStep === 'anchoring') && !isSessionComplete && (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 safe-area-bottom">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="py-3 sm:py-4">
            <div className="max-w-4xl">
              <div className="flex flex-col gap-0">
                {/* Input controls row */}
                <div className="flex gap-2 items-stretch">
                  {/* Voice Button */}
                  <VoiceButton
                    isListening={isListening}
                    disabled={submitting || isSpeaking}
                    onStart={startListening}
                    onStop={stopListening}
                  />

                  {/* Input with inline send button and live transcript overlay */}
                  <div className="flex-1 relative">
                    {/* Live transcript overlay */}
                    <LiveTranscriptDisplay
                      transcript={transcript}
                      interimTranscript={interimTranscript}
                      isListening={isListening}
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
                        // Use a longer delay to ensure keyboard is fully rendered
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          // Additional scroll to ensure visibility
                          window.scrollTo({
                            top: document.documentElement.scrollHeight,
                            behavior: 'smooth'
                          });
                        }, 400);
                      }}
                      placeholder={`Share your thoughts for the ${currentStep ?? 'current'} step...`}
                      className="w-full h-full pl-3 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={2}
                      disabled={submitting}
                      maxLength={800}
                    />
                    {/* Send button inside input - matches input height */}
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={text.trim() === '' || submitting}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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
                  
                  {/* Skip button - matches input height */}
                  {canSkip && (
                    <button
                      onClick={() => void handleSkip()}
                      disabled={submitting}
                      className="h-full px-4 py-2 text-sm font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800/30 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors border border-orange-200 dark:border-orange-800 whitespace-nowrap flex items-center justify-center"
                      title={`Skip this question (${2 - skipCount} skips left)`}
                    >
                      Skip
                    </button>
                  )}
                </div>
                
                {/* Bottom labels row */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1 -mt-5">
                  <span>{text.length}/800</span>
                  {canSkip && (
                    <span>
                      {2 - skipCount} skip{2 - skipCount === 1 ? '' : 's'} left
                    </span>
                  )}
                </div>
                
                {/* Continue to next step button - subtle text link */}
                {!submitting && (
                  <button
                    onClick={() => void handleContinueToNextStep()}
                    disabled={submitting}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-center py-1"
                    title="Move to the next step with what you've shared"
                  >
                    Continue to next step →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Generating Report Loading Modal */}
      {generatingReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              {/* Animated spinner */}
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Generating Your Report
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Analyzing your session and creating personalized insights...
              </p>
              
              {/* Progress indicators */}
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Reviewing conversation history</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Identifying key insights</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Generating recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
