import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { FeedbackWidget } from "./FeedbackWidget";

// Framework type
type FrameworkId = 'GROW' | 'COMPASS' | 'CAREER' | 'PRODUCTIVITY' | 'LEADERSHIP' | 'COMMUNICATION';

export function DemoSetup() {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>('GROW');
  
  const [orgName, setOrgName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coachingAccepted, setCoachingAccepted] = useState(false);
  const [termsPrivacyAccepted, setTermsPrivacyAccepted] = useState(false);
  const navigate = useNavigate();

  // Rotating tagline
  const taglines = [
    "Ready When You Are",
    "Free To Experience",
    "Built For Real Life",
    "Your Support Partner",
    "Don't Hesitate"
  ];
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, [taglines.length]);


  const createOrg = useMutation(api.mutations.createOrg);
  const createUser = useMutation(api.mutations.createUser);
  const acceptLegal = useMutation(api.mutations.acceptLegalTerms);
  const createSession = useMutation(api.mutations.createSession);

  async function handleSetup() {
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

      // Create session with selected framework
      const sessionId = await createSession({
        orgId,
        userId,
        framework: selectedFramework,
      });

      // Navigate directly to the session
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Setup failed:", error);
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              CoachFlux
            </span>
          </button>
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
            <Link 
              to="/community"
              className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors"
            >
              Community
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold & Minimal */}
      <section id="home" className="px-6 py-24 pt-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>6 Frameworks Live</span>
              <span className="text-violet-400 dark:text-violet-500">•</span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              <span>More Coming Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your AI Coach,
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent transition-opacity duration-500">
                {taglines[currentTaglineIndex]}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Choose a structured framework. Get personalised guidance. Move forward.
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">15-35</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minutes/Session</div>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Data Collected</div>
              </div>
            </div>
          </div>

          {/* Framework Cards */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">Choose Your Framework</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Each framework tackles different challenges. Pick the one that speaks to where you are right now.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* GROW Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('GROW');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'GROW' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'GROW' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🎯</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">GROW</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold">Most Popular</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  A structured coaching model that helps you move from where you are now to where you want to be. Explore your <strong>Goal</strong>, assess your current <strong>Reality</strong>, brainstorm <strong>Options</strong>, and commit to action with <strong>Will</strong>.
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"I want to switch careers" • "I need to learn AI skills" • "How do I get promoted?" • "I want better work-life balance"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15-25 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Beginner
                  </span>
                </div>
              </button>

              {/* COMPASS Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('COMPASS');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'COMPASS' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'COMPASS' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🧭</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">COMPASS</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">Navigate change with confidence</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  A practical methodology for turning major changes into opportunities for growth and success. Four-step process: <strong>Clarity</strong> (understand the change), <strong>Ownership</strong> (build commitment), <strong>Mapping</strong> (identify actions), and <strong>Practice</strong> (lock in progress).
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"My job's being automated" • "My team's being restructured" • "I'm starting a new role" • "Everything's changing and I feel stuck"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    20 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Intermediate
                  </span>
                </div>
              </button>

              {/* CAREER Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('CAREER');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'CAREER' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'CAREER' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">💼</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">CAREER</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Career Development</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  A structured framework for career advancement and role transitions. Assess your current position, identify skill gaps, leverage transferable strengths, and create a concrete roadmap with milestones.
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"I want to switch careers" • "How do I get promoted?" • "What skills do I need?" • "I'm ready for the next level"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    25 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Intermediate
                  </span>
                </div>
              </button>

              {/* PRODUCTIVITY Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('PRODUCTIVITY');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'PRODUCTIVITY' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'PRODUCTIVITY' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">⚡</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">PRODUCTIVITY</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Focus & Time Management</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Build sustainable productivity systems through focus optimization and time management. Assess your current state, audit your time, design your system, and implement with accountability.
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"I'm constantly distracted" • "I need better focus" • "Time management is hard" • "I want a productivity system"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Beginner
                  </span>
                </div>
              </button>

              {/* LEADERSHIP Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('LEADERSHIP');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'LEADERSHIP' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'LEADERSHIP' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">👥</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">LEADERSHIP</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">Leadership Development</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Develop leadership capabilities through self-awareness, team building, and strategic influence. Build your leadership style, improve team dynamics, and create development plans.
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"I'm a new manager" • "My team needs help" • "How do I influence stakeholders?" • "I want to grow as a leader"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Intermediate
                  </span>
                </div>
              </button>

              {/* COMMUNICATION Framework */}
              <button
                onClick={() => {
                  setSelectedFramework('COMMUNICATION');
                  setTimeout(() => {
                    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  selectedFramework === 'COMMUNICATION' 
                    ? 'border-violet-500 dark:border-violet-400 shadow-2xl shadow-violet-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                {selectedFramework === 'COMMUNICATION' && (
                  <div className="absolute -top-3 -right-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">💬</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">COMMUNICATION</h3>
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">Difficult Conversations</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Navigate difficult conversations and deliver effective feedback with confidence. Prepare for challenging discussions, craft your script, and commit to action.
                </p>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold mb-1">Perfect if you're thinking:</p>
                  <p>"I need to give tough feedback" • "How do I handle conflict?" • "I'm avoiding a conversation" • "I need to set boundaries"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15 min
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Intermediate
                  </span>
                </div>
              </button>

              {/* Coming Soon Cards */}
              {[
                { name: 'CLEAR', emoji: '✨', tag: 'Clarity' },
                { name: 'Power-Interest', emoji: '🔲', tag: 'Stakeholders' },
                { name: 'Psych Safety', emoji: '🛡️', tag: 'Team Culture' }
              ].map((fw) => (
                <div
                  key={fw.name}
                  className="relative p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
                >
                  <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
                    Coming Soon
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl opacity-50">{fw.emoji}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500">{fw.name}</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{fw.tag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button
              onClick={() => scrollToSection('get-started')}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Your Session
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No credit card • No email • 100% free
            </p>
          </div>
        </div>
      </section>


      {/* Registration Section */}
      <section id="get-started" className="px-6 py-16 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Get Started Form */}
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Start?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Card: Demo Form */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border border-violet-100 dark:border-gray-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Step 1: Your Details</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Quick setup to personalise your coaching experience</p>
                
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
                      Organisation or Context
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., Acme Corp, My Team, Personal"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      What organisation or team are you part of? (For demo purposes)
                    </p>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your responses are private and only used to personalise your coaching
                    </p>
                  </div>

                  {/* Legal Consent */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={coachingAccepted}
                        onChange={(e) => setCoachingAccepted(e.target.checked)}
                        className="mt-1 flex-shrink-0" 
                        id="coaching-consent"
                      />
                      <label htmlFor="coaching-consent" className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">I understand this is coaching, not therapy or medical advice.</span>
                        <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">
                          This platform helps you clarify goals and take action. 
                          For serious matters like harassment, discrimination, or mental health, 
                          please contact appropriate professional services.
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        checked={termsPrivacyAccepted}
                        onChange={(e) => setTermsPrivacyAccepted(e.target.checked)}
                        className="mt-1 flex-shrink-0" 
                        id="terms-privacy-consent"
                      />
                      <label htmlFor="terms-privacy-consent" className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">
                          I accept the{' '}
                          <a 
                            href="/terms" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            Terms & Conditions
                          </a>
                          {' '}and{' '}
                          <a 
                            href="/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => void handleSetup()}
                    disabled={loading || orgName.trim() === '' || displayName.trim() === '' || !coachingAccepted || !termsPrivacyAccepted}
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
                      "Start Your Coaching Session"
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    This session will take approximately 20 minutes. Make sure you have time to think.
                  </p>
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
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Sessions cannot be saved</strong> and resumed later
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Use real scenarios</strong> - reflect on actual experiences, but avoid sensitive personal details
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">AI-powered coaching</strong> using structured frameworks
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Not therapy or medical advice</strong> - for personal development only
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Complete in one session</strong> - takes approximately 20 minutes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions or feedback? I'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-400">Perth, Western Australia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Mobile</p>
                      <a href="tel:0410022968" className="text-violet-600 dark:text-violet-400 hover:underline">
                        0410 022 968
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-xl border border-violet-200 dark:border-violet-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact me for:</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                    <span>Feedback and suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                    <span>Partnership opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                    <span>Technical support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                    <span>General enquiries</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border border-violet-100 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Send a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-400/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/20 transition-all duration-300 font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}
