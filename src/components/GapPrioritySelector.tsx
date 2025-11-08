import React, { useState } from 'react';
import { Check, TrendingUp, Briefcase, AlertCircle } from 'lucide-react';

interface GapItem {
  id: string;
  gap: string;
  type: 'skill' | 'experience';
  source: 'user' | 'ai';
}

interface GapPrioritySelectorProps {
  gaps: GapItem[];
  onSubmit: (selectedGaps: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
  coachMessage?: string;
}

export const GapPrioritySelector: React.FC<GapPrioritySelectorProps> = ({
  gaps,
  onSubmit,
  minSelections = 1,
  maxSelections = 5,
  coachMessage = "Select the gaps that are most critical to address"
}) => {
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);

  const toggleGap = (gapId: string): void => {
    setSelectedGaps(prev => {
      if (prev.includes(gapId)) {
        return prev.filter(id => id !== gapId);
      } else if (prev.length < maxSelections) {
        return [...prev, gapId];
      }
      return prev;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, gapId: string): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleGap(gapId);
    }
  };

  const handleSubmit = (): void => {
    if (selectedGaps.length >= minSelections) {
      onSubmit(selectedGaps);
    }
  };

  const isDisabled = selectedGaps.length < minSelections;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Coach Message */}
      {coachMessage.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800 dark:text-gray-200 text-base">
              {coachMessage}
            </p>
          </div>
        </div>
      )}

      {/* Helper Text - Top */}
      <div className="mb-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Select {minSelections}-{maxSelections} gaps to focus on. These will guide your roadmap and action plan.
        </p>
      </div>

      {/* Gaps List */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        role="group"
        aria-label="Select priority gaps"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Development Priorities
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select {minSelections === maxSelections 
              ? `exactly ${minSelections}` 
              : `${minSelections}-${maxSelections}`} gap{maxSelections > 1 ? 's' : ''} to prioritize
          </p>
        </div>

        {/* Priority Order Indicator */}
        {selectedGaps.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Priority Order:</span> {selectedGaps.map((id, idx) => {
                const gap = gaps.find(g => g.id === id);
                return gap !== undefined ? `${idx + 1}. ${gap.gap}` : '';
              }).filter(Boolean).join(' → ')}
            </p>
          </div>
        )}

        {/* Gaps */}
        <div className="space-y-3 p-4" role="listbox" aria-label="Select priority gaps">
          {gaps.map((gap) => {
            const isSelected = selectedGaps.includes(gap.id);
            const selectionOrder = isSelected ? selectedGaps.indexOf(gap.id) + 1 : null;
            const isMaxReached = selectedGaps.length >= maxSelections && !isSelected;

            return (
              <button
                key={gap.id}
                onClick={() => !isMaxReached && toggleGap(gap.id)}
                onKeyPress={(e) => !isMaxReached && handleKeyPress(e, gap.id)}
                disabled={isMaxReached}
                className={`
                  w-full text-left relative px-4 py-3.5 transition-all duration-200 
                  ${isSelected 
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 shadow-md' 
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
                  }
                  ${isMaxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  rounded-xl
                `}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isMaxReached}
                tabIndex={0}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    {/* Priority Number */}
                    {isSelected && selectionOrder !== null && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{selectionOrder}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Type Icon */}
                    <div className="flex-shrink-0">
                      {gap.type === 'skill' ? (
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    {/* Gap Text */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base font-medium ${isSelected ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        {gap.gap}
                      </h4>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          gap.type === 'skill' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {gap.type === 'skill' ? 'Skill Gap' : 'Experience Gap'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          gap.source === 'ai'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {gap.source === 'ai' ? '🤖 AI Suggested' : '👤 Your Input'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
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
              {selectedGaps.length === 0 ? (
                <span>No gaps selected yet</span>
              ) : selectedGaps.length < minSelections ? (
                <span className="text-orange-600 dark:text-orange-400">
                  Select at least {minSelections - selectedGaps.length} more
                </span>
              ) : (
                <span className="font-medium text-green-600 dark:text-green-400">
                  ✓ {selectedGaps.length} gap{selectedGaps.length > 1 ? 's' : ''} selected
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
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                }
              `}
              aria-label={`Continue with ${selectedGaps.length} selected gap${selectedGaps.length > 1 ? 's' : ''}`}
            >
              {isDisabled ? `Select ${minSelections - selectedGaps.length} more` : `Set ${selectedGaps.length} as Priorities`}
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 The order you select matters - your first selection will be your top priority
        </p>
      </div>
    </div>
  );
};
