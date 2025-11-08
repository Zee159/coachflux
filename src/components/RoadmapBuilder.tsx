import React, { useState } from 'react';
import { Check, BookOpen, Users, Briefcase, Target, Edit2 } from 'lucide-react';

interface LearningAction {
  id: string;
  action: string;
  timeline: string;
  resource: string;
}

interface GapCard {
  gap_id: string;
  gap_name: string;
  learning_actions: LearningAction[];
}

interface NetworkingAction {
  id: string;
  action: string;
  timeline: string;
}

interface ExperienceAction {
  id: string;
  action: string;
  timeline: string;
}

interface RoadmapData {
  gap_cards?: GapCard[];
  learning_actions?: Array<LearningAction & { gap_id: string; gap_name: string }>; // Backward compatibility
  networking_actions: NetworkingAction[];
  experience_actions: ExperienceAction[];
  milestone_3_months: string;
  milestone_6_months: string;
}

interface RoadmapBuilderProps {
  roadmapData: RoadmapData;
  onFinalize: (selections: {
    selected_learning_ids: string[];
    selected_networking_ids: string[];
    selected_experience_ids: string[];
    milestone_3_months: string;
    milestone_6_months: string;
  }) => void;
}

export const RoadmapBuilder: React.FC<RoadmapBuilderProps> = ({
  roadmapData,
  onFinalize
}) => {
  const [selectedLearning, setSelectedLearning] = useState<string[]>([]);
  const [selectedNetworking, setSelectedNetworking] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [milestone3, setMilestone3] = useState(roadmapData.milestone_3_months);
  const [milestone6, setMilestone6] = useState(roadmapData.milestone_6_months);
  const [editingMilestone, setEditingMilestone] = useState<'3' | '6' | null>(null);

  // Use gap_cards if available, otherwise fall back to learning_actions
  const gapCards: GapCard[] = roadmapData.gap_cards ?? 
    (roadmapData.learning_actions ?? []).reduce((acc, action) => {
      const existing = acc.find(card => card.gap_name === action.gap_name);
      if (existing !== undefined) {
        existing.learning_actions.push({
          id: action.id,
          action: action.action,
          timeline: action.timeline,
          resource: action.resource
        });
      } else {
        acc.push({
          gap_id: action.gap_id,
          gap_name: action.gap_name,
          learning_actions: [{
            id: action.id,
            action: action.action,
            timeline: action.timeline,
            resource: action.resource
          }]
        });
      }
      return acc;
    }, [] as GapCard[]);

  const toggleLearning = (id: string): void => {
    setSelectedLearning(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleNetworking = (id: string): void => {
    setSelectedNetworking(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleExperience = (id: string): void => {
    setSelectedExperience(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinalize = (): void => {
    if (selectedLearning.length === 0 || selectedExperience.length === 0) {
      return;
    }

    onFinalize({
      selected_learning_ids: selectedLearning,
      selected_networking_ids: selectedNetworking,
      selected_experience_ids: selectedExperience,
      milestone_3_months: milestone3,
      milestone_6_months: milestone6
    });
  };

  const canFinalize = selectedLearning.length > 0 && selectedExperience.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      {/* Header */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          📋 Your Career Transition Roadmap
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Review and select the actions that resonate with you. You can edit milestones and add your own actions.
        </p>
      </div>

      {/* Learning Actions */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Learning Actions
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select at least 1 learning action
          </p>
        </div>

        <div className="p-4 space-y-4">
          {gapCards.map((gapCard) => (
            <div key={gapCard.gap_id} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Gap: {gapCard.gap_name}
              </h4>
              <div className="space-y-2">
                {gapCard.learning_actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => toggleLearning(action.id)}
                    className={`
                      w-full text-left p-3 rounded-lg border-2 transition-all
                      ${selectedLearning.includes(action.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                        ${selectedLearning.includes(action.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                        }
                      `}>
                        {selectedLearning.includes(action.id) && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {action.action}
                        </p>
                        <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>⏱️ {action.timeline}</span>
                          <span>📚 {action.resource}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Networking Actions */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Networking Actions
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Optional - Select networking opportunities
          </p>
        </div>

        <div className="p-4 space-y-2">
          {roadmapData.networking_actions.map(action => (
            <button
              key={action.id}
              onClick={() => toggleNetworking(action.id)}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${selectedNetworking.includes(action.id)
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                  ${selectedNetworking.includes(action.id)
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {selectedNetworking.includes(action.id) && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {action.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ⏱️ {action.timeline}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Experience Actions */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Hands-On Experience
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select at least 1 experience action
          </p>
        </div>

        <div className="p-4 space-y-2">
          {roadmapData.experience_actions.map(action => (
            <button
              key={action.id}
              onClick={() => toggleExperience(action.id)}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${selectedExperience.includes(action.id)
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                  ${selectedExperience.includes(action.id)
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {selectedExperience.includes(action.id) && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {action.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ⏱️ {action.timeline}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-orange-50 dark:bg-orange-900/30 border-b border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Milestones
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Click to edit milestones
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* 3-Month Milestone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              3-Month Milestone
            </label>
            {editingMilestone === '3' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={milestone3}
                  onChange={(e) => setMilestone3(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <button
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingMilestone('3')}
                className="w-full text-left p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900 group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-gray-100">{milestone3}</p>
                  <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </div>
              </button>
            )}
          </div>

          {/* 6-Month Milestone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              6-Month Milestone
            </label>
            {editingMilestone === '6' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={milestone6}
                  onChange={(e) => setMilestone6(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <button
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingMilestone('6')}
                className="w-full text-left p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900 group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-gray-100">{milestone6}</p>
                  <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {!canFinalize ? (
            <span className="text-orange-600 dark:text-orange-400">
              ⚠️ Select at least 1 learning and 1 experience action
            </span>
          ) : (
            <span className="font-medium text-green-600 dark:text-green-400">
              ✓ {selectedLearning.length} learning, {selectedNetworking.length} networking, {selectedExperience.length} experience
            </span>
          )}
        </div>

        <button
          onClick={handleFinalize}
          disabled={!canFinalize}
          className={`
            px-6 py-3 rounded-lg font-medium text-base transition-all duration-200
            ${canFinalize
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Finalize Roadmap
        </button>
      </div>
    </div>
  );
};
