import React, { useState } from 'react';
import { Check, Edit3, SkipForward, Save, X, Plus, Minus } from 'lucide-react';

interface SuggestedAction {
  action: string;
  due_days: number;
  owner: string;
  accountability_mechanism: string;
  support_needed: string;
}

interface ActionValidatorProps {
  optionLabel: string;
  suggestedAction: SuggestedAction;
  onAccept: () => void;
  onModify: (modifiedAction: SuggestedAction) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export const ActionValidator: React.FC<ActionValidatorProps> = ({
  optionLabel,
  suggestedAction,
  onAccept,
  onModify,
  onSkip,
  isLoading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAction, setEditedAction] = useState<SuggestedAction>(suggestedAction);

  const handleModifyClick = (): void => {
    setIsEditing(true);
    setEditedAction(suggestedAction);
  };

  const handleSave = (): void => {
    onModify(editedAction);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditedAction(suggestedAction);
    setIsEditing(false);
  };

  const currentAction = isEditing ? editedAction : suggestedAction;
  const formatTimeline = (days: number): string => {
    if (days === 1) {
      return 'Tomorrow';
    }
    if (days <= 7) {
      return `${days} days`;
    }
    if (days <= 14) {
      return `${Math.round(days / 7)} week${days > 7 ? 's' : ''}`;
    }
    if (days <= 60) {
      return `${Math.round(days / 7)} weeks`;
    }
    return `${Math.round(days / 30)} month${days > 30 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Header */}
      <div className="mb-3 px-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For <span className="font-semibold text-gray-900 dark:text-gray-100">"{optionLabel}"</span>, I suggest:
        </p>
      </div>

      {/* Suggested Action Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Suggested Action
            </h3>
          </div>
        </div>

        {/* Action Details */}
        <div className="px-6 py-5 space-y-4">
          {/* Action */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Action
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedAction.action}
                onChange={(e) => setEditedAction({ ...editedAction, action: e.target.value })}
                className="w-full px-3 py-2 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter action..."
              />
            ) : (
              <p className="text-base text-gray-900 dark:text-gray-100 font-medium">
                {currentAction.action}
              </p>
            )}
          </div>

          {/* Timeline & Owner Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Timeline (days)
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  {/* Increment/Decrement Controls */}
                  <div className="flex items-center gap-2">
                    {/* Decrement Button */}
                    <button
                      type="button"
                      onClick={() => setEditedAction({ 
                        ...editedAction, 
                        due_days: Math.max(1, editedAction.due_days - 1) 
                      })}
                      className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-150 touch-manipulation"
                      aria-label="Decrease days"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    {/* Days Display */}
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={editedAction.due_days}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value);
                          if (!isNaN(parsed) && parsed >= 1 && parsed <= 365) {
                            setEditedAction({ ...editedAction, due_days: parsed });
                          }
                        }}
                        className="w-full px-2 py-2 text-center text-base font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max="365"
                        aria-label="Timeline in days"
                      />
                    </div>
                    
                    {/* Increment Button */}
                    <button
                      type="button"
                      onClick={() => setEditedAction({ 
                        ...editedAction, 
                        due_days: Math.min(365, editedAction.due_days + 1) 
                      })}
                      className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-150 touch-manipulation"
                      aria-label="Increase days"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Quick Preset Buttons */}
                  <div className="flex gap-1">
                    {[1, 7, 14, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setEditedAction({ ...editedAction, due_days: days })}
                        className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors duration-150 touch-manipulation ${
                          editedAction.due_days === days
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                        aria-label={`Set to ${days} day${days > 1 ? 's' : ''}`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {formatTimeline(currentAction.due_days)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Owner
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedAction.owner}
                  onChange={(e) => setEditedAction({ ...editedAction, owner: e.target.value })}
                  className="w-full px-3 py-2 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Owner..."
                />
              ) : (
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {currentAction.owner}
                </p>
              )}
            </div>
          </div>

          {/* Accountability */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Accountability
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedAction.accountability_mechanism}
                onChange={(e) => setEditedAction({ ...editedAction, accountability_mechanism: e.target.value })}
                className="w-full px-3 py-2 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How will you track progress?"
              />
            ) : (
              <p className="text-base text-gray-900 dark:text-gray-100">
                {currentAction.accountability_mechanism}
              </p>
            )}
          </div>

          {/* Support Needed */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Support Needed
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedAction.support_needed}
                onChange={(e) => setEditedAction({ ...editedAction, support_needed: e.target.value })}
                className="w-full px-3 py-2 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What help do you need?"
              />
            ) : (
              <p className="text-base text-gray-900 dark:text-gray-100">
                {currentAction.support_needed}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-md font-medium text-sm transition-colors duration-150 disabled:cursor-not-allowed"
                aria-label="Save modified action"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>

              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-transparent text-gray-600 dark:text-gray-400 disabled:text-gray-400 rounded-md font-medium text-sm transition-colors duration-150 border border-gray-300 dark:border-gray-600 disabled:cursor-not-allowed"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Accept Button (Primary) */}
              <button
                onClick={onAccept}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-md font-medium text-sm transition-colors duration-150 disabled:cursor-not-allowed"
                aria-label="Accept suggested action"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>

              {/* Modify Button (Secondary) */}
              <button
                onClick={handleModifyClick}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-md font-medium text-sm transition-colors duration-150 disabled:cursor-not-allowed"
                aria-label="Modify suggested action"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modify</span>
              </button>

              {/* Skip Button (Ghost) */}
              <button
                onClick={onSkip}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-transparent text-gray-600 dark:text-gray-400 disabled:text-gray-400 rounded-md font-medium text-sm transition-colors duration-150 border border-gray-300 dark:border-gray-600 disabled:cursor-not-allowed"
                aria-label="Skip this option"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isEditing 
            ? "✏️ Edit any field, then click 'Save Changes' to accept your modifications"
            : "💡 Tip: Click 'Modify' to customize any details, or 'Accept' if this looks good"
          }
        </p>
      </div>
    </div>
  );
};
