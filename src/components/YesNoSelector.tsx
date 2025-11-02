import React from 'react';
import { Check, X } from 'lucide-react';

interface YesNoSelectorProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
  isLoading?: boolean;
}

export const YesNoSelector: React.FC<YesNoSelectorProps> = ({
  question,
  onYes,
  onNo,
  yesLabel = 'Yes, let\'s begin',
  noLabel = 'No, close session',
  isLoading = false
}) => {
  const [clicked, setClicked] = React.useState<'yes' | 'no' | null>(null);

  const handleYes = (): void => {
    setClicked('yes');
    setTimeout(() => setClicked(null), 300);
    onYes();
  };

  const handleNo = (): void => {
    setClicked('no');
    setTimeout(() => setClicked(null), 300);
    onNo();
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-3">
      {/* Question */}
      <div className="mb-2 px-1">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {question}
        </p>
      </div>

      {/* Yes/No Pills */}
      <div className="flex gap-2">
        {/* Yes Button */}
        <button
          onClick={handleYes}
          disabled={isLoading}
          className={`
            flex-1 flex items-center justify-center gap-1.5 px-4 py-2 
            bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 
            text-white rounded-lg font-medium text-sm transition-all duration-200 
            shadow-sm hover:shadow-md disabled:cursor-not-allowed
            ${!isLoading ? 'active:scale-95' : ''}
            ${clicked === 'yes' ? 'ring-2 ring-green-300 ring-offset-1' : ''}
          `}
          aria-label={yesLabel}
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          <span>{yesLabel}</span>
        </button>

        {/* No Button */}
        <button
          onClick={handleNo}
          disabled={isLoading}
          className={`
            flex-1 flex items-center justify-center gap-1.5 px-4 py-2 
            bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 
            disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-300 
            rounded-lg font-medium text-sm transition-all duration-200 
            shadow-sm hover:shadow-md border border-gray-300 dark:border-gray-600 
            hover:border-gray-400 dark:hover:border-gray-500 disabled:cursor-not-allowed
            ${!isLoading ? 'active:scale-95' : ''}
            ${clicked === 'no' ? 'ring-2 ring-gray-300 ring-offset-1' : ''}
          `}
          aria-label={noLabel}
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          <span>{noLabel}</span>
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-2 px-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Choose "Yes" to start your coaching session, or "No" to return to the dashboard
        </p>
      </div>
    </div>
  );
};
