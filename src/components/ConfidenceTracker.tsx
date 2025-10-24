/**
 * ⚠️ FIX P1-2: Confidence Transformation Tracker
 * Visualizes confidence improvement journey during COMPASS sessions
 */

interface ConfidenceTrackerProps {
  initialConfidence: number;
  currentConfidence: number;
  stage: 'ownership' | 'practice';
  className?: string;
}

export function ConfidenceTracker({ 
  initialConfidence, 
  currentConfidence,
  stage,
  className = ''
}: ConfidenceTrackerProps): JSX.Element {
  const increase = currentConfidence - initialConfidence;
  const isPositive = increase > 0;
  const percentIncrease = initialConfidence > 0 ? Math.round((increase / initialConfidence) * 100) : 0;
  
  // Determine color based on confidence level
  const getConfidenceColor = (confidence: number): string => {
    if (confidence <= 3) return 'bg-red-500 dark:bg-red-600';
    if (confidence <= 5) return 'bg-orange-500 dark:bg-orange-600';
    if (confidence <= 7) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-green-500 dark:bg-green-600';
  };
  
  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 p-4 rounded-lg ${className}`}>
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <span>📈</span>
          <span>Your Confidence Transformation</span>
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {stage === 'ownership' ? 'Building your confidence...' : 'Your progress in this session'}
        </p>
      </div>
      
      <div className="space-y-3">
        {/* Starting Confidence */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Starting</span>
            <span className="font-bold text-gray-900 dark:text-white">{initialConfidence}/10</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getConfidenceColor(initialConfidence)} transition-all duration-500`}
              style={{ width: `${initialConfidence * 10}%` }}
            />
          </div>
        </div>
        
        {/* Current Confidence */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {stage === 'ownership' ? 'Current' : 'Final'}
            </span>
            <span className="font-bold text-gray-900 dark:text-white">{currentConfidence}/10</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getConfidenceColor(currentConfidence)} transition-all duration-500`}
              style={{ width: `${currentConfidence * 10}%` }}
            />
          </div>
        </div>
        
        {/* Improvement Display */}
        {isPositive && (
          <div className="pt-2 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border-2 border-green-200 dark:border-green-800">
              <span className="text-2xl mr-2">✨</span>
              <div className="text-left">
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  +{increase} point{increase !== 1 ? 's' : ''} increase!
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {percentIncrease}% improvement
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* No change or negative */}
        {!isPositive && increase === 0 && (
          <div className="pt-2 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                No change yet - let's keep exploring
              </span>
            </div>
          </div>
        )}
        
        {!isPositive && increase < 0 && (
          <div className="pt-2 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <span className="text-sm text-orange-700 dark:text-orange-300">
                Let's work on building your confidence
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Success message for significant improvement */}
      {isPositive && increase >= 3 && stage === 'practice' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 text-center">
            <strong>🎉 Excellent progress!</strong> You've made a meaningful confidence shift in this session.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact confidence display for use in message flows
 */
interface CompactConfidenceTrackerProps {
  initialConfidence: number;
  currentConfidence: number;
  className?: string;
}

export function CompactConfidenceTracker({ 
  initialConfidence, 
  currentConfidence,
  className = ''
}: CompactConfidenceTrackerProps): JSX.Element {
  const increase = currentConfidence - initialConfidence;
  const isPositive = increase > 0;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full ${className}`}>
      <div className="flex items-center gap-1 text-xs">
        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
        <span className="font-bold text-gray-900 dark:text-white">{initialConfidence}</span>
        <span className="text-gray-400">→</span>
        <span className="font-bold text-gray-900 dark:text-white">{currentConfidence}</span>
      </div>
      {isPositive && (
        <div className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
          <span>↑</span>
          <span>+{increase}</span>
        </div>
      )}
    </div>
  );
}

