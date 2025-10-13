import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [orgId, setOrgId] = useState<Id<"orgs"> | null>(null);

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
      if (activeSession !== undefined && confirm("You have an active session. Continue where you left off?")) {
        navigate(`/session/${activeSession._id}`);
      }
      return;
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
      alert(userMessage);
    }
  }

  if (user === null || user === undefined || org === null || org === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const activeSessions = sessions?.filter((s) => s.closedAt === null || s.closedAt === undefined) ?? [];
  const completedSessions = sessions?.filter((s) => s.closedAt !== null && s.closedAt !== undefined) ?? [];
  const openActions = actions?.filter((a) => a.status === "open") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CoachFlux</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {user.displayName} · {org.name}
              </p>
            </div>
            <button
              onClick={() => void handleStartSession()}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              {activeSessions.length > 0 ? "Continue Session" : "New Session"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Total Sessions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {sessions?.length ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Completed
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {completedSessions.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Open Actions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {openActions.length}
            </div>
          </div>
        </div>

        {activeSessions.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-indigo-900 mb-3 sm:mb-2">
              Active Session
            </h2>
            {activeSessions.map((session) => (
              <div key={session._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-sm sm:text-base text-indigo-700">
                    Step: <span className="font-medium uppercase">{session.step}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-indigo-600">
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
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Sessions
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {sessions !== null && sessions !== undefined && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div
                      key={session._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {session.framework} - {session.step}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(session.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          session.closedAt !== null && session.closedAt !== undefined
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {session.closedAt !== null && session.closedAt !== undefined ? "Completed" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No sessions yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Action Items
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {actions !== null && actions !== undefined && actions.length > 0 ? (
                <div className="space-y-4">
                  {actions.slice(0, 5).map((action) => (
                    <div
                      key={action._id}
                      className="flex justify-between items-start p-3 bg-gray-50 rounded-md gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{action.title}</p>
                        {action.dueAt !== null && action.dueAt !== undefined && (
                          <p className="text-sm text-gray-600">
                            Due: {new Date(action.dueAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          action.status === "done"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No actions yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
