import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

export function DemoSetup() {
  const [orgName, setOrgName] = useState("Acme Corp");
  const [displayName, setDisplayName] = useState("Demo User");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createOrg = useMutation(api.mutations.createOrg);
  const createUser = useMutation(api.mutations.createUser);

  async function handleSetup() {
    setLoading(true);
    try {
      // Create organisation with sample values
      const orgId = await createOrg({
        name: orgName,
        values: [
          { key: "Integrity", description: "We act with honesty and accountability" },
          { key: "Innovation", description: "We embrace creativity and continuous improvement" },
          { key: "Collaboration", description: "We work together to achieve common goals" },
          { key: "Excellence", description: "We strive for the highest quality in everything we do" },
          { key: "Customer-First", description: "We prioritise our customers' needs and success" },
        ],
      });

      // Create demo user
      const userId = await createUser({
        authId: `demo-${Date.now()}`,
        orgId,
        role: "member",
        displayName,
      });

      // Store in localStorage for demo purposes
      localStorage.setItem("coachflux_demo_org", orgId);
      localStorage.setItem("coachflux_demo_user", userId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Setup failed:", error);
      alert("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CoachFlux</h1>
        <p className="text-gray-600 mb-6">Leadership Reflection Platform</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full name"
            />
          </div>

          <button
            onClick={() => void handleSetup()}
            disabled={loading || orgName.trim() === '' || displayName.trim() === ''}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Setting up..." : "Start Demo"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Demo Mode:</strong> This will create a sample organisation with
            predefined values and a demo user account.
          </p>
        </div>
      </div>
    </div>
  );
}
