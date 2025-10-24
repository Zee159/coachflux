interface LiveTranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function LiveTranscriptDisplay({
  transcript,
  interimTranscript,
  isListening,
}: LiveTranscriptDisplayProps) {
  const hasTranscript = transcript.length > 0 || interimTranscript.length > 0;

  if (!isListening || !hasTranscript) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-3 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-1.5">
            🎙️ Listening... (auto-sends after 1.5s silence)
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
            {transcript}
            {interimTranscript.length > 0 && (
              <span className="text-gray-600 dark:text-gray-400 italic"> {interimTranscript}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
