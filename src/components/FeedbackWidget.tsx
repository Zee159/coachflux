import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface FeedbackWidgetProps {
  sessionId?: Id<"sessions">;
}

export function FeedbackWidget({ sessionId }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [overallRating, setOverallRating] = useState<number | undefined>(undefined);
  const [uxRating, setUxRating] = useState<number | undefined>(undefined);
  const [growMethodRating, setGrowMethodRating] = useState<number | undefined>(undefined);
  const [easeOfUse, setEaseOfUse] = useState<string>("");
  const [helpfulness, setHelpfulness] = useState<string>("");
  const [willingToPay, setWillingToPay] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");

  const createFeedback = useMutation(api.mutations.createFeedback);

  const orgIdStr = (() => {
    try {
      return localStorage.getItem("coachflux_demo_org");
    } catch {
      return null;
    }
  })();
  const userIdStr = (() => {
    try {
      return localStorage.getItem("coachflux_demo_user");
    } catch {
      return null;
    }
  })();

  function resetForm() {
    setStep(1);
    setOverallRating(undefined);
    setUxRating(undefined);
    setGrowMethodRating(undefined);
    setEaseOfUse("");
    setHelpfulness("");
    setWillingToPay("");
    setImprovements("");
    setSubmitted(false);
    setError(null);
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await createFeedback({
        orgId: (orgIdStr !== null && orgIdStr.length > 0) ? (orgIdStr as Id<"orgs">) : undefined,
        userId: (userIdStr !== null && userIdStr.length > 0) ? (userIdStr as Id<"users">) : undefined,
        sessionId,
        overallRating,
        uxRating,
        growMethodRating,
        easeOfUse: easeOfUse.length > 0 ? easeOfUse : undefined,
        helpfulness: helpfulness.length > 0 ? helpfulness : undefined,
        willingToPay: willingToPay.length > 0 ? willingToPay : undefined,
        improvements: improvements.length > 0 ? improvements : undefined,
      });
      setSubmitted(true);
      setSubmitting(false);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback. Please try again.");
      setSubmitting(false);
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return overallRating !== undefined;
    }
    if (step === 2) {
      return uxRating !== undefined && easeOfUse.length > 0;
    }
    if (step === 3) {
      return growMethodRating !== undefined && helpfulness.length > 0;
    }
    return true;
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        aria-label="Open feedback"
      >
        <svg 
          className="w-6 h-6 group-hover:rotate-12 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">How's your experience?</h3>
                  <p className="text-sm text-violet-100 mt-1">Help us improve CoachFlux</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      s <= step ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error !== null && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}
              {submitted ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You! 🎉</h4>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">Your feedback is valuable to us.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This window will close automatically...</p>
                </div>
              ) : (
                <>
                  {/* Step 1: Overall Experience */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Overall Experience *
                        </label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setOverallRating(rating)}
                              className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                overallRating === rating
                                  ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20 scale-110"
                                  : "border-gray-200 dark:border-gray-600 hover:border-fuchsia-400 hover:scale-105"
                              }`}
                            >
                              <span className="text-2xl">
                                {rating === 1 ? "😞" : rating === 2 ? "😕" : rating === 3 ? "😐" : rating === 4 ? "🙂" : "😄"}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: UX & Ease of Use */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          User Experience Rating *
                        </label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setUxRating(rating)}
                              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
                                uxRating === rating
                                  ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 scale-110"
                                  : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-violet-400 hover:scale-105"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Was the interface easy to use? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Very Easy", "Easy", "Confusing", "Difficult"].map((option) => (
                            <button
                              key={option}
                              onClick={() => setEaseOfUse(option)}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                easeOfUse === option
                                  ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                                  : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-violet-400"
                              }`}
                            >
                              {option === "Very Easy" && "✅ "}
                              {option === "Easy" && "👍 "}
                              {option === "Confusing" && "🤔 "}
                              {option === "Difficult" && "❌ "}
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: GROW Method */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          GROW Coaching Method Rating *
                        </label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setGrowMethodRating(rating)}
                              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
                                growMethodRating === rating
                                  ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 scale-110"
                                  : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-fuchsia-400 hover:scale-105"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Did the coaching questions help you? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Very Helpful", "Somewhat Helpful", "Not Very Helpful", "Not Helpful"].map((option) => (
                            <button
                              key={option}
                              onClick={() => setHelpfulness(option)}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                helpfulness === option
                                  ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300"
                                  : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"
                              }`}
                            >
                              {option === "Very Helpful" && "⭐ "}
                              {option === "Somewhat Helpful" && "👌 "}
                              {option === "Not Very Helpful" && "😐 "}
                              {option === "Not Helpful" && "👎 "}
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Pricing & Improvements */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Would you be willing to pay for CoachFlux?
                        </label>
                        <div className="space-y-2">
                          {[
                            "Yes, one-time payment",
                            "Yes, subscription",
                            "Yes, both options",
                            "Maybe, depends on price",
                            "No, prefer free version"
                          ].map((option) => (
                            <button
                              key={option}
                              onClick={() => setWillingToPay(option)}
                              className={`w-full p-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                                willingToPay === option
                                  ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                                  : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-violet-400"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          What could we improve?
                        </label>
                        <textarea
                          value={improvements}
                          onChange={(e) => setImprovements(e.target.value)}
                          placeholder="Share your suggestions..."
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 min-h-[100px]"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {improvements.length}/500 characters
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
                      >
                        Back
                      </button>
                    )}
                    {step < 4 ? (
                      <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={() => void handleSubmit()}
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {submitting ? "Submitting..." : "Submit Feedback"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
