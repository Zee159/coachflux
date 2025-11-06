import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
  pros?: string[];
  cons?: string[];
}

interface OptionsSelectorProps {
  options: Option[];
  onSubmit: (selectedIds: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
  coachMessage?: string;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = ({
  options,
  onSubmit,
  minSelections = 1,
  maxSelections = options.length,
  coachMessage = "Which options would you like to pursue?"
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleOption = (optionId: string): void => {
    setSelectedIds(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else if (prev.length < maxSelections) {
        return [...prev, optionId];
      }
      return prev;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, optionId: string): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOption(optionId);
    }
  };

  const handleSubmit = (): void => {
    if (selectedIds.length >= minSelections) {
      onSubmit(selectedIds);
    }
  };

  const isDisabled = selectedIds.length < minSelections;

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

      {/* Helper Text - Top */}
      <div className="mb-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: You can select multiple options to create a comprehensive action plan
        </p>
      </div>

      {/* Options List */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        role="group"
        aria-label="Select options to pursue"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select Options
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose {minSelections === maxSelections 
              ? `exactly ${minSelections}` 
              : `${minSelections}-${maxSelections}`} option{maxSelections > 1 ? 's' : ''}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 p-4" role="listbox" aria-label="Select options">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const isMaxReached = selectedIds.length >= maxSelections && !isSelected;

            return (
              <button
                key={option.id}
                onClick={() => !isMaxReached && toggleOption(option.id)}
                onKeyPress={(e) => !isMaxReached && handleKeyPress(e, option.id)}
                disabled={isMaxReached}
                className={`
                  w-full text-left relative px-4 py-3.5 transition-all duration-200 
                  ${isSelected 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-md' 
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
                  }
                  ${isMaxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  rounded-xl
                `}
                role="option"
                aria-selected={isSelected ? 'true' : 'false'}
                aria-disabled={isMaxReached ? 'true' : 'false'}
                tabIndex={0}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-base font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        {option.label}
                      </h4>
                      {option.recommended === true && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>

                    {/* Pros and Cons */}
                    {((option.pros !== undefined && option.pros.length > 0) || (option.cons !== undefined && option.cons.length > 0)) && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {/* Pros */}
                        {option.pros !== undefined && option.pros.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-green-700 dark:text-green-400">Pros:</p>
                            <ul className="space-y-0.5">
                              {option.pros.map((pro, idx) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Cons */}
                        {option.cons !== undefined && option.cons.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Cons:</p>
                            <ul className="space-y-0.5">
                              {option.cons.map((con, idx) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                  <span className="text-orange-500 mt-0.5">⚠</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedIds.length === 0 ? (
                <span>No options selected</span>
              ) : (
                <span className="font-medium text-green-600 dark:text-green-400">
                  {selectedIds.length} option{selectedIds.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`
                px-6 py-2.5 rounded-lg font-medium text-base transition-all duration-200
                ${isDisabled
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }
              `}
              aria-label={`Continue with ${selectedIds.length} selected option${selectedIds.length > 1 ? 's' : ''}`}
            >
              Continue with {selectedIds.length} selected
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: You can select multiple options to create a comprehensive action plan
        </p>
      </div>
    </div>
  );
};
