import React from 'react';

interface ReviewConfidenceSelectorProps {
  question: string;
  onSelect: (value: number) => void;
  isLoading?: boolean;
}

const CONFIDENCE_OPTIONS = [
  { value: 1, emoji: '1️⃣', label: 'Not confident', description: 'Need more support' },
  { value: 2, emoji: '2️⃣', label: 'Slightly confident', description: 'Lots of uncertainty' },
  { value: 3, emoji: '3️⃣', label: 'Moderately confident', description: 'Some concerns' },
  { value: 4, emoji: '4️⃣', label: 'Quite confident', description: 'Ready to try' },
  { value: 5, emoji: '5️⃣', label: 'Very confident', description: 'Excited to start' }
];

const getColorClass = (value: number): string => {
  // Red (1-2) → Yellow (3) → Green (4-5)
  if (value <= 2) {
    return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600';
  }
  if (value === 3) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-400 dark:hover:border-yellow-600';
  }
  return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600';
};

export const ReviewConfidenceSelector: React.FC<ReviewConfidenceSelectorProps> = ({
  question,
  onSelect,
  isLoading = false
}) => {
  const [clickedValue, setClickedValue] = React.useState<number | null>(null);

  const handleClick = (value: number): void => {
    if (!isLoading) {
      setClickedValue(value);
      // Clear the clicked state after animation
      setTimeout(() => setClickedValue(null), 300);
      onSelect(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, value: number): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isLoading) {
        handleClick(value);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2">
      {/* Question */}
      <div className="mb-3 px-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {question}
        </p>
      </div>

      {/* Confidence Buttons */}
      <div className="space-y-2">
        {CONFIDENCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            onKeyPress={(e) => handleKeyPress(e, option.value)}
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-lg border-2 text-left
              transition-all duration-200 ease-in-out
              ${getColorClass(option.value)}
              ${clickedValue === option.value ? 'scale-95' : 'hover:scale-[1.02]'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            `}
            aria-label={`${option.label} - ${option.description}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{option.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {option.label}
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
