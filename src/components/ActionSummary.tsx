import React from 'react';
import { CheckCircle2, Plus, ArrowRight } from 'lucide-react';

interface Action {
  option: string;
  action: string;
  due_days: number;
}

interface ActionSummaryProps {
  actions: Action[];
  onContinue: () => void;
  onAddMore: () => void;
}

export const ActionSummary: React.FC<ActionSummaryProps> = ({
  actions,
  onContinue,
  onAddMore
}) => {
  const formatTimeline = (days: number): string => {
    if (days === 1) {
      return 'Tomorrow';
    }
    if (days <= 7) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (days <= 14) {
      return `${Math.round(days / 7)} week${days > 7 ? 's' : ''}`;
    }
    if (days <= 60) {
      return `${Math.round(days / 7)} weeks`;
    }
    return `${Math.round(days / 30)} month${days > 30 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Success Message */}
      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-green-800 dark:text-green-200 font-medium">
            Great! You've created {actions.length} action{actions.length > 1 ? 's' : ''} for your goal.
          </p>
        </div>
      </div>

      {/* Action Plan Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your Action Plan
            </h3>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-4 space-y-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Checkmark */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {action.action}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Timeline:</span>
                    <span>{formatTimeline(action.due_days)}</span>
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    {action.option}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Continue Button (Primary) */}
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-base transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Continue to review"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Continue to review</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Add More Button (Secondary) */}
            <button
              onClick={onAddMore}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-base transition-all duration-200 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
              aria-label="Add another action"
            >
              <Plus className="w-5 h-5" />
              <span>Add another action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Your actions are ordered by timeline. You can add more actions or continue to review your plan.
        </p>
      </div>
    </div>
  );
};
