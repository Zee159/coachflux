import { useState } from "react";

interface LegalModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function LegalModal({ isOpen, onAccept, onDecline }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
  const [hasScrolledPrivacy, setHasScrolledPrivacy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isScrolledToBottom = 
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    
    if (isScrolledToBottom) {
      if (activeTab === "terms") {
        setHasScrolledTerms(true);
      } else {
        setHasScrolledPrivacy(true);
      }
    }
  };

  const canAccept = agreedToTerms && agreedToPrivacy && hasScrolledTerms && hasScrolledPrivacy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col">
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

        {/* Prototype Warning Banner */}
        <div className="mx-6 mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
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

        {/* Tabs */}
        <div className="flex gap-2 px-6 mt-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "terms"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span>📄</span>
            Terms of Service
            {hasScrolledTerms && agreedToTerms && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "privacy"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span>🔒</span>
            Privacy Policy
            {hasScrolledPrivacy && agreedToPrivacy && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 text-sm text-gray-700 dark:text-gray-300"
          onScroll={handleScroll}
        >
          {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
          
          {/* Scroll indicator */}
          {((activeTab === "terms" && !hasScrolledTerms) || 
            (activeTab === "privacy" && !hasScrolledPrivacy)) && (
            <div className="sticky bottom-0 left-0 right-0 py-3 text-center bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                ↓ Please scroll to the bottom to continue ↓
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {/* Checkboxes */}
          <div className="space-y-3 mb-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={!hasScrolledTerms}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={`text-sm ${!hasScrolledTerms ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                I have read and agree to the <strong>Terms of Service</strong>
                {!hasScrolledTerms && " (scroll to bottom first)"}
              </span>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                disabled={!hasScrolledPrivacy}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={`text-sm ${!hasScrolledPrivacy ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                I have read and agree to the <strong>Privacy Policy</strong>
                {!hasScrolledPrivacy && " (scroll to bottom first)"}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms && agreedToPrivacy}
                disabled
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded disabled:opacity-50"
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

function TermsContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h3 className="text-lg font-bold mb-4">Terms of Service Summary</h3>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Key Points:</h4>
        <ul className="space-y-1 text-blue-800 dark:text-blue-300 text-sm">
          <li>✓ This is a <strong>development prototype</strong> for testing purposes</li>
          <li>✓ Provided "as-is" without warranties</li>
          <li>✓ Not a substitute for professional coaching, therapy, or medical advice</li>
          <li>✓ For workplace leadership development only</li>
          <li>✓ Uses established coaching frameworks (GROW, CLEAR)</li>
          <li>✓ You retain ownership of your reflections</li>
        </ul>
      </div>

      <h4 className="font-semibold mt-6 mb-3">1. Prototype Status</h4>
      <p>
        CoachFlux is a <strong>development prototype</strong> provided for internal testing and evaluation. 
        It may contain bugs, incomplete features, or undergo significant changes without notice.
      </p>

      <h4 className="font-semibold mt-6 mb-3">2. What CoachFlux Is</h4>
      <p>
        An AI-assisted leadership reflection tool that facilitates structured self-reflection using 
        established coaching frameworks (GROW, CLEAR, etc.) powered by Claude AI.
      </p>

      <h4 className="font-semibold mt-6 mb-3">3. What CoachFlux Is NOT</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>A substitute for professional coaching, therapy, or counselling</li>
        <li>A mental health treatment or diagnostic tool</li>
        <li>A source of medical, legal, or financial advice</li>
        <li>An HR dispute resolution system</li>
        <li>Affiliated with ICF, EMCC, or other coaching certification bodies</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">4. Scope Limitations</h4>
      <p className="font-medium text-red-600 dark:text-red-400">
        Do NOT use CoachFlux for:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-red-600 dark:text-red-400">
        <li>Mental health issues (depression, anxiety, PTSD, etc.)</li>
        <li>Medical advice or diagnosis</li>
        <li>Legal advice or dispute resolution</li>
        <li>Financial planning or investment advice</li>
        <li>HR complaints or harassment allegations</li>
        <li>Crisis situations or emergencies</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">5. Crisis Resources</h4>
      <p>
        If experiencing a mental health crisis:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>UK:</strong> Samaritans at 116 123 or text SHOUT to 85258</li>
        <li><strong>US:</strong> Call 988 Suicide & Crisis Lifeline</li>
        <li><strong>International:</strong> Contact local emergency services</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">6. Your Responsibilities</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Use only for professional development purposes</li>
        <li>Provide honest, work-related reflections</li>
        <li>Take personal responsibility for decisions</li>
        <li>Respect boundaries and safety guardrails</li>
        <li>Do not input highly sensitive or confidential information</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">7. Intellectual Property</h4>
      <p>
        CoachFlux uses established coaching methodologies:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>GROW Model:</strong> Based on framework by Sir John Whitmore (widely-used methodology)</li>
        <li><strong>CLEAR Model:</strong> Based on framework by Peter Hawkins</li>
        <li><strong>Coaching Principles:</strong> Based on professional coaching best practices</li>
      </ul>
      <p className="mt-2">
        You retain ownership of your reflections. We retain ownership of the CoachFlux platform.
      </p>

      <h4 className="font-semibold mt-6 mb-3">8. Data & Privacy</h4>
      <p>
        Your data is processed by:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Convex:</strong> Database and backend storage</li>
        <li><strong>Anthropic:</strong> AI processing (Claude does not train on your data)</li>
      </ul>
      <p className="mt-2">
        See our <strong>Privacy Policy</strong> for full details on data collection, use, and your rights.
      </p>

      <h4 className="font-semibold mt-6 mb-3">9. Liability Disclaimer</h4>
      <p className="font-medium">
        THE PLATFORM IS PROVIDED "AS-IS" WITHOUT WARRANTIES. We are NOT liable for:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Decisions you make based on AI reflections</li>
        <li>Data loss or service interruptions</li>
        <li>Inaccuracies in AI-generated content</li>
        <li>Indirect or consequential damages</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">10. Modifications & Termination</h4>
      <p>
        As a prototype, the platform may change features, experience downtime, or be discontinued 
        at any time without notice. We may terminate access for violations of these Terms.
      </p>

      <h4 className="font-semibold mt-6 mb-3">11. Governing Law</h4>
      <p>
        These Terms are governed by the laws of England and Wales.
      </p>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-8">
        <p className="text-sm font-medium">
          <strong>Full Terms:</strong> For complete Terms of Service, see TERMS_OF_SERVICE.md in the project repository.
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Last Updated: October 14, 2025 • Version 1.0 (Development Prototype)
        </p>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h3 className="text-lg font-bold mb-4">Privacy Policy Summary</h3>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Key Points:</h4>
        <ul className="space-y-1 text-purple-800 dark:text-purple-300 text-sm">
          <li>✓ We collect coaching session data to provide the service</li>
          <li>✓ Your data is processed by Convex (database) and Anthropic (AI)</li>
          <li>✓ We do NOT sell your data or use it for advertising</li>
          <li>✓ You have rights to access, delete, and export your data</li>
          <li>✓ This is a prototype - security measures are still being refined</li>
          <li>✓ Do NOT input highly sensitive or confidential information</li>
        </ul>
      </div>

      <h4 className="font-semibold mt-6 mb-3">1. What Data We Collect</h4>
      
      <p className="font-medium">Account Information:</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Display name, organisation, role</li>
        <li>Authentication ID (unique identifier)</li>
      </ul>

      <p className="font-medium">Coaching Session Data:</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Your typed reflections and responses</li>
        <li>Goals, reality assessments, options, actions</li>
        <li>AI-generated coaching reflections</li>
        <li>Session timestamps and framework used</li>
      </ul>

      <p className="font-medium">Safety & Moderation Data:</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Flagged content (safety incidents)</li>
        <li>Banned term detections</li>
        <li>Validation failures</li>
      </ul>

      <p className="font-medium">Optional Feedback:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Ratings and improvement suggestions (if you provide them)</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">2. What We Do NOT Collect</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>❌ Email addresses (in prototype phase)</li>
        <li>❌ Payment information</li>
        <li>❌ IP addresses or device identifiers</li>
        <li>❌ Cookies or tracking pixels</li>
        <li>❌ Location data</li>
        <li>❌ Social media profiles</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">3. How We Use Your Data</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Provide Service:</strong> Enable coaching sessions, store reflections, track actions</li>
        <li><strong>Generate AI Responses:</strong> Send reflections to Claude AI for processing</li>
        <li><strong>Ensure Safety:</strong> Detect and prevent inappropriate use</li>
        <li><strong>Product Development:</strong> Test features, fix bugs, improve prompts</li>
        <li><strong>Analytics:</strong> Anonymised usage statistics (cannot be traced to individuals)</li>
      </ul>

      <p className="mt-3 font-medium text-green-600 dark:text-green-400">
        We do NOT sell your data, use it for advertising, or share it with other organisations.
      </p>

      <h4 className="font-semibold mt-6 mb-3">4. Third-Party Services</h4>
      
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3">
        <p className="font-medium">Convex (Database & Backend)</p>
        <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
          <li>Stores all CoachFlux data</li>
          <li>Cloud infrastructure (check Convex docs for regions)</li>
          <li>Privacy Policy: convex.dev/privacy</li>
        </ul>
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
        <p className="font-medium">Anthropic (AI Processing)</p>
        <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
          <li>Generates coaching reflections using Claude AI</li>
          <li>Located in United States</li>
          <li>Does NOT train models on your data</li>
          <li>Privacy Policy: anthropic.com/privacy</li>
        </ul>
      </div>

      <h4 className="font-semibold mt-6 mb-3">5. Data Security</h4>
      
      <p className="font-medium text-green-600 dark:text-green-400 mb-2">Security Measures:</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>✅ Encryption in transit (HTTPS/TLS)</li>
        <li>✅ Encryption at rest (Convex database)</li>
        <li>✅ Organisation-scoped access controls</li>
        <li>✅ Rate limiting to prevent abuse</li>
        <li>✅ No PII in system logs</li>
      </ul>

      <p className="font-medium text-amber-600 dark:text-amber-400 mb-2">Prototype Limitations:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>⚠️ No penetration testing yet</li>
        <li>⚠️ No formal security audit</li>
        <li>⚠️ No SOC 2 or ISO 27001 certification</li>
      </ul>

      <p className="mt-3 font-medium text-red-600 dark:text-red-400">
        Recommendation: Do NOT input highly sensitive, confidential, or personal information.
      </p>

      <h4 className="font-semibold mt-6 mb-3">6. Your Rights (UK GDPR)</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Right to Access:</strong> Request a copy of your data</li>
        <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
        <li><strong>Right to Restrict Processing:</strong> Pause processing temporarily</li>
        <li><strong>Right to Data Portability:</strong> Export your data (JSON format)</li>
        <li><strong>Right to Object:</strong> Object to processing based on legitimate interest</li>
        <li><strong>Right to Complain:</strong> Lodge complaint with ICO (UK) or local authority</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">7. Data Retention</h4>
      <p>
        During the prototype phase:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Session data retained indefinitely for testing</li>
        <li>You can request deletion at any time</li>
        <li>Backups may retain data for up to 90 days</li>
        <li>Upon prototype conclusion, data will be deleted or anonymised</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">8. International Data Transfers</h4>
      <p>
        Your data may be processed in:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>United Kingdom:</strong> Convex deployment (if UK-based)</li>
        <li><strong>European Union:</strong> Convex deployment (if EU-based)</li>
        <li><strong>United States:</strong> Anthropic AI processing</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">9. AI-Specific Privacy</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Your reflections are processed by Claude AI (Anthropic)</li>
        <li>Anthropic does NOT train models on your data</li>
        <li>Anthropic retains data for 30 days for abuse monitoring, then deletes</li>
        <li>AI-generated content may contain inaccuracies - review carefully</li>
        <li>Safety incidents may be reviewed by development team</li>
      </ul>

      <h4 className="font-semibold mt-6 mb-3">10. Contact & Data Requests</h4>
      <p>
        To exercise your rights or ask questions:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Email: [Your contact email]</li>
        <li>Response time: Within 30 days</li>
        <li>UK Regulator: Information Commissioner's Office (ico.org.uk)</li>
      </ul>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-8">
        <p className="text-sm font-medium">
          <strong>Full Policy:</strong> For complete Privacy Policy, see PRIVACY_POLICY.md in the project repository.
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Last Updated: October 14, 2025 • Version 1.0 (Development Prototype)
        </p>
      </div>
    </div>
  );
}
