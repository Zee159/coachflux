import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { LegalModal } from "./LegalModal";

export function DemoSetup() {
  const [orgName, setOrgName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const navigate = useNavigate();

  const createOrg = useMutation(api.mutations.createOrg);
  const createUser = useMutation(api.mutations.createUser);
  const acceptLegal = useMutation(api.mutations.acceptLegalTerms);

  async function handleSetup() {
    // Check if legal terms accepted
    if (!legalAccepted) {
      setShowLegalModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
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

      const userId = await createUser({
        authId: `demo-${Date.now()}`,
        orgId,
        role: "member",
        displayName,
      });

      // Record legal consent
      await acceptLegal({
        userId,
        termsVersion: "1.0",
        privacyVersion: "1.0",
      });

      localStorage.setItem("coachflux_demo_org", orgId);
      localStorage.setItem("coachflux_demo_user", userId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Setup failed:", error);
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLegalAccept() {
    setLegalAccepted(true);
    setShowLegalModal(false);
    // Automatically proceed with setup after accepting
    setTimeout(() => {
      if (orgName !== "" && displayName !== "") {
        void handleSetup();
      }
    }, 100);
  }

  function handleLegalDecline() {
    setShowLegalModal(false);
    setError("You must accept the Terms of Service and Privacy Policy to use CoachFlux.");
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              CoachFlux
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors"
            >
              How It Works
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-fuchsia-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              AI-Powered Leadership Reflection
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              CoachFlux helps leaders reflect on their experiences through guided conversations aligned with your organisation's values.
            </p>
            <button 
              onClick={() => scrollToSection('get-started')}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/20 transition-all duration-300 inline-flex items-center gap-2"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Right: Visual Element */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Conversational AI</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Natural dialogue about leadership challenges</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Values-Aligned</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Links reflections to your core values</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl">
                <div className="w-10 h-10 bg-fuchsia-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Track Progress</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monitor growth over time with metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="min-h-screen flex items-center justify-center px-6 py-20 bg-white dark:bg-gray-800 relative">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A simple three-step process to develop your leadership through structured reflection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Start a Session</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Begin a conversation with the AI coach about a recent leadership experience or challenge you faced.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reflect Together</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Answer thoughtful questions that connect your actions to your organisation's values and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Review Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get a structured report with key learnings, patterns, and areas for growth based on your reflections.
              </p>
            </div>
          </div>

          {/* Get Started Form */}
          <div id="get-started" className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Card: Demo Form */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border border-violet-100 dark:border-gray-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Try the Prototype</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Create a sample organisation and start exploring</p>
                
                <div className="space-y-4">
                  {error !== null && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Organisation Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Acme Corp, Tech Startup, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Your first name or nickname"
                    />
                  </div>

                  <button
                    onClick={() => void handleSetup()}
                    disabled={loading || orgName.trim() === '' || displayName.trim() === ''}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting up...
                      </>
                    ) : (
                      "Try AI Coach"
                    )}
                  </button>
                </div>
              </div>

              {/* Right Card: Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
                <div className="flex items-start gap-3 mb-6">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Important Information</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      This is a prototype demonstration. Please note:
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Sessions cannot be saved</strong> and resumed later
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Use real scenarios</strong> - reflect on actual leadership experiences, but avoid sensitive personal details
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">AI-powered coaching</strong> using the GROW framework
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Not therapy or medical advice</strong> - for professional development only
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Complete in one session</strong> - takes approximately 10-15 minutes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              When to Use CoachFlux
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're navigating a career challenge or building better habits, the GROW framework helps you think clearly and act decisively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Scenario 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Preparing for a Difficult Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Work through giving feedback, addressing conflict, or making a tough request to your manager or colleague.
              </p>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Making a Career Decision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Evaluate a new role, choose between projects, or decide which skills to invest in for your growth.
              </p>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Navigating Team Dynamics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Address collaboration challenges, repair working relationships, or improve how you work with others.
              </p>
            </div>

            {/* Scenario 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Bouncing Back from a Setback
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Reflect on a project that didn't go as planned, a missed goal, or a mistake to extract learning and move forward.
              </p>
            </div>

            {/* Scenario 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Building a New Skill
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create a learning strategy, identify resources, and build accountability for developing technical or soft skills.
              </p>
            </div>

            {/* Scenario 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Managing Competing Priorities
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Decide what to focus on when everything feels urgent, balance work and personal commitments, or set boundaries.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              <span className="font-semibold text-gray-900 dark:text-white">And many more...</span> The GROW framework adapts to any challenge where you need clarity and action.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegalModal}
        onAccept={handleLegalAccept}
        onDecline={handleLegalDecline}
      />
    </div>
  );
}
