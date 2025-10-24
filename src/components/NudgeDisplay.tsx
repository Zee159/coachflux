
interface NudgeDisplayProps {
  nudgeType: string;
  nudgeCategory: string;
  nudgeName: string;
  triggeredAt: string;
  userInput: string;
  className?: string;
}

export function NudgeDisplay({
  nudgeType,
  nudgeCategory,
  nudgeName,
  triggeredAt,
  userInput,
  className = ''
}: NudgeDisplayProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Control & Agency':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Specificity & Clarity':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Confidence Building':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Reframing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Action Support':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'Insight Amplification':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Control & Agency':
        return '🎯';
      case 'Specificity & Clarity':
        return '🔍';
      case 'Confidence Building':
        return '💪';
      case 'Reframing':
        return '🔄';
      case 'Action Support':
        return '🚀';
      case 'Insight Amplification':
        return '💡';
      default:
        return '🎯';
    }
  };

  const formatTriggerTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">
          {getCategoryIcon(nudgeCategory)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {nudgeName}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(nudgeCategory)}`}>
              {nudgeCategory}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Triggered at:</span> {formatTriggerTime(triggeredAt)}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">User input:</span> "{userInput}"
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Nudge type:</span> {nudgeType.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact nudge indicator for session steps
export function NudgeIndicator({ 
  nudgeType, 
  nudgeCategory,
  className = '' 
}: { 
  nudgeType: string;
  nudgeCategory: string;
  className?: string;
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Control & Agency':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Specificity & Clarity':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Confidence Building':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Reframing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Action Support':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'Insight Amplification':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Control & Agency':
        return '🎯';
      case 'Specificity & Clarity':
        return '🔍';
      case 'Confidence Building':
        return '💪';
      case 'Reframing':
        return '🔄';
      case 'Action Support':
        return '🚀';
      case 'Insight Amplification':
        return '💡';
      default:
        return '🎯';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(nudgeCategory)} ${className}`}>
      <span>{getCategoryIcon(nudgeCategory)}</span>
      <span>{nudgeType.replace(/_/g, ' ')}</span>
    </div>
  );
}

// Nudge usage summary for reports
export function NudgeUsageSummary({ 
  nudgesUsed 
}: { 
  nudgesUsed: Array<{
    nudge_type: string;
    nudge_category: string;
    nudge_name: string;
    triggered_at: string;
    user_input: string;
  }>;
}) {
  if (nudgesUsed === undefined || nudgesUsed === null || nudgesUsed.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm italic">
        No nudges were used in this session.
      </div>
    );
  }

  const categoryCounts = nudgesUsed.reduce((acc, nudge) => {
    const currentCount = acc[nudge.nudge_category];
    acc[nudge.nudge_category] = (currentCount ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Total nudges used:</span> {nudgesUsed.length}
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Nudge Categories:
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <span
              key={category}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >
              {category}: {count}
            </span>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Nudges Used:
        </h4>
        <div className="space-y-2">
          {nudgesUsed.map((nudge, index) => (
            <NudgeDisplay
              key={index}
              nudgeType={nudge.nudge_type}
              nudgeCategory={nudge.nudge_category}
              nudgeName={nudge.nudge_name}
              triggeredAt={nudge.triggered_at}
              userInput={nudge.user_input}
              className="text-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
