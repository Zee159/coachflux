import React from 'react';
import { Check, BookOpen, Users, Briefcase, Target, Edit2 } from 'lucide-react';

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

interface GapSelections {
  selected_learning_ids: string[];
  selected_networking_ids: string[];
  selected_experience_ids: string[];
  milestone: string;
}

interface CompletedGapCardProps {
  gapCard: GapCard;
  selections: GapSelections;
  onEdit: () => void;
}

export const CompletedGapCard: React.FC<CompletedGapCardProps> = ({
  gapCard,
  selections,
  onEdit
}) => {
  const selectedLearning = gapCard.learning_actions.filter(a => 
    selections.selected_learning_ids.includes(a.id)
  );
  const selectedNetworking = gapCard.networking_actions.filter(a => 
    selections.selected_networking_ids.includes(a.id)
  );
  const selectedExperience = gapCard.experience_actions.filter(a => 
    selections.selected_experience_ids.includes(a.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto my-4 opacity-90">
      {/* Header with Edit Button */}
      <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                Gap {gapCard.gap_index + 1}: {gapCard.gap_name}
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300">
                Completed
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Selections Summary */}
      <div className="space-y-3">
        {/* Learning Actions */}
        {selectedLearning.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Learning Actions ({selectedLearning.length})
                </h4>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {selectedLearning.map(action => (
                <div key={action.id} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{action.action}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ⏱️ {action.timeline} • 📚 {action.resource}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Networking Actions */}
        {selectedNetworking.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Networking Actions ({selectedNetworking.length})
                </h4>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {selectedNetworking.map(action => (
                <div key={action.id} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{action.action}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">⏱️ {action.timeline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Actions */}
        {selectedExperience.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Experience Actions ({selectedExperience.length})
                </h4>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {selectedExperience.map(action => (
                <div key={action.id} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{action.action}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">⏱️ {action.timeline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Milestone
              </h4>
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm text-gray-900 dark:text-gray-100">{selections.milestone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
