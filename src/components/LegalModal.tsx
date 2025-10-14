import { useState } from "react";

interface LegalModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function LegalModal({ isOpen, onAccept, onDecline }: LegalModalProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToPrototype, setAgreedToPrototype] = useState(false);

  if (!isOpen) {
    return null;
  }

  const canAccept = agreedToTerms && agreedToPrivacy && agreedToPrototype;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-blue-600 dark:text-blue-400 text-2xl">🛡️</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Legal Agreement Required
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Development Prototype • Please Review Carefully
              </p>
            </div>
          </div>
          <button
            onClick={onDecline}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <span className="text-gray-500 text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Prototype Warning Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 text-xl">⚠️</span>
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  This is a Development Prototype
                </p>
                <p className="text-amber-800 dark:text-amber-300">
                  CoachFlux is for testing purposes only. Do not input highly sensitive information. 
                  Features may change without notice. Not a substitute for professional coaching or therapy.
                </p>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I have read and agree to the{" "}
                <a
                  href="https://github.com/Zee159/coachflux/blob/main/TERMS_OF_SERVICE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I have read and agree to the{" "}
                <a
                  href="https://github.com/Zee159/coachflux/blob/main/PRIVACY_POLICY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToPrototype}
                onChange={(e) => setAgreedToPrototype(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I understand this is a <strong>development prototype</strong> and will not input highly sensitive information
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!canAccept}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                canAccept
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
