import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function Feedback() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const createFeedback = useMutation(api.mutations.createFeedback);

  const orgIdStr: string | null = (() => {
    try { return localStorage.getItem("coachflux_demo_org"); } catch { return null; }
  })();
  const userIdStr: string | null = (() => {
    try { return localStorage.getItem("coachflux_demo_user"); } catch { return null; }
  })();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length === 0) {
      setError("Please enter your feedback message.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const payload: {
        orgId?: Id<"orgs">;
        userId?: Id<"users">;
        name?: string;
        email?: string;
        rating?: number;
        page?: string;
        message: string;
      } = {
        name: trimmedName.length > 0 ? trimmedName : undefined,
        email: trimmedEmail.length > 0 ? trimmedEmail : undefined,
        rating: rating ?? undefined,
        page: window.location.pathname,
        message: message.trim(),
      };
      if (orgIdStr !== null && orgIdStr.length > 0) {
        payload.orgId = orgIdStr as Id<"orgs">;
      }
      if (userIdStr !== null && userIdStr.length > 0) {
        payload.userId = userIdStr as Id<"users">;
      }

      await createFeedback(payload);
      setStatus("success");
      setName("");
      setEmail("");
      setRating(undefined);
      setMessage("");
    } catch (err) {
      console.error("Feedback submit failed", err);
      setStatus("error");
      setError("Couldn't send feedback. Please try again.");
    }
  }

  return (
    <section id="feedback" className="px-6 py-20 bg-white border-t border-gray-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Feedback</h2>
          <p className="text-gray-600 mt-2">Help us improve by sharing your experience.</p>
        </div>

        <form onSubmit={(e) => { void onSubmit(e); }} className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6 md:p-8 border border-violet-100">
          {status === "success" && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
              Thank you! Your feedback has been received.
            </div>
          )}
          {error !== null && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 bg-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 bg-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (optional)</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`w-10 h-10 rounded-lg border-2 ${rating === r ? "border-fuchsia-600 bg-fuchsia-50" : "border-gray-200 bg-white"}`}
                  aria-pressed={rating === r}
                >
                  {r}
                </button>
              ))}
              {rating !== undefined && (
                <button
                  type="button"
                  onClick={() => setRating(undefined)}
                  className="ml-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 bg-white min-h-[120px]"
              placeholder="Share what's working well or what needs improvement"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              {status === "submitting" ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
