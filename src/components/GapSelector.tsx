import React, { useState } from 'react';
import { Check, TrendingUp, Briefcase } from 'lucide-react';

interface Gap {
  id: string;
  type: 'skill' | 'experience';
  gap: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

interface GapSelectorProps {
  gaps: Gap[];
  onSubmit: (selectedIds: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
  coachMessage?: string;
}

export const GapSelector: React.FC<GapSelectorProps> = ({
  gaps,
  onSubmit,
  maxSelections = gaps.length,
  coachMessage = "Select the gaps that resonate with you"
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleGap = (gapId: string): void => {
    setSelectedIds(prev => {
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
    onSubmit(selectedIds);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return '🔴 High Priority';
      case 'medium': return '🟡 Medium Priority';
      case 'low': return '🟢 Low Priority';
      default: return priority;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Coach Message */}
      {coachMessage.length > 0 && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-gray-800 dark:text-gray-200 text-base">
            {coachMessage}
          </p>
        </div>
      )}

      {/* Helper Text - Top */}
      <div className="mb-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Select the gaps that feel most relevant to your career transition
        </p>
      </div>

      {/* Gaps List */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        role="group"
        aria-label="Select relevant gaps"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI-Suggested Gaps
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select any that resonate with you (optional - you can skip all if none fit)
          </p>
        </div>

        {/* Gaps */}
        <div className="space-y-3 p-4" role="listbox" aria-label="Select gaps">
          {gaps.map((gap) => {
            const isSelected = selectedIds.includes(gap.id);
            const isMaxReached = selectedIds.length >= maxSelections && !isSelected;

            return (
              <button
                key={gap.id}
                onClick={() => !isMaxReached && toggleGap(gap.id)}
                onKeyPress={(e) => !isMaxReached && handleKeyPress(e, gap.id)}
                disabled={isMaxReached}
                className={`
                  w-full text-left relative px-4 py-3.5 transition-all duration-200 
                  ${isSelected 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 shadow-md' 
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
                <div className="flex items-start justify-between gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Type Icon */}
                      <div className="flex-shrink-0">
                        {gap.type === 'skill' ? (
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      {/* Gap Title */}
                      <h4 className={`text-base font-medium flex-1 ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        {gap.gap}
                      </h4>
                      
                      {/* Type Badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        gap.type === 'skill' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {gap.type === 'skill' ? 'Skill' : 'Experience'}
                      </span>
                      
                      {/* Priority Badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                        {getPriorityLabel(gap.priority)}
                      </span>
                    </div>
                    
                    {/* Rationale */}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {gap.rationale}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
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
                <span>No gaps selected (that's okay!)</span>
              ) : (
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  {selectedIds.length} gap{selectedIds.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg font-medium text-base transition-all duration-200 bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label={`Continue with ${selectedIds.length} selected gap${selectedIds.length > 1 ? 's' : ''}`}
            >
              {selectedIds.length === 0 ? 'Skip All' : `Continue with ${selectedIds.length} selected`}
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 These are AI suggestions based on your career transition. Select only what feels accurate.
        </p>
      </div>
    </div>
  );
};
