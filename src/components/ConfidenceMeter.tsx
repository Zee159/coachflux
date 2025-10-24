
interface ConfidenceMeterProps {
  initialConfidence?: number;
  currentConfidence?: number;
  finalConfidence?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfidenceMeter({
  initialConfidence,
  currentConfidence,
  finalConfidence,
  showProgress = true,
  size = 'md',
  className = ''
}: ConfidenceMeterProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence <= 2) {return 'text-red-500';}
    if (confidence <= 3) {return 'text-yellow-500';}
    if (confidence <= 4) {return 'text-blue-500';}
    return 'text-green-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence <= 1) {return 'Very Low';}
    if (confidence <= 2) {return 'Low';}
    if (confidence <= 3) {return 'Moderate';}
    if (confidence <= 4) {return 'High';}
    return 'Very High';
  };

  const getConfidencePercentage = (confidence: number) => {
    return Math.round((confidence / 5) * 100);
  };

  const renderConfidenceCircle = (confidence: number, label: string, _isCurrent = false) => {
    const percentage = getConfidencePercentage(confidence);
    const colorClass = getConfidenceColor(confidence);
    const labelClass = getConfidenceLabel(confidence);
    
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${percentage * 2.827} 283`}
            className={`transition-all duration-500 ${colorClass}`}
            strokeLinecap="round"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${colorClass} ${textSizeClasses[size]}`}>
            {confidence}
          </div>
          <div className={`text-xs text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'hidden' : ''}`}>
            {labelClass}
          </div>
        </div>
        {/* Label */}
        <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 ${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
          {label}
        </div>
      </div>
    );
  };

  if (!showProgress || initialConfidence === undefined || initialConfidence === null || finalConfidence === undefined || finalConfidence === null) {
    // Single confidence display
    const confidence = currentConfidence ?? finalConfidence ?? initialConfidence ?? 0;
    return renderConfidenceCircle(confidence, 'Confidence');
  }

  // Progress display with multiple confidence levels
  return (
    <div className="flex items-center justify-center space-x-8">
      {(initialConfidence !== undefined && initialConfidence !== null && initialConfidence !== 0) && (
        <div className="text-center">
          {renderConfidenceCircle(initialConfidence, 'Initial')}
        </div>
      )}
      
      {(currentConfidence !== undefined && currentConfidence !== null && currentConfidence !== 0) && (
        <div className="text-center">
          {renderConfidenceCircle(currentConfidence, 'Current', true)}
        </div>
      )}
      
      {(finalConfidence !== undefined && finalConfidence !== null && finalConfidence !== 0) && (
        <div className="text-center">
          {renderConfidenceCircle(finalConfidence, 'Final')}
        </div>
      )}
      
      {/* Progress indicator */}
      {(initialConfidence !== undefined && initialConfidence !== null && initialConfidence !== 0 && finalConfidence !== undefined && finalConfidence !== null && finalConfidence !== 0) && (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Progress
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            +{finalConfidence - initialConfidence}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {Math.round(((finalConfidence - initialConfidence) / initialConfidence) * 100)}% increase
          </div>
        </div>
      )}
    </div>
  );
}

// Compact confidence display for session steps
export function CompactConfidenceDisplay({ 
  confidence, 
  label = 'Confidence',
  className = '' 
}: { 
  confidence?: number; 
  label?: string;
  className?: string;
}) {
  if (confidence === undefined || confidence === null || confidence === 0) {return null;}

  const getConfidenceColor = (conf: number) => {
    if (conf <= 2) {return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';}
    if (conf <= 3) {return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';}
    if (conf <= 4) {return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';}
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(confidence)} ${className}`}>
      <span>{label}:</span>
      <span className="font-bold">{confidence}/5</span>
    </div>
  );
}
