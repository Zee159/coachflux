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
import { YesNoSelector } from "./YesNoSelector";
import { OptionsSelector } from "./OptionsSelector";
import { GapSelector } from "./GapSelector";
import { GapPrioritySelector } from "./GapPrioritySelector";
import { GapRoadmapCard } from "./GapRoadmapCard";
import { CompletedGapCard } from "./CompletedGapCard";
import { ControlLevelSelector } from "./ControlLevelSelector";
import { ActionValidator } from "./ActionValidator";
import { ConfidenceScaleSelector } from "./ConfidenceScaleSelector";
import { MindsetSelector } from "./MindsetSelector";
import { UnderstandingScaleSelector } from "./UnderstandingScaleSelector";
import { StepConfirmationButtons } from "./StepConfirmationButtons";
import { AmendmentModal } from "./AmendmentModal";
import { ReviewConfidenceSelector } from "./ReviewConfidenceSelector";

// Framework-specific step types
type GROWStepName = "introduction" | "goal" | "reality" | "options" | "will" | "review";
type COMPASSStepName = "introduction" | "clarity" | "ownership" | "mapping" | "practice";
type CAREERStepName = "INTRODUCTION" | "ASSESSMENT" | "GAP_ANALYSIS" | "ROADMAP" | "REVIEW";
type StepName = GROWStepName | COMPASSStepName | CAREERStepName;

// AI Suggested Gap interface
interface AISuggestedGap {
  id: string;
  type: 'skill' | 'experience';
  gap: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

function formatReflectionDisplay(step: string, payload: Record<string, unknown>): JSX.Element {
  const entries = Object.entries(payload);
  
  // Separate coach_reflection from other fields
  const coachReflection = entries.find(([key]) => key === 'coach_reflection');
  
  // Filter out internal/debug fields that shouldn't be shown to users
  const internalFields = ['user_ready_to_proceed', 'options_state', 'ai_suggestion_count'];
  
  // Hide 'options' field in Options step (shown via OptionsSelector buttons instead)
  // Hide 'selected_option_ids' field (internal state)
  // Hide 'suggested_action' field in Will step (shown via ActionValidator buttons instead)
  // Hide 'current_option_index', 'current_option_label', 'total_options' (internal state)
  // Hide 'ai_suggested_roadmap' (shown via RoadmapBuilder component)
  // Hide 'ai_suggested_gaps' (shown via GapSelector component)
  // Hide 'selected_gap_ids', 'selected_learning_ids', 'selected_networking_ids', 'selected_experience_ids' (internal state)
  const buttonFields = [
    'options', 
    'selected_option_ids', 
    'suggested_action', 
    'current_option_index', 
    'current_option_label', 
    'total_options',
    'ai_suggested_roadmap',
    'ai_suggested_gaps',
    'gap_cards',
    'selected_gap_ids',
    'selected_learning_ids',
    'selected_networking_ids',
    'selected_experience_ids',
    'development_priorities'
  ];
  
  const otherEntries = entries.filter(([key]) => 
    key !== 'coach_reflection' && !internalFields.includes(key) && !buttonFields.includes(key)
  );
  
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
  
  // Filter out system markers from display
  const coachReflectionText = coachReflection !== undefined ? String(coachReflection[1]) : '';
  const isSystemMarker = coachReflectionText.startsWith('[') && coachReflectionText.endsWith(']');
  
  return (
    <div className="space-y-4">
      {/* Coach Reflection - displayed first with special styling */}
      {coachReflection !== undefined && !isSystemMarker && (
        <div className="bg-white dark:bg-gray-700 border-l-4 border-indigo-600 dark:border-indigo-400 p-3 rounded-r-lg">
          <div className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed whitespace-pre-line">
            💬 {coachReflectionText}
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
  INTRODUCTION: "Welcome to Career Coach. Confirm your career development focus.",
  ASSESSMENT: "Assess your current role, experience, and target career goal.",
  GAP_ANALYSIS: "Identify skill gaps, experience gaps, and transferable strengths.",
  ROADMAP: "Create learning, networking, and experience actions with milestones.",
  REVIEW: "Reflect on your career plan and measure confidence growth.",
};

const STEP_LABELS: Record<StepName, string> = {
  introduction: "👋 WELCOME",
  goal: "🎯 GOAL",
  reality: "📍 REALITY",
  options: "🤔 OPTIONS",
  will: "✅ WILL",
  review: "🔍 REVIEW",
  clarity: "🧭 CLARITY",
  ownership: "💪 OWNERSHIP",
  mapping: "🗺️ MAPPING",
  practice: "🎯 PRACTICE",
  INTRODUCTION: "💼 INTRODUCTION",
  ASSESSMENT: "📊 ASSESSMENT",
  GAP_ANALYSIS: "🔍 GAP ANALYSIS",
  ROADMAP: "🗺️ ROADMAP",
  REVIEW: "✨ REVIEW",
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
  INTRODUCTION: "This is career-focused coaching. Be clear about what type of support you need.",
  ASSESSMENT: "Be honest about where you are. This clarity helps us build the right plan.",
  GAP_ANALYSIS: "Focus on actionable gaps, not vague concepts. 'Python' beats 'technical skills'.",
  ROADMAP: "Specific actions with timelines. 'Coursera Python course in March' beats 'learn Python'.",
  REVIEW: "Your confidence gain shows real progress. Trust the process you've created.",
};

const COACHING_PROMPTS: Record<StepName, { title: string; questions: string[] }> = {
  introduction: {
    title: "Welcome",
    questions: [
      "Does this framework feel right for what you're facing today?"
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
      "What workplace change are you navigating right now?",
      "How is this affecting you personally - your day-to-day work, your role, or your team?",
      "On a scale of 1-5, how well do you understand what's happening and why?",
      "How confident do you feel about navigating this successfully? (1-10)",
      "How would you describe your current mindset about this change?",
      "Thinking about this change, how much control do you have? (High/Mixed/Low)",
      "What specifically can you control or influence in this situation?",
      "Is there anything else about this change that feels important to mention?"
    ]
  },
  ownership: {
    title: "Build Confidence & Commitment",
    questions: [
      "What's making you feel unconfident or worried?",
      "What could you gain personally if you adapt well to this?",
      "Tell me about a time you successfully handled change before.",
      "After everything we've discussed, where's your confidence now? (1-10)"
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
      "When we started, confidence was {initial_confidence}/10. Where is it now?",
      "What's the one thing you're taking away from today?"
    ]
  },
  INTRODUCTION: {
    title: "Welcome to Career Coach",
    questions: [
      "Are you looking for career development, a role transition, or skill building?",
      "Ready to begin your career planning session?"
    ]
  },
  ASSESSMENT: {
    title: "Career Assessment",
    questions: [
      "What's your current role?",
      "What industry are you in?",
      "What role are you targeting?",
      "How many years of professional experience do you have?",
      "What best describes your current level?",
      "What's your timeframe for this transition?",
      "On a scale of 1-10, how confident are you about making this transition?",
      "On a scale of 1-10, how clear are you on what it takes to get there?"
    ]
  },
  GAP_ANALYSIS: {
    title: "Gap Analysis",
    questions: [
      "What skills does your target role require that you don't currently have?",
      "What types of experience are you missing?",
      "Would you like me to suggest additional gaps based on your career transition?",
      "What skills from your current role transfer to your target role?",
      "Of all the gaps we've identified, which ones are most critical to address first?",
      "On a scale of 1-10, how manageable do these gaps feel?"
    ]
  },
  ROADMAP: {
    title: "Career Roadmap",
    questions: [
      "Let's build your roadmap! We'll work on each gap one at a time.",
      "[For each gap: Select learning actions, networking actions, experience actions, and set a milestone]",
      "[After all gaps are complete]",
      "On a scale of 1-10, how committed are you to executing this roadmap?"
    ]
  },
  REVIEW: {
    title: "Session Review",
    questions: [
      "What are your key takeaways from this session?",
      "What's your immediate next step (within 48 hours)?",
      "What's your biggest challenge in executing this plan?",
      "On a scale of 1-10, how confident are you now about your career transition?",
      "How clear are you on your path forward (1-10)?",
      "How helpful was this session (1-10)?"
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

  const validSessionId = sessionId !== undefined && sessionId !== null && sessionId !== '' 
    ? (sessionId as Id<"sessions">) 
    : undefined;

  const session = useQuery(
    api.queries.getSession,
    validSessionId !== null && validSessionId !== undefined ? { sessionId: validSessionId } : "skip"
  );

  const reflections = useQuery(
    api.queries.getSessionReflections,
    validSessionId !== null && validSessionId !== undefined ? { sessionId: validSessionId } : "skip"
  );

  // Fetch framework questions dynamically from backend (single source of truth)
  const frameworkQuestions = useQuery(
    api.queries.getFrameworkQuestions,
    session?.framework !== undefined && session.framework !== null && session.framework.length > 0
      ? { framework: session.framework }
      : "skip"
  );

  const nextStepAction = useAction(api.coach.nextStep);
  const generateReviewAnalysisAction = useAction(api.coach.generateReviewAnalysis);
  const closeSession = useMutation(api.mutations.closeSession);
  const incrementSkip = useMutation(api.mutations.incrementSkipCount);
  const submitRating = useMutation(api.mutations.submitSessionRating);

  // Step confirmation and amendment state
  const awaitingConfirmation = session?.awaiting_confirmation === true;
  const amendmentMode = session?.amendment_mode;
  const [showStepSelector, setShowStepSelector] = useState(false);
  
  // Debug logging for CAREER REVIEW awaiting confirmation
  useEffect(() => {
    if (session?.framework === 'CAREER' && session?.step === 'REVIEW') {
      const reviewReflections = reflections?.filter((r) => r.step === 'REVIEW') ?? [];
      const lastReviewReflection = reviewReflections[reviewReflections.length - 1];
      const payload = lastReviewReflection?.payload as Record<string, unknown> | undefined;
      
      console.warn('=== CAREER REVIEW UI STATE ===', {
        awaitingConfirmation,
        session_awaiting_confirmation: session?.awaiting_confirmation,
        session_closedAt: session?.closedAt,
        payload_fields: payload !== null && payload !== undefined ? Object.keys(payload) : [],
        key_takeaways: payload?.['key_takeaways'],
        immediate_next_step: payload?.['immediate_next_step'],
        biggest_challenge: payload?.['biggest_challenge'],
        final_confidence: payload?.['final_confidence'],
        final_clarity: payload?.['final_clarity'],
        session_helpfulness: payload?.['session_helpfulness']
      });
    }
  }, [session?.framework, session?.step, session?.awaiting_confirmation, session?.closedAt, awaitingConfirmation, reflections]);
  
  // Gap editing state
  const [editingGapIndex, setEditingGapIndex] = useState<number | null>(null);

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

  // NOTE: Report generation is now ONLY triggered by button click (handleGenerateReport)
  // This useEffect was removed because it was auto-triggering report generation
  // when all review questions were answered, bypassing the awaiting confirmation state



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
  const COMPASS_STEPS = ["introduction", "clarity", "ownership", "mapping", "practice", "review"];
  const CAREER_STEPS = ["INTRODUCTION", "ASSESSMENT", "GAP_ANALYSIS", "ROADMAP", "REVIEW"];
  
  const frameworkSteps = 
    session.framework === "COMPASS" ? COMPASS_STEPS :
    session.framework === "CAREER" ? CAREER_STEPS :
    GROW_STEPS;
  
  const totalSteps = frameworkSteps.length;
  const currentStepIndex = Math.max(0, frameworkSteps.indexOf(currentStep)); // Fallback to 0 if step not found
  
  // Get skip count for current step
  const sessionState = session.state as { skips?: Record<string, number> } | undefined;
  const skipCount = sessionState?.skips?.[currentStep] ?? 0;
  const canSkip = skipCount < 2 && 
    currentStep.toLowerCase() !== "review" && 
    currentStep.toLowerCase() !== "introduction"; // No skip on introduction or review step
  
  // Check if session is complete (review step done OR session closed)
  // Find the LAST review reflection (in case there are multiple after analysis generation)
  const reviewReflections = reflections?.filter((r) => r.step.toLowerCase() === "review") ?? [];
  const reviewReflection = reviewReflections[reviewReflections.length - 1];
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;
  
  // Framework-specific review completion checks
  let isReviewComplete = false;
  if (session?.framework === 'GROW') {
    // GROW: Check for AI-generated analysis fields
    isReviewComplete = Boolean(
      reviewPayload !== null && reviewPayload !== undefined &&
      typeof reviewPayload['summary'] === 'string' && reviewPayload['summary'].length > 0 &&
      typeof reviewPayload['ai_insights'] === 'string' && reviewPayload['ai_insights'].length > 0 &&
      Array.isArray(reviewPayload['unexplored_options']) && reviewPayload['unexplored_options'].length > 0 &&
      Array.isArray(reviewPayload['identified_risks']) && reviewPayload['identified_risks'].length > 0 &&
      Array.isArray(reviewPayload['potential_pitfalls']) && reviewPayload['potential_pitfalls'].length > 0
    );
  } else if (session?.framework === 'CAREER') {
    // CAREER: Check for ALL 6 user reflection fields
    // NOTE: For CAREER, review completion means awaiting confirmation, NOT session complete
    // Session only completes after user clicks "Proceed to Report" and report is generated
    isReviewComplete = Boolean(
      reviewPayload !== null && reviewPayload !== undefined &&
      typeof reviewPayload['key_takeaways'] === 'string' && reviewPayload['key_takeaways'].length >= 50 &&
      typeof reviewPayload['immediate_next_step'] === 'string' && reviewPayload['immediate_next_step'].length >= 10 &&
      typeof reviewPayload['biggest_challenge'] === 'string' && reviewPayload['biggest_challenge'].length >= 10 &&
      typeof reviewPayload['final_confidence'] === 'number' &&
      typeof reviewPayload['final_clarity'] === 'number' &&
      typeof reviewPayload['session_helpfulness'] === 'number'
    );
  } else if (session?.framework === 'COMPASS') {
    // COMPASS: Check for review fields
    isReviewComplete = Boolean(
      reviewPayload !== null && reviewPayload !== undefined &&
      typeof reviewPayload['key_takeaways'] === 'string' && reviewPayload['key_takeaways'].length > 0
    );
  }
  
  // For CAREER framework, session is only complete when actually closed (after report generation)
  // Review completion triggers awaiting_confirmation, not session completion
  const isSessionComplete = session?.framework === 'CAREER'
    ? (session.closedAt !== null && session.closedAt !== undefined)
    : ((currentStep.toLowerCase() === "review" && isReviewComplete) || 
       (session.closedAt !== null && session.closedAt !== undefined));

  // Helper: Extract fields for amendment modal
  const extractFieldsForAmendment = (
    step: string,
    reflections: Array<{ step: string; payload: Record<string, unknown> }>
  ): Array<{ key: string; label: string; value: unknown; type: 'string' | 'number' | 'array' }> => {
    const stepReflections = reflections.filter(r => r.step === step);
    const latestReflection = stepReflections[stepReflections.length - 1];
    const payload = (latestReflection?.payload !== null && latestReflection?.payload !== undefined) ? latestReflection.payload : {};
    
    const fields: Array<{ key: string; label: string; value: unknown; type: 'string' | 'number' | 'array' }> = [];
    
    // Skip internal fields
    const skipFields = ['coach_reflection', 'options', 'selected_option_ids', 'suggested_action', 
                        'current_option_index', 'current_option_label', 'total_options', 'actions'];
    
    for (const [key, value] of Object.entries(payload)) {
      if (skipFields.includes(key)) {
        continue;
      }
      if (key.startsWith('_')) {
        continue;
      }
      
      fields.push({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        type: Array.isArray(value) ? 'array' : typeof value === 'number' ? 'number' : 'string'
      });
    }
    
    return fields;
  };

  // Helper: Get next step name for confirmation buttons
  const getNextStepName = (currentStep: string): string => {
    if (session?.framework === 'GROW') {
      const steps: Record<string, string> = { 
        goal: 'Reality', 
        reality: 'Options', 
        options: 'Will', 
        will: 'Review',
        review: 'Report'
      };
      return steps[currentStep] ?? 'Review';
    } else if (session?.framework === 'COMPASS') {
      const steps: Record<string, string> = { 
        clarity: 'Ownership', 
        ownership: 'Mapping', 
        mapping: 'Practice', 
        practice: 'Anchoring',
        anchoring: 'Sustaining',
        sustaining: 'Review',
        review: 'Report'
      };
      return steps[currentStep] ?? 'Review';
    } else if (session?.framework === 'CAREER') {
      const steps: Record<string, string> = { 
        INTRODUCTION: 'Assessment',
        ASSESSMENT: 'Gap Analysis', 
        GAP_ANALYSIS: 'Roadmap', 
        ROADMAP: 'Review',
        REVIEW: 'Report'
      };
      return steps[currentStep] ?? 'Review';
    } else {
      return 'Review';
    }
  };

  // Helper: Get steps for framework (for review step selector)
  const getStepsForFramework = (framework: string): string[] => {
    if (framework === 'GROW') {
      return ['goal', 'reality', 'options', 'will'];
    } else if (framework === 'COMPASS') {
      return ['clarity', 'ownership', 'mapping', 'practice', 'anchoring', 'sustaining'];
    } else if (framework === 'CAREER') {
      return ['INTRODUCTION', 'ASSESSMENT', 'GAP_ANALYSIS', 'ROADMAP'];
    } else {
      return [];
    }
  };

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
                <span className="text-indigo-600 dark:text-indigo-400">
                  {currentStep.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </span>
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

                          {/* Yes/No Buttons for Introduction Step (GROW/COMPASS/CAREER) */}
                          {(reflection.step === 'introduction' || reflection.step === 'INTRODUCTION') && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const userConsentGiven = payload['user_consent_given'];
                            const userConsent = payload['user_consent'];
                            
                            // Hide buttons if user already gave consent
                            if (userConsentGiven === true || userConsent === true) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <YesNoSelector
                                  question="Ready to begin?"
                                  yesLabel="Yes, let's begin"
                                  noLabel="No, close session"
                                  onYes={() => {
                                    // Send "yes" to trigger AI to advance to next step
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: reflection.step,
                                      userTurn: 'yes',
                                    });
                                  }}
                                  onNo={() => {
                                    navigate('/dashboard');
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ASSESSMENT - Initial Confidence Scale */}
                          {session?.framework === 'CAREER' && reflection.step === 'ASSESSMENT' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const initialConfidence = payload['initial_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: initial_confidence not yet captured, AI is asking for it
                            if (initialConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence (look for "confident" in coach message)
                            const isAskingForConfidence = coachReflection.toLowerCase().includes('how confident') ||
                                                         coachReflection.toLowerCase().includes('confidence');
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how confident are you about making this transition?"
                                  colorScheme="confidence"
                                  minLabel="Not confident at all"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ASSESSMENT',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ASSESSMENT - Clarity Scale */}
                          {session?.framework === 'CAREER' && reflection.step === 'ASSESSMENT' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const initialConfidence = payload['initial_confidence'];
                            const assessmentScore = payload['assessment_score'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: initial_confidence captured, assessment_score not yet captured, AI is asking for it
                            if (typeof initialConfidence !== 'number' || assessmentScore !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for clarity
                            const isAskingForClarity = coachReflection.toLowerCase().includes('how clear') ||
                                                      coachReflection.toLowerCase().includes('what it takes');
                            
                            if (!isAskingForClarity) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how clear are you on what it takes to get there?"
                                  colorScheme="clarity"
                                  minLabel="Not clear at all"
                                  maxLabel="Very clear"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ASSESSMENT',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ASSESSMENT - Career Stage Selector */}
                          {reflection.step === 'ASSESSMENT' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const careerStage = payload['career_stage'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: career_stage not yet captured, AI is asking for it
                            if (careerStage !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for career level
                            const isAskingForStage = coachReflection.toLowerCase().includes('current level') ||
                                                    coachReflection.toLowerCase().includes('career level') ||
                                                    (coachReflection.toLowerCase().includes('entry') && coachReflection.toLowerCase().includes('manager'));
                            
                            if (!isAskingForStage) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  What best describes your current level?
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { value: 'entry_level', label: 'Entry Level', emoji: '🌱' },
                                    { value: 'middle_manager', label: 'Middle Manager', emoji: '👔' },
                                    { value: 'senior_manager', label: 'Senior Manager', emoji: '🎯' },
                                    { value: 'executive', label: 'Executive', emoji: '👑' },
                                    { value: 'founder', label: 'Founder/Entrepreneur', emoji: '🚀' }
                                  ].map((stage) => (
                                    <button
                                      key={stage.value}
                                      onClick={() => {
                                        void nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'ASSESSMENT',
                                          userTurn: stage.value,
                                        });
                                      }}
                                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <span className="text-xl">{stage.emoji}</span>
                                      <span>{stage.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Career Coach ASSESSMENT - Timeframe Selector */}
                          {reflection.step === 'ASSESSMENT' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const timeframe = payload['timeframe'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: timeframe not yet captured, AI is asking for it
                            if (timeframe !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for timeframe
                            const isAskingForTimeframe = coachReflection.toLowerCase().includes('timeframe') ||
                                                        coachReflection.toLowerCase().includes('how long') ||
                                                        coachReflection.toLowerCase().includes('when do you want');
                            
                            if (!isAskingForTimeframe) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  What's your timeframe for this transition?
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { value: '3-6 months', label: '3-6 months', emoji: '⚡' },
                                    { value: '6-12 months', label: '6-12 months', emoji: '📅' },
                                    { value: '1-2 years', label: '1-2 years', emoji: '🎯' },
                                    { value: '2+ years', label: '2+ years', emoji: '🌟' }
                                  ].map((time) => (
                                    <button
                                      key={time.value}
                                      onClick={() => {
                                        void nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'ASSESSMENT',
                                          userTurn: time.value,
                                        });
                                      }}
                                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <span className="text-xl">{time.emoji}</span>
                                      <span>{time.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Career Coach GAP_ANALYSIS - AI Wants Suggestions Yes/No */}
                          {session?.framework === 'CAREER' && reflection.step === 'GAP_ANALYSIS' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const aiWantsSuggestions = payload['ai_wants_suggestions'];
                            const experienceGaps = payload['experience_gaps'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: experience_gaps captured, ai_wants_suggestions not yet set, AI is asking
                            if (experienceGaps === undefined || aiWantsSuggestions !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for suggestions
                            const isAskingForSuggestions = coachReflection.toLowerCase().includes('would you like me to suggest') ||
                                                          coachReflection.toLowerCase().includes('suggest additional gaps') ||
                                                          coachReflection.toLowerCase().includes('ai.*suggest');
                            
                            if (!isAskingForSuggestions) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <YesNoSelector
                                  question="Would you like AI to suggest additional gaps based on your career transition?"
                                  yesLabel="Yes, please suggest gaps"
                                  noLabel="No, continue with my gaps"
                                  onYes={() => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'GAP_ANALYSIS',
                                      userTurn: 'Yes, please suggest additional gaps based on my career transition.'
                                    });
                                  }}
                                  onNo={() => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'GAP_ANALYSIS',
                                      userTurn: 'No, I prefer to continue with my own gaps.'
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach GAP_ANALYSIS - AI Suggested Gaps Selector */}
                          {session?.framework === 'CAREER' && reflection.step === 'GAP_ANALYSIS' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const aiSuggestedGaps = payload['ai_suggested_gaps'];
                            const selectedGapIds = payload['selected_gap_ids'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: AI has suggested gaps and user hasn't selected yet
                            if (!Array.isArray(aiSuggestedGaps) || aiSuggestedGaps.length === 0 || selectedGapIds !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is presenting the gaps
                            const isPresentingGaps = coachReflection.toLowerCase().includes('identified') ||
                                                    coachReflection.toLowerCase().includes('potential gaps') ||
                                                    coachReflection.toLowerCase().includes('suggest');
                            
                            if (!isPresentingGaps) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <GapSelector
                                  gaps={(aiSuggestedGaps as AISuggestedGap[]).map(gap => ({
                                    id: gap.id,
                                    type: gap.type,
                                    gap: gap.gap,
                                    rationale: gap.rationale,
                                    priority: gap.priority
                                  }))}
                                  onSubmit={(selectedIds) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'GAP_ANALYSIS',
                                      userTurn: selectedIds.length > 0 
                                        ? `I've selected ${selectedIds.length} gap${selectedIds.length > 1 ? 's' : ''}`
                                        : 'I prefer to skip these suggestions',
                                      structuredInput: {
                                        type: 'gap_selection',
                                        data: { selected_gap_ids: selectedIds }
                                      }
                                    });
                                  }}
                                  maxSelections={5}
                                  coachMessage={coachReflection}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach GAP_ANALYSIS - Development Priorities Selector */}
                          {session?.framework === 'CAREER' && reflection.step === 'GAP_ANALYSIS' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const skillGaps = payload['skill_gaps'];
                            const selectedGapIds = payload['selected_gap_ids'];
                            const developmentPriorities = payload['development_priorities'];
                            const transferableSkills = payload['transferable_skills'];
                            const aiSuggestedGaps = payload['ai_suggested_gaps'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: transferable_skills captured, priorities not yet set, AI is asking
                            if (!Array.isArray(transferableSkills) || transferableSkills.length === 0 || developmentPriorities !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for priorities
                            const isAskingForPriorities = coachReflection.toLowerCase().includes('most critical') ||
                                                         coachReflection.toLowerCase().includes('priorit') ||
                                                         coachReflection.toLowerCase().includes('focus on');
                            
                            if (!isAskingForPriorities) {
                              return null;
                            }
                            
                            // Build combined gaps list
                            const allGaps: Array<{id: string; gap: string; type: 'skill' | 'experience'; source: 'user' | 'ai'}> = [];
                            
                            // Add user skill gaps
                            if (Array.isArray(skillGaps)) {
                              skillGaps.forEach((gap: unknown, idx: number) => {
                                if (typeof gap === 'string') {
                                  allGaps.push({
                                    id: `skill_${idx}`,
                                    gap,
                                    type: 'skill',
                                    source: 'user'
                                  });
                                }
                              });
                            }
                            
                            // Add AI-selected gaps
                            if (Array.isArray(selectedGapIds) && Array.isArray(aiSuggestedGaps)) {
                              selectedGapIds.forEach((gapId: unknown) => {
                                const aiGap = (aiSuggestedGaps as AISuggestedGap[]).find(g => g.id === gapId);
                                if (aiGap !== undefined) {
                                  allGaps.push({
                                    id: aiGap.id,
                                    gap: aiGap.gap,
                                    type: aiGap.type,
                                    source: 'ai'
                                  });
                                }
                              });
                            }
                            
                            if (allGaps.length === 0) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <GapPrioritySelector
                                  gaps={allGaps}
                                  onSubmit={(selectedGaps) => {
                                    // Map IDs back to gap descriptions
                                    const priorityGaps = selectedGaps.map(id => {
                                      const gap = allGaps.find(g => g.id === id);
                                      return gap?.gap ?? '';
                                    }).filter(Boolean);
                                    
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'GAP_ANALYSIS',
                                      userTurn: `My top ${priorityGaps.length} priorities are: ${priorityGaps.join(', ')}`,
                                      structuredInput: {
                                        type: 'priority_selection',
                                        data: { development_priorities: priorityGaps }
                                      }
                                    });
                                  }}
                                  minSelections={1}
                                  maxSelections={5}
                                  coachMessage={coachReflection}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach GAP_ANALYSIS - Gap Analysis Score */}
                          {session?.framework === 'CAREER' && reflection.step === 'GAP_ANALYSIS' && isLastReflection && !isSessionComplete && !awaitingConfirmation && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const gapAnalysisScore = payload['gap_analysis_score'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: gap_analysis_score not yet captured, AI is asking for it
                            if (gapAnalysisScore !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for gap manageability
                            const isAskingForScore = coachReflection.toLowerCase().includes('how manageable') ||
                                                    coachReflection.toLowerCase().includes('manageable do these gaps');
                            
                            if (!isAskingForScore) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how manageable do these gaps feel?"
                                  colorScheme="clarity"
                                  minLabel="Overwhelming"
                                  maxLabel="Very manageable"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'GAP_ANALYSIS',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ROADMAP - Completed Gaps Display */}
                          {session?.framework === 'CAREER' && reflection.step === 'ROADMAP' && isLastReflection && !isSessionComplete && editingGapIndex === null && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const aiSuggestedRoadmap = payload['ai_suggested_roadmap'];
                            
                            if (aiSuggestedRoadmap === undefined || typeof aiSuggestedRoadmap !== 'object' || aiSuggestedRoadmap === null) {
                              return null;
                            }
                            
                            const roadmapData = aiSuggestedRoadmap as Record<string, unknown>;
                            const gapCards = Array.isArray(roadmapData['gap_cards']) 
                              ? roadmapData['gap_cards'] as Array<Record<string, unknown>>
                              : [];
                            const currentGapIndex = typeof roadmapData['current_gap_index'] === 'number' 
                              ? roadmapData['current_gap_index'] 
                              : 0;
                            
                            // Show completed gaps
                            const completedGaps = gapCards.slice(0, currentGapIndex);
                            
                            if (completedGaps.length === 0) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4 space-y-4">
                                {completedGaps.map((gapCard, index) => {
                                  const selections = payload[`gap_${index}_selections`] as Record<string, unknown> | undefined;
                                  
                                  if (selections === undefined) {
                                    return null;
                                  }
                                  
                                  return (
                                    <CompletedGapCard
                                      key={String(gapCard['gap_id'] ?? index)}
                                      gapCard={{
                                        gap_id: String(gapCard['gap_id'] ?? ''),
                                        gap_name: String(gapCard['gap_name'] ?? ''),
                                        gap_index: typeof gapCard['gap_index'] === 'number' ? gapCard['gap_index'] : index,
                                        total_gaps: typeof gapCard['total_gaps'] === 'number' ? gapCard['total_gaps'] : gapCards.length,
                                        learning_actions: Array.isArray(gapCard['learning_actions'])
                                          ? gapCard['learning_actions'] as Array<{
                                              id: string;
                                              action: string;
                                              timeline: string;
                                              resource: string;
                                            }>
                                          : [],
                                        networking_actions: Array.isArray(gapCard['networking_actions'])
                                          ? gapCard['networking_actions'] as Array<{
                                              id: string;
                                              action: string;
                                              timeline: string;
                                            }>
                                          : [],
                                        experience_actions: Array.isArray(gapCard['experience_actions'])
                                          ? gapCard['experience_actions'] as Array<{
                                              id: string;
                                              action: string;
                                              timeline: string;
                                            }>
                                          : [],
                                        milestone: String(gapCard['milestone'] ?? '')
                                      }}
                                      selections={{
                                        selected_learning_ids: Array.isArray(selections['selected_learning_ids']) 
                                          ? selections['selected_learning_ids'] as string[]
                                          : [],
                                        selected_networking_ids: Array.isArray(selections['selected_networking_ids'])
                                          ? selections['selected_networking_ids'] as string[]
                                          : [],
                                        selected_experience_ids: Array.isArray(selections['selected_experience_ids'])
                                          ? selections['selected_experience_ids'] as string[]
                                          : [],
                                        milestone: String(selections['milestone'] ?? '')
                                      }}
                                      onEdit={() => {
                                        setEditingGapIndex(index);
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {/* Career Coach ROADMAP - Editing Gap Card */}
                          {session?.framework === 'CAREER' && reflection.step === 'ROADMAP' && isLastReflection && !isSessionComplete && editingGapIndex !== null && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const aiSuggestedRoadmap = payload['ai_suggested_roadmap'];
                            
                            if (aiSuggestedRoadmap === undefined || typeof aiSuggestedRoadmap !== 'object' || aiSuggestedRoadmap === null) {
                              return null;
                            }
                            
                            const roadmapData = aiSuggestedRoadmap as Record<string, unknown>;
                            const gapCards = Array.isArray(roadmapData['gap_cards']) 
                              ? roadmapData['gap_cards'] as Array<Record<string, unknown>>
                              : [];
                            
                            const gapCard = gapCards[editingGapIndex];
                            const selections = payload[`gap_${editingGapIndex}_selections`] as Record<string, unknown> | undefined;
                            
                            if (gapCard === undefined || selections === undefined) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <GapRoadmapCard
                                  gapCard={{
                                    gap_id: String(gapCard['gap_id'] ?? ''),
                                    gap_name: String(gapCard['gap_name'] ?? ''),
                                    gap_index: typeof gapCard['gap_index'] === 'number' ? gapCard['gap_index'] : editingGapIndex,
                                    total_gaps: typeof gapCard['total_gaps'] === 'number' ? gapCard['total_gaps'] : gapCards.length,
                                    learning_actions: Array.isArray(gapCard['learning_actions'])
                                      ? gapCard['learning_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                          resource: string;
                                        }>
                                      : [],
                                    networking_actions: Array.isArray(gapCard['networking_actions'])
                                      ? gapCard['networking_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                        }>
                                      : [],
                                    experience_actions: Array.isArray(gapCard['experience_actions'])
                                      ? gapCard['experience_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                        }>
                                      : [],
                                    milestone: String(gapCard['milestone'] ?? '')
                                  }}
                                  initialSelections={{
                                    selected_learning_ids: Array.isArray(selections['selected_learning_ids']) 
                                      ? selections['selected_learning_ids'] as string[]
                                      : [],
                                    selected_networking_ids: Array.isArray(selections['selected_networking_ids'])
                                      ? selections['selected_networking_ids'] as string[]
                                      : [],
                                    selected_experience_ids: Array.isArray(selections['selected_experience_ids'])
                                      ? selections['selected_experience_ids'] as string[]
                                      : [],
                                    milestone: String(selections['milestone'] ?? '')
                                  }}
                                  isEditing={true}
                                  onComplete={(updatedSelections) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ROADMAP',
                                      userTurn: `I've updated gap ${editingGapIndex + 1}: ${String(gapCard['gap_name'])}`,
                                      structuredInput: {
                                        type: 'gap_modification',
                                        data: {
                                          gap_index: editingGapIndex,
                                          ...updatedSelections
                                        }
                                      }
                                    });
                                    setEditingGapIndex(null);
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ROADMAP - Gap Roadmap Card (Sequential) */}
                          {session?.framework === 'CAREER' && reflection.step === 'ROADMAP' && isLastReflection && !isSessionComplete && !awaitingConfirmation && editingGapIndex === null && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const aiSuggestedRoadmap = payload['ai_suggested_roadmap'];
                            const roadmapCompleted = payload['roadmap_completed'] === true;
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Don't show card if roadmap is already completed
                            if (roadmapCompleted) {
                              return null;
                            }
                            
                            // Only show if: AI has generated roadmap
                            if (aiSuggestedRoadmap === undefined || !isObject(aiSuggestedRoadmap)) {
                              return null;
                            }
                            
                            // Check if AI is presenting the roadmap
                            const isPresentingRoadmap = coachReflection.toLowerCase().includes('roadmap') ||
                                                       coachReflection.toLowerCase().includes('gap');
                            
                            if (!isPresentingRoadmap) {
                              return null;
                            }
                            
                            // Type guard for roadmap data
                            function isObject(value: unknown): value is Record<string, unknown> {
                              return typeof value === 'object' && value !== null;
                            }
                            
                            const roadmapData = aiSuggestedRoadmap;
                            const gapCards = Array.isArray(roadmapData['gap_cards']) 
                              ? roadmapData['gap_cards'] as Array<Record<string, unknown>>
                              : [];
                            const currentGapIndex = typeof roadmapData['current_gap_index'] === 'number' 
                              ? roadmapData['current_gap_index'] 
                              : 0;
                            
                            if (gapCards.length === 0 || currentGapIndex >= gapCards.length) {
                              return null;
                            }
                            
                            const currentGapCard = gapCards[currentGapIndex];
                            if (currentGapCard === undefined) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <GapRoadmapCard
                                  gapCard={{
                                    gap_id: String(currentGapCard['gap_id'] ?? ''),
                                    gap_name: String(currentGapCard['gap_name'] ?? ''),
                                    gap_index: typeof currentGapCard['gap_index'] === 'number' ? currentGapCard['gap_index'] : currentGapIndex,
                                    total_gaps: typeof currentGapCard['total_gaps'] === 'number' ? currentGapCard['total_gaps'] : gapCards.length,
                                    learning_actions: Array.isArray(currentGapCard['learning_actions'])
                                      ? currentGapCard['learning_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                          resource: string;
                                        }>
                                      : [],
                                    networking_actions: Array.isArray(currentGapCard['networking_actions'])
                                      ? currentGapCard['networking_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                        }>
                                      : [],
                                    experience_actions: Array.isArray(currentGapCard['experience_actions'])
                                      ? currentGapCard['experience_actions'] as Array<{
                                          id: string;
                                          action: string;
                                          timeline: string;
                                        }>
                                      : [],
                                    milestone: String(currentGapCard['milestone'] ?? '')
                                  }}
                                  onComplete={(selections) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ROADMAP',
                                      userTurn: `I've completed gap ${currentGapIndex + 1}: ${String(currentGapCard['gap_name'])}`,
                                      structuredInput: {
                                        type: 'gap_completion',
                                        data: selections
                                      }
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach ROADMAP - Roadmap Commitment Score */}
                          {reflection.step === 'ROADMAP' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const roadmapCompleted = payload['roadmap_completed'] === true;
                            const roadmapScore = payload['roadmap_score'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: roadmap is completed, score not yet captured, AI is asking for it
                            if (!roadmapCompleted || roadmapScore !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for commitment
                            const isAskingForScore = coachReflection.toLowerCase().includes('how committed') ||
                                                    coachReflection.toLowerCase().includes('committed are you');
                            
                            if (!isAskingForScore) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how committed are you to this roadmap?"
                                  colorScheme="confidence"
                                  minLabel="Not committed"
                                  maxLabel="Fully committed"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ROADMAP',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach REVIEW - Final Confidence */}
                          {reflection.step === 'REVIEW' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const finalConfidence = payload['final_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: final_confidence not yet captured, AI is asking for it
                            if (finalConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence
                            const isAskingForConfidence = coachReflection.toLowerCase().includes('how confident are you now') ||
                                                         coachReflection.toLowerCase().includes('confident are you now');
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how confident are you now about your career transition?"
                                  colorScheme="confidence"
                                  minLabel="Not confident"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'REVIEW',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach REVIEW - Final Clarity */}
                          {reflection.step === 'REVIEW' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const finalConfidence = payload['final_confidence'];
                            const finalClarity = payload['final_clarity'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: final_confidence captured, final_clarity not yet captured, AI is asking for it
                            if (typeof finalConfidence !== 'number' || finalClarity !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for clarity
                            const isAskingForClarity = coachReflection.toLowerCase().includes('how clear are you') ||
                                                      coachReflection.toLowerCase().includes('clear are you on your path');
                            
                            if (!isAskingForClarity) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="How clear are you on your path forward (1-10)?"
                                  colorScheme="clarity"
                                  minLabel="Not clear"
                                  maxLabel="Very clear"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'REVIEW',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Career Coach REVIEW - Session Helpfulness */}
                          {reflection.step === 'REVIEW' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const finalConfidence = payload['final_confidence'];
                            const finalClarity = payload['final_clarity'];
                            const sessionHelpfulness = payload['session_helpfulness'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: final_confidence and final_clarity captured, session_helpfulness not yet captured, AI is asking for it
                            if (typeof finalConfidence !== 'number' || typeof finalClarity !== 'number' || sessionHelpfulness !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for helpfulness
                            const isAskingForHelpfulness = coachReflection.toLowerCase().includes('how helpful') ||
                                                          coachReflection.toLowerCase().includes('helpful was this session');
                            
                            if (!isAskingForHelpfulness) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="How helpful was this session (1-10)?"
                                  colorScheme="confidence"
                                  minLabel="Not helpful"
                                  maxLabel="Very helpful"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'REVIEW',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Initial Confidence Scale (COMPASS Introduction Q1) */}
                          {reflection.step === 'introduction' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const userConsentGiven = payload['user_consent_given'];
                            const initialConfidence = payload['initial_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: consent given, confidence not yet captured, AI is asking for it
                            if (userConsentGiven !== true || initialConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence (look for "1-10" or "confident" in coach message)
                            const isAskingForConfidence = coachReflection.includes('1-10') || 
                                                         coachReflection.toLowerCase().includes('how confident');
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="On a scale of 1-10, how confident do you feel?"
                                  colorScheme="confidence"
                                  minLabel="Not confident at all"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'introduction',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Initial Action Clarity Scale (COMPASS Introduction Q2 - CONDITIONAL) */}
                          {reflection.step === 'introduction' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const initialConfidence = payload['initial_confidence'];
                            const initialActionClarity = payload['initial_action_clarity'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: high confidence (>=8), action clarity not yet captured, AI is asking for it
                            if (typeof initialConfidence !== 'number' || initialConfidence < 8 || initialActionClarity !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for action clarity
                            const isAskingForClarity = coachReflection.toLowerCase().includes('clear are you') || 
                                                      coachReflection.toLowerCase().includes('next steps');
                            
                            if (!isAskingForClarity) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="How clear are you on your specific next steps?"
                                  colorScheme="clarity"
                                  minLabel="Very unclear"
                                  maxLabel="Crystal clear"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'introduction',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Initial Mindset State (COMPASS Introduction Q3) */}
                          {reflection.step === 'introduction' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const userConsentGiven = payload['user_consent_given'];
                            const initialMindsetState = payload['initial_mindset_state'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: consent given, mindset not yet captured, AI is asking for it
                            if (userConsentGiven !== true || initialMindsetState !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for mindset
                            const isAskingForMindset = coachReflection.toLowerCase().includes('mindset') || 
                                                      coachReflection.toLowerCase().includes('resistant') ||
                                                      coachReflection.toLowerCase().includes('neutral') ||
                                                      coachReflection.toLowerCase().includes('open') ||
                                                      coachReflection.toLowerCase().includes('engaged');
                            
                            if (!isAskingForMindset) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <MindsetSelector
                                  question="How would you describe your current mindset about this change?"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'introduction',
                                      userTurn: value,
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Safety Pause Choice Buttons */}
                          {isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const hasSafetyLevel = payload['safety_level'] !== undefined && payload['safety_level'] !== null;
                            const isSafetyPauseStep = reflection.step === 'safety_pause';
                            return hasSafetyLevel || isSafetyPauseStep;
                          })() && (
                            <div className="mt-6 space-y-3">
                              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-3">
                                  Would you like to continue our coaching conversation or take a break?
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <button
                                    onClick={() => {
                                      void nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: reflection.step,
                                        userTurn: '',
                                        structuredInput: {
                                          type: 'safety_choice',
                                          data: { action: 'continue' }
                                        }
                                      });
                                    }}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                  >
                                    <span>✓</span>
                                    <span>Continue Session</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      void nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: reflection.step,
                                        userTurn: '',
                                        structuredInput: {
                                          type: 'safety_choice',
                                          data: { action: 'close' }
                                        }
                                      });
                                    }}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                  >
                                    <span>×</span>
                                    <span>Close Session</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Understanding/Clarity Score (COMPASS Clarity Step) */}
                          {reflection.step === 'clarity' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const clarityScore = payload['clarity_score'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: clarity score not yet captured, AI is asking for it
                            if (clarityScore !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for understanding/clarity (1-5 scale)
                            const isAskingForClarity = (coachReflection.includes('1-5') || coachReflection.includes('scale of 1-5')) &&
                                                      (coachReflection.toLowerCase().includes('understand') ||
                                                       coachReflection.toLowerCase().includes('clear'));
                            
                            if (!isAskingForClarity) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <UnderstandingScaleSelector
                                  question="On a scale of 1-5, how well do you understand what's happening?"
                                  minLabel="Very confused"
                                  maxLabel="Crystal clear"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'clarity',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Control Level Selector (COMPASS Clarity Step) */}
                          {reflection.step === 'clarity' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const controlLevel = payload['control_level'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: control_level not yet captured, AI is asking for it
                            if (controlLevel !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking about control level
                            const isAskingForControl = coachReflection.toLowerCase().includes('control') &&
                                                      (coachReflection.toLowerCase().includes('how much') ||
                                                       coachReflection.toLowerCase().includes('level'));
                            
                            if (!isAskingForControl) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ControlLevelSelector
                                  coachMessage={coachReflection}
                                  onSubmit={(level) => {
                                    void (async (): Promise<void> => {
                                      if (submitting) {
                                        return;
                                      }
                                      
                                      setSubmitting(true);
                                      try {
                                        const result = await nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'clarity',
                                          userTurn: `Selected control level: ${level}`,
                                          structuredInput: {
                                            type: 'control_level_selection',
                                            data: { control_level: level }
                                          }
                                        });

                                        if (!result.ok) {
                                          const errorMsg = result.message ?? "Unable to process your selection. Please try again.";
                                          setNotification({ type: "error", message: errorMsg });
                                        }
                                      } catch (error: unknown) {
                                        console.error("Control level selection error:", error);
                                        setNotification({ 
                                          type: "error", 
                                          message: "Failed to submit control level. Please try again." 
                                        });
                                      } finally {
                                        setSubmitting(false);
                                      }
                                    })();
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Initial Confidence Scale (COMPASS Clarity Step - CSS Baseline) */}
                          {reflection.step === 'clarity' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const initialConfidence = payload['initial_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: initial_confidence not yet captured, AI is asking for it
                            if (initialConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence (1-10 scale)
                            const isAskingForConfidence = (coachReflection.includes('1-10') || coachReflection.includes('/10')) &&
                                                         (coachReflection.toLowerCase().includes('confident') ||
                                                          coachReflection.toLowerCase().includes('confidence'));
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="How confident do you feel about navigating this successfully? (1-10)"
                                  colorScheme="confidence"
                                  minLabel="Not confident at all"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'clarity',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Initial Mindset State (COMPASS Clarity Step - CSS Baseline) */}
                          {reflection.step === 'clarity' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const initialMindsetState = payload['initial_mindset_state'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: initial_mindset_state not yet captured, AI is asking for it
                            if (initialMindsetState !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking about mindset
                            const isAskingForMindset = coachReflection.toLowerCase().includes('mindset') &&
                                                      (coachReflection.toLowerCase().includes('describe') ||
                                                       coachReflection.toLowerCase().includes('how would you'));
                            
                            if (!isAskingForMindset) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <MindsetSelector
                                  question="How would you describe your current mindset about this change?"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'clarity',
                                      userTurn: `Selected mindset: ${value}`,
                                      structuredInput: {
                                        type: 'mindset_selection',
                                        data: { mindset_state: value }
                                      }
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Q7: Additional Context Yes/No (COMPASS Clarity Step - Final Question) */}
                          {reflection.step === 'clarity' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const q7Asked = payload['q7_asked'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: q7_asked not yet set, AI is asking Q7
                            if (q7Asked === true) {
                              return null;
                            }
                            
                            // Check if AI is asking Q7 (anything else to mention)
                            const isAskingQ7 = (coachReflection.toLowerCase().includes('anything else') ||
                                               coachReflection.toLowerCase().includes('anything important')) &&
                                              (coachReflection.toLowerCase().includes('mention') ||
                                               coachReflection.toLowerCase().includes('add') ||
                                               coachReflection.toLowerCase().includes('share'));
                            
                            if (!isAskingQ7) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <YesNoSelector
                                  question={coachReflection}
                                  yesLabel="Yes, there's more"
                                  noLabel="No, that's everything"
                                  onYes={() => {
                                    void (async (): Promise<void> => {
                                      if (submitting) {
                                        return;
                                      }
                                      
                                      setSubmitting(true);
                                      try {
                                        const result = await nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'clarity',
                                          userTurn: 'Yes, there is something else I want to mention',
                                          structuredInput: {
                                            type: 'q7_yes_response',
                                            data: { wants_to_add: true }
                                          }
                                        });

                                        if (!result.ok) {
                                          const errorMsg = result.message ?? "Unable to process your response. Please try again.";
                                          setNotification({ type: "error", message: errorMsg });
                                        }
                                      } catch (error: unknown) {
                                        console.error("Q7 Yes response error:", error);
                                        setNotification({ 
                                          type: "error", 
                                          message: "Failed to process response. Please try again." 
                                        });
                                      } finally {
                                        setSubmitting(false);
                                      }
                                    })();
                                  }}
                                  onNo={() => {
                                    void (async (): Promise<void> => {
                                      if (submitting) {
                                        return;
                                      }
                                      
                                      setSubmitting(true);
                                      try {
                                        const result = await nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'clarity',
                                          userTurn: 'No, that covers everything',
                                          structuredInput: {
                                            type: 'q7_no_response',
                                            data: { wants_to_add: false }
                                          }
                                        });

                                        if (!result.ok) {
                                          const errorMsg = result.message ?? "Unable to process your response. Please try again.";
                                          setNotification({ type: "error", message: errorMsg });
                                        }
                                      } catch (error: unknown) {
                                        console.error("Q7 No response error:", error);
                                        setNotification({ 
                                          type: "error", 
                                          message: "Failed to process response. Please try again." 
                                        });
                                      } finally {
                                        setSubmitting(false);
                                      }
                                    })();
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Ownership Confidence Scale (COMPASS Ownership Step - Final Re-check Only) */}
                          {reflection.step === 'ownership' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const ownershipConfidence = payload['ownership_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: ownership_confidence not yet captured AND AI is asking for it
                            if (ownershipConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence re-check (final question in Ownership)
                            // This is Q7 in the Standard Path - "Where's your confidence now?"
                            const isAskingForConfidence = (coachReflection.includes('1-10') || coachReflection.includes('/10')) &&
                                                         (coachReflection.toLowerCase().includes('where') || 
                                                          coachReflection.toLowerCase().includes('now')) &&
                                                         (coachReflection.toLowerCase().includes('confident') ||
                                                          coachReflection.toLowerCase().includes('confidence'));
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="Where's your confidence now? (1-10)"
                                  colorScheme="confidence"
                                  minLabel="Not confident at all"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'ownership',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Options Selector for Options Step */}
                          {reflection.step === 'options' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const options = payload['options'];
                            
                            if (!Array.isArray(options) || options.length === 0) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <OptionsSelector
                                  options={options.map((opt: Record<string, unknown>) => ({
                                    id: String(opt['id'] ?? ''),
                                    label: String(opt['label'] ?? ''),
                                    description: String(opt['description'] ?? ''),
                                    pros: Array.isArray(opt['pros']) ? opt['pros'].map(String) : [],
                                    cons: Array.isArray(opt['cons']) ? opt['cons'].map(String) : [],
                                    recommended: Boolean(opt['recommended'])
                                  }))}
                                  onSubmit={(selectedIds) => {
                                    // Send structured input to backend to store selection and advance step
                                    void (async () => {
                                      await nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: 'options',
                                        userTurn: `Selected options: ${selectedIds.join(', ')}`,
                                        structuredInput: {
                                          type: 'options_selection',
                                          data: { selected_option_ids: selectedIds }
                                        }
                                      });
                                      
                                      // Trigger AI to generate first suggested action for Will step
                                      void nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: 'will',
                                        userTurn: '', // Empty input - AI will generate suggested action
                                      });
                                    })();
                                  }}
                                  minSelections={1}
                                  maxSelections={5}
                                  coachMessage=""
                                />
                              </div>
                            );
                          })()}

                          {/* Action Validator for Will Step */}
                          {reflection.step === 'will' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const suggestedAction = payload['suggested_action'] as Record<string, unknown> | undefined;
                            const currentOptionLabel = payload['current_option_label'];
                            
                            if (suggestedAction === null || suggestedAction === undefined) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ActionValidator
                                  optionLabel={String(currentOptionLabel ?? '')}
                                  suggestedAction={{
                                    action: String(suggestedAction['action'] ?? ''),
                                    due_days: Number(suggestedAction['due_days'] ?? 7),
                                    owner: String(suggestedAction['owner'] ?? 'Me'),
                                    accountability_mechanism: String(suggestedAction['accountability_mechanism'] ?? ''),
                                    support_needed: String(suggestedAction['support_needed'] ?? '')
                                  }}
                                  onAccept={() => {
                                    // Accept suggested action (bypass AI processing)
                                    const currentOptionIndex = Number(payload['current_option_index'] ?? 0);
                                    const selectedOptionIds = payload['selected_option_ids'] as string[] | undefined;
                                    const optionId = selectedOptionIds?.[currentOptionIndex] ?? '';
                                    const totalOptions = selectedOptionIds?.length ?? 0;
                                    const nextIndex = currentOptionIndex + 1;
                                    const hasMoreOptions = nextIndex < totalOptions;
                                    
                                    void (async () => {
                                      // Store accepted action
                                      await nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: 'will',
                                        userTurn: 'Accepted suggested action',
                                        structuredInput: {
                                          type: 'action_accepted',
                                          data: { 
                                            option_id: optionId,
                                            action: suggestedAction 
                                          }
                                        }
                                      });
                                      
                                      // If more options, trigger AI to generate next suggested action
                                      if (hasMoreOptions) {
                                        void nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'will',
                                          userTurn: '', // Empty - AI generates next action
                                        });
                                      }
                                    })();
                                  }}
                                  onModify={(modifiedAction) => {
                                    // User modified the suggested action
                                    const currentOptionIndex = Number(payload['current_option_index'] ?? 0);
                                    const selectedOptionIds = payload['selected_option_ids'] as string[] | undefined;
                                    const optionId = selectedOptionIds?.[currentOptionIndex] ?? '';
                                    const totalOptions = selectedOptionIds?.length ?? 0;
                                    const nextIndex = currentOptionIndex + 1;
                                    const hasMoreOptions = nextIndex < totalOptions;
                                    
                                    void (async () => {
                                      // Store modified action (same as accept, but with modified data)
                                      await nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: 'will',
                                        userTurn: 'Modified and accepted action',
                                        structuredInput: {
                                          type: 'action_accepted',
                                          data: { 
                                            option_id: optionId,
                                            action: modifiedAction
                                          }
                                        }
                                      });
                                      
                                      // If more options, trigger AI to generate next suggested action
                                      if (hasMoreOptions) {
                                        void nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'will',
                                          userTurn: '', // Empty - AI generates next action
                                        });
                                      }
                                    })();
                                  }}
                                  onSkip={() => {
                                    // Skip this option (bypass AI processing)
                                    const currentOptionIndex = Number(payload['current_option_index'] ?? 0);
                                    const selectedOptionIds = payload['selected_option_ids'] as string[] | undefined;
                                    const optionId = selectedOptionIds?.[currentOptionIndex] ?? '';
                                    const totalOptions = selectedOptionIds?.length ?? 0;
                                    const nextIndex = currentOptionIndex + 1;
                                    const hasMoreOptions = nextIndex < totalOptions;
                                    
                                    void (async () => {
                                      // Store skip action
                                      await nextStepAction({
                                        orgId: session.orgId,
                                        userId: session.userId,
                                        sessionId: session._id,
                                        stepName: 'will',
                                        userTurn: 'Skipped this option',
                                        structuredInput: {
                                          type: 'action_skipped',
                                          data: { option_id: optionId }
                                        }
                                      });
                                      
                                      // If more options, trigger AI to generate next suggested action
                                      if (hasMoreOptions) {
                                        void nextStepAction({
                                          orgId: session.orgId,
                                          userId: session.userId,
                                          sessionId: session._id,
                                          stepName: 'will',
                                          userTurn: '', // Empty - AI generates next action
                                        });
                                      }
                                    })();
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Final Confidence Scale (COMPASS Practice Step) */}
                          {reflection.step === 'practice' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const finalConfidence = payload['final_confidence'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: final confidence not yet captured, AI is asking for it
                            if (finalConfidence !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for final confidence
                            const isAskingForFinalConfidence = (coachReflection.includes('1-10') || coachReflection.includes('/10')) &&
                                                               (coachReflection.toLowerCase().includes('where') || 
                                                                coachReflection.toLowerCase().includes('confidence now'));
                            
                            if (!isAskingForFinalConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="Where is your confidence now? (1-10)"
                                  colorScheme="confidence"
                                  minLabel="Not confident at all"
                                  maxLabel="Very confident"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'practice',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}

                          {/* Final Action Clarity Scale (COMPASS Practice Step) */}
                          {reflection.step === 'practice' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const finalActionClarity = payload['final_action_clarity'];
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: final action clarity not yet captured, AI is asking for it
                            if (finalActionClarity !== undefined) {
                              return null;
                            }
                            
                            // Check if AI is asking for action clarity
                            const isAskingForActionClarity = (coachReflection.includes('1-10') || coachReflection.includes('/10')) &&
                                                            (coachReflection.toLowerCase().includes('clear') || 
                                                             coachReflection.toLowerCase().includes('next steps'));
                            
                            if (!isAskingForActionClarity) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ConfidenceScaleSelector
                                  question="How clear are you on your next steps? (1-10)"
                                  colorScheme="clarity"
                                  minLabel="Very unclear"
                                  maxLabel="Crystal clear"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'practice',
                                      userTurn: String(value),
                                    });
                                  }}
                                />
                              </div>
                            );
                          })()}
                          
                          {/* Review Confidence Selector (GROW Review Step) */}
                          {session.framework === 'GROW' && reflection.step === 'review' && isLastReflection && !isSessionComplete && (() => {
                            const payload = reflection.payload as Record<string, unknown>;
                            const confidenceLevel = payload['confidence_level'];
                            const hasKeyTakeaways = typeof payload['key_takeaways'] === 'string' && payload['key_takeaways'].length > 0;
                            const hasImmediateStep = typeof payload['immediate_step'] === 'string' && payload['immediate_step'].length > 0;
                            const coachReflection = String(payload['coach_reflection'] ?? '');
                            
                            // Only show if: Q1 and Q2 answered, confidence not yet captured, AI is asking for it
                            if (confidenceLevel !== undefined || !hasKeyTakeaways || !hasImmediateStep) {
                              return null;
                            }
                            
                            // Check if AI is asking for confidence
                            const isAskingForConfidence = coachReflection.toLowerCase().includes('confident') &&
                                                         coachReflection.toLowerCase().includes('plan');
                            
                            if (!isAskingForConfidence) {
                              return null;
                            }
                            
                            return (
                              <div className="mt-4">
                                <ReviewConfidenceSelector
                                  question="How confident are you feeling about this plan?"
                                  onSelect={(value) => {
                                    void nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: 'review',
                                      userTurn: String(value),
                                    });
                                  }}
                                  isLoading={submitting}
                                />
                              </div>
                            );
                          })()}

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
                            const ownershipConf = payload['ownership_confidence'];
                            const finalConf = payload['final_confidence'];
                            
                            // Ownership stage: Show ownership confidence vs initial
                            if (reflection.step === 'ownership' && 
                                typeof initialConf === 'number' &&
                                typeof ownershipConf === 'number' &&
                                ownershipConf > initialConf) {
                              return (
                                <div className="mt-3">
                                  <ConfidenceTracker
                                    initialConfidence={initialConf}
                                    currentConfidence={ownershipConf}
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

                          {/* Step Confirmation Buttons - NEW */}
                          {awaitingConfirmation && isLastReflection && !isSessionComplete && (
                            <div className="mt-4">
                              <StepConfirmationButtons
                                stepName={reflection.step}
                                nextStepName={getNextStepName(reflection.step)}
                                onProceed={() => {
                                  void (async () => {
                                    const result = await nextStepAction({
                                      orgId: session.orgId,
                                      userId: session.userId,
                                      sessionId: session._id,
                                      stepName: reflection.step,
                                      userTurn: '',
                                      structuredInput: {
                                        type: 'step_confirmation',
                                        data: { action: 'proceed' }
                                      }
                                    });
                                    
                                    // Check if backend signaled to trigger report generation (GROW/CAREER review step)
                                    if (result !== null && result !== undefined && 'triggerReportGeneration' in result && result.triggerReportGeneration === true) {
                                      setGeneratingReport(true);
                                      try {
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
                                      } catch (error: unknown) {
                                        console.error("Report generation error:", error);
                                        setNotification({ type: "error", message: "Failed to generate report. Please try again." });
                                      } finally {
                                        setGeneratingReport(false);
                                      }
                                    }
                                  })();
                                }}
                                onAmend={() => {
                                  void nextStepAction({
                                    orgId: session.orgId,
                                    userId: session.userId,
                                    sessionId: session._id,
                                    stepName: reflection.step,
                                    userTurn: '',
                                    structuredInput: {
                                      type: 'step_confirmation',
                                      data: { action: 'amend' }
                                    }
                                  });
                                }}
                                isLoading={submitting}
                              />
                            </div>
                          )}
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
                  {frameworkQuestions?.[currentStep]?.title ?? COACHING_PROMPTS[currentStep]?.title ?? "Coaching Questions"}
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
                      {(frameworkQuestions?.[currentStep]?.questions ?? COACHING_PROMPTS[currentStep]?.questions ?? []).map((question, _idx) => (
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
                                            // Format actions (GROW uses 'action' field, COMPASS uses 'title')
                                            if (typeof item === 'object' && item !== null) {
                                              const actionObj = item as Record<string, unknown>;
                                              const actionText = typeof actionObj['action'] === 'string' 
                                                ? actionObj['action'] 
                                                : typeof actionObj['title'] === 'string' 
                                                  ? actionObj['title'] 
                                                  : null;
                                              
                                              if (actionText !== null) {
                                                return (
                                                  <li key={idx} className="text-xs">
                                                    {actionText.substring(0, 60)}{actionText.length > 60 ? '...' : ''}
                                                  </li>
                                                );
                                              }
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
                        {(frameworkQuestions?.[currentStep]?.questions ?? COACHING_PROMPTS[currentStep]?.questions ?? []).map((question, _idx) => (
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
                          {step.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
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
      {/* Show input during all active coaching stages */}
      {(currentStep === 'introduction' || currentStep === 'clarity' || currentStep === 'ownership' || currentStep === 'mapping' || currentStep === 'practice' || currentStep === 'goal' || currentStep === 'reality' || currentStep === 'options' || currentStep === 'will' || currentStep === 'review' || currentStep === 'INTRODUCTION' || currentStep === 'ASSESSMENT' || currentStep === 'GAP_ANALYSIS' || currentStep === 'ROADMAP' || currentStep === 'REVIEW') && !isSessionComplete && (
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

      {/* Amendment Modal - NEW */}
      {amendmentMode?.active === true && reflections !== undefined && (
        <AmendmentModal
          stepName={amendmentMode.step}
          fields={extractFieldsForAmendment(amendmentMode.step, reflections)}
          onSave={(amendments) => {
            void nextStepAction({
              orgId: session.orgId,
              userId: session.userId,
              sessionId: session._id,
              stepName: amendmentMode.step,
              userTurn: '',
              structuredInput: {
                type: 'amendment_complete',
                data: { action: 'save', amendments }
              }
            });
          }}
          onCancel={() => {
            void nextStepAction({
              orgId: session.orgId,
              userId: session.userId,
              sessionId: session._id,
              stepName: amendmentMode.step,
              userTurn: '',
              structuredInput: {
                type: 'amendment_complete',
                data: { action: 'cancel' }
              }
            });
          }}
          isLoading={submitting}
        />
      )}

      {/* Step Selector Modal for Review - NEW */}
      {showStepSelector && session !== undefined && session !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Select Step to Amend
            </h3>
            <div className="space-y-2">
              {getStepsForFramework(session.framework).map(step => (
                <button
                  key={step}
                  onClick={() => {
                    setShowStepSelector(false);
                    void nextStepAction({
                      orgId: session.orgId,
                      userId: session.userId,
                      sessionId: session._id,
                      stepName: 'review',
                      userTurn: '',
                      structuredInput: {
                        type: 'review_amendment_selection',
                        data: { step }
                      }
                    });
                  }}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-900 dark:text-gray-100 rounded-lg text-left font-medium transition-colors"
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStepSelector(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
