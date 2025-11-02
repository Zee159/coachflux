import React from 'react';
import { Check } from 'lucide-react';

type ColorScheme = 'confidence' | 'clarity' | 'satisfaction';

interface ConfidenceScaleSelectorProps {
  question: string;
  value?: number;
  onSelect: (value: number) => void;
  colorScheme?: ColorScheme;
  minLabel?: string;
  maxLabel?: string;
  isLoading?: boolean;
}

const getColorClass = (value: number, scheme: ColorScheme, isSelected: boolean): string => {
  if (scheme === 'confidence') {
    // Red (1-3) → Yellow (4-6) → Green (7-10)
    if (value <= 3) {
      return isSelected
        ? 'bg-red-500 text-white border-red-600'
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600';
    }
    if (value <= 6) {
      return isSelected
        ? 'bg-yellow-500 text-white border-yellow-600'
        : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-400 dark:hover:border-yellow-600';
    }
    return isSelected
      ? 'bg-green-500 text-white border-green-600'
      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600';
  }

  if (scheme === 'clarity') {
    // Gray (1-3) → Blue (4-6) → Purple (7-10)
    if (value <= 3) {
      return isSelected
        ? 'bg-gray-500 text-white border-gray-600'
        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-750 hover:border-gray-400 dark:hover:border-gray-500';
    }
    if (value <= 6) {
      return isSelected
        ? 'bg-blue-500 text-white border-blue-600'
        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600';
    }
    return isSelected
      ? 'bg-purple-500 text-white border-purple-600'
      : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-600';
  }

  // satisfaction: Red (1-3) → Yellow (4-6) → Green (7-10)
  if (value <= 3) {
    return isSelected
      ? 'bg-red-500 text-white border-red-600'
      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600';
  }
  if (value <= 6) {
    return isSelected
      ? 'bg-yellow-500 text-white border-yellow-600'
      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-400 dark:hover:border-yellow-600';
  }
  return isSelected
    ? 'bg-green-500 text-white border-green-600'
    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600';
};

export const ConfidenceScaleSelector: React.FC<ConfidenceScaleSelectorProps> = ({
  question,
  value,
  onSelect,
  colorScheme = 'confidence',
  minLabel = 'Not confident',
  maxLabel = 'Very confident',
  isLoading = false
}) => {
  const [clickedValue, setClickedValue] = React.useState<number | null>(null);

  const handleClick = (buttonValue: number): void => {
    if (!isLoading) {
      setClickedValue(buttonValue);
      // Clear the clicked state after animation
      setTimeout(() => setClickedValue(null), 300);
      onSelect(buttonValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, buttonValue: number): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isLoading) {
        handleClick(buttonValue);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2">
      {/* Question */}
      <div className="mb-2 px-1">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {question}
        </p>
      </div>

      {/* Scale Buttons - Single Row */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = value === num;
          const isClicked = clickedValue === num;
          return (
            <button
              key={num}
              onClick={() => handleClick(num)}
              onKeyPress={(e) => handleKeyPress(e, num)}
              disabled={isLoading}
              className={`
                flex-1 relative px-2 py-2 rounded-md font-semibold text-sm 
                transition-all duration-150 border
                ${getColorClass(num, colorScheme, isSelected)}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                ${isSelected ? 'scale-105' : ''}
                ${isClicked ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
              aria-label={`Select ${num} out of 10`}
              aria-pressed={isSelected ? 'true' : 'false'}
              tabIndex={0}
            >
              <span className="block">{num}</span>
              {isSelected && (
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-gray-900 border border-current flex items-center justify-center">
                  <Check className="w-2 h-2" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 px-1">
        <p className="text-[10px] text-gray-500 dark:text-gray-500">
          {minLabel}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-500">
          {maxLabel}
        </p>
      </div>
    </div>
  );
};
