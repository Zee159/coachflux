import React from 'react';
import { Check } from 'lucide-react';

interface UnderstandingScaleSelectorProps {
  question: string;
  value?: number;
  onSelect: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  isLoading?: boolean;
}

const EMOJI_SCALE = [
  { value: 1, emoji: '😕', label: 'Very confused' },
  { value: 2, emoji: '😐', label: 'Somewhat unclear' },
  { value: 3, emoji: '🙂', label: 'Getting it' },
  { value: 4, emoji: '😊', label: 'Pretty clear' },
  { value: 5, emoji: '🎯', label: 'Crystal clear' }
];

export const UnderstandingScaleSelector: React.FC<UnderstandingScaleSelectorProps> = ({
  question,
  value,
  onSelect,
  minLabel = 'Very confused',
  maxLabel = 'Crystal clear',
  isLoading = false
}) => {
  const [clickedValue, setClickedValue] = React.useState<number | null>(null);

  const handleClick = (buttonValue: number): void => {
    if (!isLoading) {
      setClickedValue(buttonValue);
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

  const getColorClass = (num: number, isSelected: boolean): string => {
    if (isSelected) {
      if (num <= 2) {
        return 'bg-red-500 text-white border-red-600';
      }
      if (num <= 3) {
        return 'bg-yellow-500 text-white border-yellow-600';
      }
      return 'bg-green-500 text-white border-green-600';
    }
    
    if (num <= 2) {
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30';
    }
    if (num <= 3) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
    }
    return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30';
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2">
      {/* Question */}
      <div className="mb-2 px-1">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {question}
        </p>
      </div>

      {/* Emoji Scale Buttons */}
      <div className="flex gap-1.5">
        {EMOJI_SCALE.map((item) => {
          const isSelected = value === item.value;
          const isClicked = clickedValue === item.value;
          
          return (
            <button
              key={item.value}
              onClick={() => handleClick(item.value)}
              onKeyPress={(e) => handleKeyPress(e, item.value)}
              disabled={isLoading}
              className={`
                flex-1 relative px-2 py-2 rounded-md font-medium text-xs
                transition-all duration-150 border
                ${getColorClass(item.value, isSelected)}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                ${isSelected ? 'scale-105' : ''}
                ${isClicked ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
              aria-label={`Select ${item.label}`}
              aria-pressed={isSelected ? 'true' : 'false'}
              tabIndex={0}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl" role="img" aria-label={item.label}>
                  {item.emoji}
                </span>
                <span className="text-[9px] leading-tight text-center">
                  {item.value}
                </span>
              </div>
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
