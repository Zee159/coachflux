import React, { useState } from 'react';
import { Target, Scale, Waves } from 'lucide-react';

interface ControlLevel {
  id: 'high' | 'mixed' | 'low';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ControlLevelSelectorProps {
  onSubmit: (level: 'high' | 'mixed' | 'low') => void;
  coachMessage?: string;
}

const CONTROL_LEVELS: ControlLevel[] = [
  {
    id: 'high',
    label: 'High Control',
    description: 'I can influence most of this change',
    icon: <Target className="w-6 h-6" />,
    color: 'green'
  },
  {
    id: 'mixed',
    label: 'Mixed Control',
    description: 'Some parts I can control, others I can\'t',
    icon: <Scale className="w-6 h-6" />,
    color: 'yellow'
  },
  {
    id: 'low',
    label: 'Low Control',
    description: 'This is mostly happening to me',
    icon: <Waves className="w-6 h-6" />,
    color: 'orange'
  }
];

export const ControlLevelSelector: React.FC<ControlLevelSelectorProps> = ({
  onSubmit,
  coachMessage = "Thinking about this change, how much control do you have?"
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'high' | 'mixed' | 'low' | null>(null);

  const handleSelect = (level: 'high' | 'mixed' | 'low'): void => {
    // Submit immediately on click (before state update to prevent re-render blocking)
    onSubmit(level);
    // Update state for visual feedback
    setSelectedLevel(level);
  };

  const getColorClasses = (color: string, isSelected: boolean): string => {
    if (color === 'green') {
      return isSelected
        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-md'
        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600';
    }
    if (color === 'yellow') {
      return isSelected
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 shadow-md'
        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600';
    }
    if (color === 'orange') {
      return isSelected
        ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 shadow-md'
        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600';
    }
    return '';
  };

  const getIconColorClasses = (color: string, isSelected: boolean): string => {
    if (color === 'green') {
      return isSelected ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500';
    }
    if (color === 'yellow') {
      return isSelected ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500';
    }
    if (color === 'orange') {
      return isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500';
    }
    return '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Coach Message */}
      {coachMessage.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 text-base">
            {coachMessage}
          </p>
        </div>
      )}

      {/* Control Level Options */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        role="radiogroup"
        aria-label="Select your level of control"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select Your Control Level
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose the option that best describes your situation
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 p-4">
          {CONTROL_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;

            return (
              <button
                key={level.id}
                onClick={() => handleSelect(level.id)}
                className={`
                  w-full text-left relative px-4 py-4 transition-all duration-200 
                  ${getColorClasses(level.color, isSelected)}
                  cursor-pointer hover:shadow-md
                  rounded-xl shadow-sm
                `}
                role="radio"
                aria-checked={isSelected ? 'true' : 'false'}
                tabIndex={0}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${getIconColorClasses(level.color, isSelected)}`}>
                    {level.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-semibold ${isSelected ? `text-${level.color}-900 dark:text-${level.color}-100` : 'text-gray-900 dark:text-gray-100'}`}>
                      {level.label}
                    </h4>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {level.description}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full bg-${level.color}-500 flex items-center justify-center`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
