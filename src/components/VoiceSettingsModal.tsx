import { useState, useEffect } from 'react';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceSelect: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSettingsModal({
  isOpen,
  onClose,
  selectedVoice,
  onVoiceSelect,
}: VoiceSettingsModalProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for English voices that are local (natural) and not synthetic
      const naturalVoices = availableVoices.filter((voice) => {
        const isEnglish = voice.lang.startsWith('en');
        const isLocal = voice.localService === true;
        // Exclude known synthetic voice names
        const isSynthetic = voice.name.toLowerCase().includes('google') ||
                           voice.name.toLowerCase().includes('microsoft') ||
                           voice.name.toLowerCase().includes('samantha');
        return isEnglish && isLocal && !isSynthetic;
      });
      // If no natural voices found, fall back to all English voices
      setVoices(naturalVoices.length > 0 ? naturalVoices : availableVoices.filter((voice) => voice.lang.startsWith('en')));
    };

    loadVoices();

    const handleVoicesChanged = () => {
      loadVoices();
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged === handleVoicesChanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const testVoice = (voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();
    setTestingVoice(voice.name);

    const utterance = new SpeechSynthesisUtterance(
      "Hello, I'm your coaching assistant. I'm here to help you explore your goals and find clarity."
    );
    utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setTestingVoice(null);
    };

    utterance.onerror = () => {
      setTestingVoice(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            🎙️ Voice Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Voice List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {voices.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Loading voices...</p>
            </div>
          ) : (
            voices.map((voice) => (
              <div
                key={voice.name}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedVoice?.name === voice.name
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => onVoiceSelect(voice)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {voice.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {voice.lang} {voice.localService ? '(Local)' : '(Online)'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testVoice(voice);
                    }}
                    disabled={testingVoice !== null}
                    className="ml-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {testingVoice === voice.name ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
