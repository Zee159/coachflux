import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { ThemeToggle } from "./ThemeToggle";
import { SessionReport } from "./SessionReport";
import { FeedbackWidget } from "./FeedbackWidget";

// SessionCard component with executive summary
interface SessionCardProps {
  sessionId: Id<"sessions">;
  framework: string;
  step: string;
  startedAt: number;
  isCompleted: boolean;
  onClick: () => void;
}

function SessionCard({ sessionId, framework, step, startedAt, isCompleted, onClick }: SessionCardProps) {
  const reflections = useQuery(api.queries.getSessionReflections, { sessionId });
  
  // Get review summary if session is completed
  const reviewReflection = reflections?.find((r) => r.step === "review");
  const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;
  const summary = reviewPayload !== undefined && typeof reviewPayload['summary'] === 'string' 
    ? reviewPayload['summary'] 
    : undefined;
  
  // Check if incomplete (Phase 1 only - has coach_reflection but no summary)
  const isIncomplete = isCompleted && 
    reviewPayload !== undefined && 
    typeof reviewPayload['summary'] !== 'string' && 
    typeof reviewPayload['coach_reflection'] === 'string';
  
  return (
    <div
      onClick={onClick}
      className={`p-3 bg-gray-50 dark:bg-gray-700 rounded-md gap-2 transition-all ${ 
        isCompleted ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
            {framework} - {step}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {new Date(startedAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            isCompleted
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
          }`}
        >
          {isCompleted ? "Completed" : "Active"}
        </span>
      </div>
      
      {/* Executive Summary - only for completed sessions */}
      {isCompleted && !isIncomplete && summary !== undefined && summary.length > 0 && (
        <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
            Executive Summary
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {summary}
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            Click to view full report →
          </p>
        </div>
      )}
      
      {/* Warning for incomplete sessions */}
      {isIncomplete && (
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            ⚠️ Incomplete session - closed before review was finished
          </p>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [orgId, setOrgId] = useState<Id<"orgs"> | null>(null);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [notification, setNotification] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<Id<"sessions"> | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("coachflux_demo_user");
    const storedOrgId = localStorage.getItem("coachflux_demo_org");
    if (storedUserId !== null && storedUserId !== '' && storedOrgId !== null && storedOrgId !== '') {
      setUserId(storedUserId as Id<"users">);
      setOrgId(storedOrgId as Id<"orgs">);
    } else {
      navigate("/setup");
    }
  }, [navigate]);

  const user = useQuery(
    api.queries.getUser, 
    userId !== null && userId !== undefined ? { userId } : "skip"
  );
  const org = useQuery(
    api.queries.getOrg, 
    orgId !== null && orgId !== undefined ? { orgId } : "skip"
  );
  const sessions = useQuery(
    api.queries.getUserSessions,
    userId !== null && userId !== undefined ? { userId } : "skip"
  );
  const actions = useQuery(
    api.queries.getUserActions,
    userId !== null && userId !== undefined ? { userId } : "skip"
  );

  const createSession = useMutation(api.mutations.createSession);

  async function handleStartSession() {
    if (userId === null || userId === undefined || orgId === null || orgId === undefined) {
      return;
    }

    // Check for active session before attempting to create
    if (activeSessions.length > 0) {
      const activeSession = activeSessions[0];
      if (activeSession !== undefined) {
        setShowContinueModal(true);
        return;
      }
    }

    try {
      const sessionId = await createSession({
        orgId,
        userId,
        framework: "GROW",
      });
      navigate(`/session/${sessionId}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to start session";
      const userMessage = message.includes("already has an active session")
        ? "You have an active session. Please close it first from the Dashboard."
        : "Failed to start session. Please try again or contact support.";
      setNotification({ type: "error", message: userMessage });
    }
  }

  if (user === null || user === undefined || org === null || org === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const activeSessions = sessions?.filter((s) => s.closedAt === null || s.closedAt === undefined) ?? [];
  const completedSessions = sessions?.filter((s) => s.closedAt !== null && s.closedAt !== undefined) ?? [];
  const openActions = actions?.filter((a) => a.status === "open") ?? [];

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

      {/* Continue Session Modal */}
      {showContinueModal && activeSessions.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Continue Active Session?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You have an active session in progress. Would you like to continue where you left off?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContinueModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                Start New
              </button>
              <button
                onClick={() => {
                  const activeSession = activeSessions[0];
                  if (activeSession !== undefined) {
                    navigate(`/session/${activeSession._id}`);
                  }
                  setShowContinueModal(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">CoachFlux</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {user.displayName} · {org.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="relative">
                <button
                  onClick={() => void handleStartSession()}
                  className={`w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors ${
                    sessions?.length === 0 ? 'animate-pulse-glow' : ''
                  }`}
                >
                  {activeSessions.length > 0 ? "Continue Session" : "New Session"}
                </button>
                {/* First-time user tooltip */}
                {sessions?.length === 0 && (
                  <div className="absolute -bottom-16 right-0 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-3 shadow-lg animate-bounce-subtle pointer-events-none">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                        Start your first coaching session!
                      </p>
                      <span className="text-2xl">👆</span>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-indigo-50 dark:bg-indigo-900/20 border-t-2 border-l-2 border-indigo-200 dark:border-indigo-800 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Sessions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {sessions?.length ?? 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Completed
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {completedSessions.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Open Actions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {openActions.length}
            </div>
          </div>
        </div>

        {activeSessions.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3 sm:mb-2">
              Active Session
            </h2>
            {activeSessions.map((session) => (
              <div key={session._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-sm sm:text-base text-indigo-700 dark:text-indigo-300">
                    Step: <span className="font-medium uppercase">{session.step}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                    Started {new Date(session.startedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/session/${session._id}`)}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Recent Sessions
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {sessions !== null && sessions !== undefined && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => {
                    const isCompleted = session.closedAt !== null && session.closedAt !== undefined;
                    return (
                      <SessionCard
                        key={session._id}
                        sessionId={session._id}
                        framework={session.framework}
                        step={session.step}
                        startedAt={session.startedAt}
                        isCompleted={isCompleted}
                        onClick={() => {
                          if (isCompleted) {
                            setSelectedSessionId(session._id);
                          } else {
                            navigate(`/session/${session._id}`);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No sessions yet</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Action Items
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {actions !== null && actions !== undefined && actions.length > 0 ? (
                <div className="space-y-4">
                  {actions.slice(0, 5).map((action) => (
                    <div
                      key={action._id}
                      className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-words">{action.title}</p>
                        {action.dueAt !== null && action.dueAt !== undefined && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Due: {new Date(action.dueAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          action.status === "done"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                        }`}
                      >
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No actions yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Session Report Modal */}
      {selectedSessionId !== null && (
        <SessionReport
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}
