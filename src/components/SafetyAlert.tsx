import { useState } from 'react';

interface SafetyAlertProps {
  level: 'anxiety' | 'agitation' | 'redundancy' | 'severe' | 'crisis';
  message: string;
  emergencyResources?: {
    crisis: string;
    suicide: string;
    description: string;
  };
  onDismiss?: () => void;
  className?: string;
}

export function SafetyAlert({
  level,
  message,
  emergencyResources,
  onDismiss,
  className = ''
}: SafetyAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {return null;}

  const getAlertStyles = (alertLevel: string) => {
    switch (alertLevel) {
      case 'anxiety':
        return {
          container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-200',
          content: 'text-blue-700 dark:text-blue-300'
        };
      case 'agitation':
        return {
          container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-800 dark:text-yellow-200',
          content: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'redundancy':
        return {
          container: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          title: 'text-orange-800 dark:text-orange-200',
          content: 'text-orange-700 dark:text-orange-300'
        };
      case 'severe':
        return {
          container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-200',
          content: 'text-red-700 dark:text-red-300'
        };
      case 'crisis':
        return {
          container: 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700',
          icon: 'text-red-700 dark:text-red-300',
          title: 'text-red-900 dark:text-red-100',
          content: 'text-red-800 dark:text-red-200'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-800 dark:text-gray-200',
          content: 'text-gray-700 dark:text-gray-300'
        };
    }
  };

  const getAlertIcon = (alertLevel: string) => {
    switch (alertLevel) {
      case 'anxiety':
        return '😰';
      case 'agitation':
        return '😠';
      case 'redundancy':
        return '😟';
      case 'severe':
        return '⚠️';
      case 'crisis':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getAlertTitle = (alertLevel: string) => {
    switch (alertLevel) {
      case 'anxiety':
        return 'Anxiety Detected';
      case 'agitation':
        return 'Agitation Detected';
      case 'redundancy':
        return 'Job Security Concerns';
      case 'severe':
        return 'Severe Distress';
      case 'crisis':
        return 'Crisis Alert';
      default:
        return 'Safety Notice';
    }
  };

  const styles = getAlertStyles(level);
  const icon = getAlertIcon(level);
  const title = getAlertTitle(level);

  const isHighPriority = level === 'severe' || level === 'crisis';

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${styles.container} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`text-2xl ${styles.icon}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>
            {title}
          </h3>
          <p className={`${styles.content} leading-relaxed`}>
            {message}
          </p>
          
          {/* Emergency resources for high priority alerts */}
          {isHighPriority && emergencyResources !== undefined && emergencyResources !== null && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <h4 className={`font-semibold ${styles.title} mb-2`}>
                Emergency Resources:
              </h4>
              <p className={`${styles.content} text-sm`}>
                {emergencyResources.description}
              </p>
              <div className="mt-2 space-y-1">
                <p className={`${styles.content} text-sm`}>
                  <strong>Crisis:</strong> {emergencyResources.crisis}
                </p>
                <p className={`${styles.content} text-sm`}>
                  <strong>Suicide Prevention:</strong> {emergencyResources.suicide}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Dismiss button for non-crisis alerts */}
        {!isHighPriority && onDismiss !== undefined && onDismiss !== null && (
          <button
            onClick={handleDismiss}
            className={`${styles.icon} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss alert"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Compact safety indicator for session steps
export function SafetyIndicator({ 
  level, 
  className = '' 
}: { 
  level: 'safe' | 'anxiety' | 'agitation' | 'redundancy' | 'severe' | 'crisis';
  className?: string;
}) {
  if (level === 'safe') {return null;}

  const getIndicatorColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'anxiety':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'agitation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'redundancy':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'severe':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'crisis':
        return 'bg-red-200 text-red-900 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getIndicatorIcon = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'anxiety':
        return '😰';
      case 'agitation':
        return '😠';
      case 'redundancy':
        return '😟';
      case 'severe':
        return '⚠️';
      case 'crisis':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getIndicatorColor(level)} ${className}`}>
      <span>{getIndicatorIcon(level)}</span>
      <span className="capitalize">{level}</span>
    </div>
  );
}
