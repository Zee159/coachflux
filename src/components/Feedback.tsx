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
    <section id="feedback" className="px-6 py-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Feedback</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Help us improve by sharing your experience.</p>
        </div>

        <form onSubmit={(e) => { void onSubmit(e); }} className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 md:p-8 border border-violet-100 dark:border-gray-600">
          {status === "success" && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-200 text-sm">
              Thank you! Your feedback has been received.
            </div>
          )}
          {error !== null && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating (optional)</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((r) => (
                <label
                  key={r}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                    rating === r
                      ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={r}
                    checked={rating === r}
                    onChange={() => setRating(r)}
                    className="sr-only"
                  />
                  <span className={rating === r ? "text-fuchsia-700 dark:text-fuchsia-300" : "text-gray-700 dark:text-gray-300"}>
                    {r}
                  </span>
                </label>
              ))}
              {rating !== undefined && (
                <button
                  type="button"
                  onClick={() => setRating(undefined)}
                  className="ml-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[120px]"
              placeholder="Share what's working well or what needs improvement"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              {status === "submitting" ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
