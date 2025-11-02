import React from 'react';
import { Check } from 'lucide-react';

type MindsetValue = 'resistant' | 'neutral' | 'open' | 'engaged';

interface MindsetOption {
  value: MindsetValue;
  emoji: string;
  label: string;
  color: string;
  hoverColor: string;
  selectedColor: string;
}

interface MindsetSelectorProps {
  question: string;
  value?: MindsetValue;
  onSelect: (value: MindsetValue) => void;
  isLoading?: boolean;
}

const MINDSET_OPTIONS: MindsetOption[] = [
  {
    value: 'resistant',
    emoji: '😤',
    label: 'Resistant/Skeptical',
    color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600',
    selectedColor: 'bg-red-500 text-white border-red-600'
  },
  {
    value: 'neutral',
    emoji: '😐',
    label: 'Neutral/Cautious',
    color: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-750 hover:border-gray-400 dark:hover:border-gray-500',
    selectedColor: 'bg-gray-500 text-white border-gray-600'
  },
  {
    value: 'open',
    emoji: '🤔',
    label: 'Open/Curious',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600',
    selectedColor: 'bg-blue-500 text-white border-blue-600'
  },
  {
    value: 'engaged',
    emoji: '🚀',
    label: 'Engaged/Committed',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600',
    selectedColor: 'bg-green-500 text-white border-green-600'
  }
];

export const MindsetSelector: React.FC<MindsetSelectorProps> = ({
  question,
  value,
  onSelect,
  isLoading = false
}) => {
  const [clickedValue, setClickedValue] = React.useState<MindsetValue | null>(null);

  const handleClick = (optionValue: MindsetValue): void => {
    if (!isLoading) {
      setClickedValue(optionValue);
      // Clear the clicked state after animation
      setTimeout(() => setClickedValue(null), 300);
      onSelect(optionValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, optionValue: MindsetValue): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isLoading) {
        handleClick(optionValue);
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

      {/* Mindset Options - Single Row */}
      <div className="flex gap-1.5">
        {MINDSET_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const isClicked = clickedValue === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleClick(option.value)}
              onKeyPress={(e) => handleKeyPress(e, option.value)}
              disabled={isLoading}
              className={`
                flex-1 relative px-2 py-2 rounded-md font-medium text-xs 
                transition-all duration-150 border
                ${isSelected ? option.selectedColor : `${option.color} ${option.hoverColor}`}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                ${isSelected ? 'scale-105' : ''}
                ${isClicked ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
              aria-label={`Select ${option.label}`}
              aria-pressed={isSelected ? 'true' : 'false'}
              tabIndex={0}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl" role="img" aria-label={option.label}>
                  {option.emoji}
                </span>
                <span className="text-[9px] leading-tight text-center">
                  {option.label}
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
    </div>
  );
};
