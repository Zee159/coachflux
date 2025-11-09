import React, { useState } from 'react';
import { Check, BookOpen, Users, Briefcase, Target, ArrowRight } from 'lucide-react';

interface LearningAction {
  id: string;
  action: string;
  timeline: string;
  resource: string;
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

interface GapCard {
  gap_id: string;
  gap_name: string;
  gap_index: number;
  total_gaps: number;
  learning_actions: LearningAction[];
  networking_actions: NetworkingAction[];
  experience_actions: ExperienceAction[];
  milestone: string;
}

interface GapRoadmapCardProps {
  gapCard: GapCard;
  onComplete: (selections: {
    gap_id: string;
    selected_learning_ids: string[];
    selected_networking_ids: string[];
    selected_experience_ids: string[];
    milestone: string;
  }) => void;
  initialSelections?: {
    selected_learning_ids?: string[];
    selected_networking_ids?: string[];
    selected_experience_ids?: string[];
    milestone?: string;
  };
  isEditing?: boolean;
}

export const GapRoadmapCard: React.FC<GapRoadmapCardProps> = ({
  gapCard,
  onComplete,
  initialSelections,
  isEditing = false
}) => {
  const [selectedLearning, setSelectedLearning] = useState<string[]>(
    initialSelections?.selected_learning_ids ?? []
  );
  const [selectedNetworking, setSelectedNetworking] = useState<string[]>(
    initialSelections?.selected_networking_ids ?? []
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>(
    initialSelections?.selected_experience_ids ?? []
  );
  const [milestone, setMilestone] = useState(
    initialSelections?.milestone ?? gapCard.milestone
  );

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

  const handleComplete = (): void => {
    if (selectedLearning.length === 0 || selectedExperience.length === 0) {
      return;
    }

    onComplete({
      gap_id: gapCard.gap_id,
      selected_learning_ids: selectedLearning,
      selected_networking_ids: selectedNetworking,
      selected_experience_ids: selectedExperience,
      milestone
    });
  };

  const canComplete = selectedLearning.length > 0 && selectedExperience.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      {/* Progress Header */}
      <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              Gap {gapCard.gap_index + 1} of {gapCard.total_gaps}: {gapCard.gap_name}
            </h2>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
              Select actions to address this gap
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {gapCard.gap_index + 1}/{gapCard.total_gaps}
            </div>
          </div>
        </div>
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

        <div className="p-4 space-y-2">
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
            Optional: Select networking opportunities
          </p>
        </div>

        <div className="p-4 space-y-2">
          {gapCard.networking_actions.map(action => (
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
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ⏱️ {action.timeline}
                  </div>
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
              Experience Actions
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select at least 1 hands-on experience
          </p>
        </div>

        <div className="p-4 space-y-2">
          {gapCard.experience_actions.map(action => (
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
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ⏱️ {action.timeline}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Milestone */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Milestone for this Gap
            </h3>
          </div>
        </div>

        <div className="p-4">
          <textarea
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={3}
            placeholder="What will success look like for this gap?"
          />
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className={`
            px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all
            ${canComplete
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isEditing ? (
            <>
              Update Gap <Check className="w-5 h-5" />
            </>
          ) : gapCard.gap_index < gapCard.total_gaps - 1 ? (
            <>
              Next Gap <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Complete Roadmap <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {!canComplete && (
        <p className="text-sm text-red-600 dark:text-red-400 text-right mt-2">
          Please select at least 1 learning action and 1 experience action
        </p>
      )}
    </div>
  );
};
