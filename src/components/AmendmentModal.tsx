import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';

interface FieldValue {
  key: string;
  label: string;
  value: unknown;
  type: 'string' | 'number' | 'array' | 'object';
}

interface AmendmentModalProps {
  stepName: string;
  fields: FieldValue[];
  onSave: (amendments: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AmendmentModal: React.FC<AmendmentModalProps> = ({
  stepName,
  fields,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [editedFields, setEditedFields] = useState<Record<string, unknown>>({});
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFieldChange = (key: string, value: unknown): void => {
    setEditedFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (): void => {
    onSave(editedFields);
  };

  const renderFieldEditor = (field: FieldValue): JSX.Element => {
    const isEditing = editingField === field.key;
    const currentValue = editedFields[field.key] ?? field.value;

    if (!isEditing) {
      return (
        <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex-1">
            <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
              {field.label}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {formatValue(currentValue)}
            </p>
          </div>
          <button
            onClick={() => setEditingField(field.key)}
            className="ml-3 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
            aria-label={`Edit ${field.label}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-2">
          {field.label}
        </p>
        {renderInput(field, currentValue, handleFieldChange)}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setEditingField(null)}
            className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors"
          >
            Done
          </button>
          <button
            onClick={() => {
              setEditedFields(prev => {
                const updated = { ...prev };
                const key = field.key;
                if (key in updated) {
                  const newUpdated: Record<string, unknown> = {};
                  for (const [k, v] of Object.entries(updated)) {
                    if (k !== key) {
                      newUpdated[k] = v;
                    }
                  }
                  return newUpdated;
                }
                return updated;
              });
              setEditingField(null);
            }}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  const renderInput = (field: FieldValue, value: unknown, onChange: (key: string, value: unknown) => void): JSX.Element => {
    if (field.type === 'string') {
      return (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
          aria-label={field.label}
        />
      );
    }

    if (field.type === 'number') {
      return (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(field.key, Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label={field.label}
        />
      );
    }

    if (field.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {arrayValue.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={String(item)}
                onChange={(e) => {
                  const newArray: unknown[] = [];
                  for (let i = 0; i < arrayValue.length; i++) {
                    if (i === idx) {
                      newArray.push(e.target.value);
                    } else {
                      newArray.push(arrayValue[i]);
                    }
                  }
                  onChange(field.key, newArray);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label={`${field.label} item ${idx + 1}`}
              />
              <button
                onClick={() => {
                  const newArray = arrayValue.filter((_, i) => i !== idx);
                  onChange(field.key, newArray);
                }}
                className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newArray: unknown[] = [];
              for (const item of arrayValue) {
                newArray.push(item);
              }
              newArray.push('');
              onChange(field.key, newArray);
            }}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            + Add Item
          </button>
        </div>
      );
    }

    return <p className="text-xs text-gray-500">Complex field - cannot edit inline</p>;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return 'Not set';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Empty list';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const stepLabel = stepName.charAt(0).toUpperCase() + stepName.slice(1);
  const hasChanges = Object.keys(editedFields).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 className="text-lg font-bold text-white">
            Amend {stepLabel} Responses
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {fields.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No fields to amend for this step
            </p>
          ) : (
            fields.map(field => (
              <div key={field.key}>
                {renderFieldEditor(field)}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 
                ${hasChanges 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }
                disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700
                text-white rounded-lg font-medium text-sm transition-all duration-200 
                shadow-md hover:shadow-lg disabled:cursor-not-allowed active:scale-95
              `}
            >
              <Save className="w-4 h-4" strokeWidth={2.5} />
              <span>{hasChanges ? 'Save Changes' : 'Continue Without Changes'}</span>
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors border border-gray-300 dark:border-gray-600 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
          {hasChanges && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
              ✓ {Object.keys(editedFields).length} field(s) modified
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
