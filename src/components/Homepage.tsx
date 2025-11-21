import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Framework {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  bestFor: string[];
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isAvailable: boolean;
  comingSoon: boolean;
}

const frameworks: Framework[] = [
  {
    id: "GROW",
    name: "GROW",
    emoji: "🎯",
    tagline: "Goal-focused action planning",
    description: "Set and achieve specific goals through structured reflection and action planning.",
    bestFor: [
      "Setting career goals",
      "Personal development",
      "Skill building",
      "Performance improvement"
    ],
    estimatedTime: "15-25 minutes",
    difficulty: "Beginner",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "COMPASS",
    name: "COMPASS",
    emoji: "🧭",
    tagline: "Navigate change with confidence",
    description: "Four-step framework for navigating change: Clarity (understand the change), Ownership (build commitment), Mapping (identify actions), and Practice (lock in progress).",
    bestFor: [
      "Navigating workplace change",
      "Building confidence in uncertain situations",
      "Committing to meaningful action",
      "Personal transformation challenges"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Intermediate",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "CAREER",
    name: "CAREER",
    emoji: "🚀",
    tagline: "Career advancement planning",
    description: "Strategic career development through gap analysis and roadmap creation.",
    bestFor: [
      "Career transitions",
      "Skill gap analysis",
      "Promotion planning",
      "Professional development"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Intermediate",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "PRODUCTIVITY",
    name: "PRODUCTIVITY",
    emoji: "⚡",
    tagline: "Focus & time management",
    description: "Build sustainable productivity systems through focus optimization and time management.",
    bestFor: [
      "Time management",
      "Deep work optimization",
      "Distraction management",
      "Productivity systems"
    ],
    estimatedTime: "15 minutes",
    difficulty: "Beginner",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "LEADERSHIP",
    name: "LEADERSHIP",
    emoji: "👥",
    tagline: "Leadership development",
    description: "Develop leadership capabilities through self-awareness, team building, and strategic influence.",
    bestFor: [
      "Leadership skills",
      "Team management",
      "Stakeholder influence",
      "Executive presence"
    ],
    estimatedTime: "15 minutes",
    difficulty: "Intermediate",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "COMMUNICATION",
    name: "COMMUNICATION",
    emoji: "💬",
    tagline: "Difficult conversations",
    description: "Navigate difficult conversations and deliver effective feedback with confidence.",
    bestFor: [
      "Difficult conversations",
      "Feedback delivery",
      "Conflict resolution",
      "Crucial conversations"
    ],
    estimatedTime: "15 minutes",
    difficulty: "Intermediate",
    isAvailable: true,
    comingSoon: false
  },
  {
    id: "CLEAR",
    name: "CLEAR",
    emoji: "✨",
    tagline: "Structured clarity building",
    description: "Gain clarity on complex situations through systematic exploration.",
    bestFor: [
      "Understanding complex situations",
      "Breaking down challenges",
      "Identifying root causes",
      "Building mental models"
    ],
    estimatedTime: "20-30 minutes",
    difficulty: "Intermediate",
    isAvailable: false,
    comingSoon: true
  },
  {
    id: "POWER_INTEREST",
    name: "Power-Interest Grid",
    emoji: "🔲",
    tagline: "Stakeholder mapping",
    description: "Map and manage stakeholder relationships for better influence and communication.",
    bestFor: [
      "Stakeholder analysis",
      "Political navigation",
      "Influence strategy",
      "Communication planning"
    ],
    estimatedTime: "15-20 minutes",
    difficulty: "Intermediate",
    isAvailable: false,
    comingSoon: true
  },
  {
    id: "PSYCHOLOGICAL_SAFETY",
    name: "Psychological Safety",
    emoji: "🛡️",
    tagline: "Build trust and openness",
    description: "Assess and improve psychological safety within your team or organization.",
    bestFor: [
      "Team culture",
      "Building trust",
      "Improving communication",
      "Reducing fear of failure"
    ],
    estimatedTime: "20-30 minutes",
    difficulty: "Advanced",
    isAvailable: false,
    comingSoon: true
  },
  {
    id: "EXECUTIVE_PRESENCE",
    name: "Executive Presence",
    emoji: "👔",
    tagline: "Lead with confidence",
    description: "Develop your leadership presence and communication impact.",
    bestFor: [
      "Leadership development",
      "Communication skills",
      "Confidence building",
      "Professional presence"
    ],
    estimatedTime: "25-35 minutes",
    difficulty: "Advanced",
    isAvailable: false,
    comingSoon: true
  }
];

export function Homepage() {
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const handleFrameworkClick = (framework: Framework): void => {
    if (!framework.isAvailable) {
      return; // Do nothing for coming soon frameworks
    }
    
    setSelectedFramework(framework.id);
    // Navigate to setup with selected framework
    navigate(`/setup?framework=${framework.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                CoachFlux
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                AI-powered coaching frameworks for personal and professional growth
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Coaching Framework
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Select a framework that matches your needs. Each provides structured guidance
            to help you think through challenges and create actionable plans.
          </p>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {frameworks.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              onClick={() => handleFrameworkClick(framework)}
              isSelected={selectedFramework === framework.id}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            🔒 Your conversations are private and secure
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            All sessions are confidential and stored securely
          </p>
        </div>
      </main>
    </div>
  );
}

interface FrameworkCardProps {
  framework: Framework;
  onClick: () => void;
  isSelected: boolean;
}

function FrameworkCard({ framework, onClick, isSelected }: FrameworkCardProps) {
  const isDisabled = !framework.isAvailable;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative text-left p-6 rounded-xl border-2 transition-all duration-200
        ${isDisabled 
          ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg cursor-pointer'
        }
        ${isSelected && !isDisabled ? 'border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-500/20' : ''}
      `}
    >
      {/* Coming Soon Badge */}
      {framework.comingSoon && (
        <div className="absolute top-4 right-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}

      {/* Framework Icon & Name */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{framework.emoji}</span>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {framework.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {framework.tagline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm leading-relaxed">
        {framework.description}
      </p>

      {/* Best For */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Best for:
        </p>
        <ul className="space-y-1">
          {framework.bestFor.slice(0, 3).map((use, index) => (
            <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <span>⏱️</span>
          <span>{framework.estimatedTime}</span>
        </div>
        <div className={`
          text-xs font-semibold px-2 py-1 rounded
          ${framework.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
          ${framework.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
          ${framework.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
        `}>
          {framework.difficulty}
        </div>
      </div>

      {/* CTA */}
      {!isDisabled && (
        <div className="mt-4">
          <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-2">
            Start Session
            <span>→</span>
          </div>
        </div>
      )}
    </button>
  );
}
