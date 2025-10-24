interface VoiceButtonProps {
  isListening: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceButton({
  isListening,
  disabled = false,
  onStart,
  onStop,
}: VoiceButtonProps) {
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`h-full px-4 py-2 rounded-lg transition-all flex items-center justify-center min-w-[48px] ${
        isListening
          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600'
      } disabled:cursor-not-allowed`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
    </button>
  );
}
