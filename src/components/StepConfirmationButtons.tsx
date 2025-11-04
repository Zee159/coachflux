import React from 'react';
import { ArrowRight, Edit3 } from 'lucide-react';

interface StepConfirmationButtonsProps {
  stepName: string;
  nextStepName: string;
  onProceed: () => void;
  onAmend: () => void;
  isLoading?: boolean;
}

export const StepConfirmationButtons: React.FC<StepConfirmationButtonsProps> = ({
  stepName,
  nextStepName,
  onProceed,
  onAmend,
  isLoading = false
}) => {
  const [clicked, setClicked] = React.useState<'proceed' | 'amend' | null>(null);

  const handleProceed = (): void => {
    setClicked('proceed');
    setTimeout(() => setClicked(null), 300);
    onProceed();
  };

  const handleAmend = (): void => {
    setClicked('amend');
    setTimeout(() => setClicked(null), 300);
    onAmend();
  };

  const stepLabel = stepName.charAt(0).toUpperCase() + stepName.slice(1);
  const nextLabel = nextStepName.charAt(0).toUpperCase() + nextStepName.slice(1);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-750 rounded-lg border border-indigo-200 dark:border-gray-700">
      {/* Question */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
          ✅ {stepLabel} Complete
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ready to move to {nextLabel}, or would you like to review and amend your responses?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={isLoading}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-3 
            bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
            disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700
            text-white rounded-lg font-medium text-sm transition-all duration-200 
            shadow-md hover:shadow-lg disabled:cursor-not-allowed
            ${!isLoading ? 'active:scale-95' : ''}
            ${clicked === 'proceed' ? 'ring-2 ring-indigo-300 ring-offset-2' : ''}
          `}
          aria-label={`Proceed to ${nextLabel}`}
        >
          <span>Proceed to {nextLabel}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Amend Button */}
        <button
          onClick={handleAmend}
          disabled={isLoading}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-3 
            bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 
            disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-300 
            rounded-lg font-medium text-sm transition-all duration-200 
            shadow-md hover:shadow-lg border-2 border-gray-300 dark:border-gray-600 
            hover:border-indigo-400 dark:hover:border-indigo-500 disabled:cursor-not-allowed
            ${!isLoading ? 'active:scale-95' : ''}
            ${clicked === 'amend' ? 'ring-2 ring-gray-300 ring-offset-2' : ''}
          `}
          aria-label="Amend responses"
        >
          <Edit3 className="w-4 h-4" strokeWidth={2.5} />
          <span>Amend Response</span>
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 You can review and modify your answers before moving forward
        </p>
      </div>
    </div>
  );
};
