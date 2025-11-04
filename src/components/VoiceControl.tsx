import { useState, useEffect, useRef } from "react";

// TypeScript interfaces for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface VoiceControlProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  selectedVoice: SpeechSynthesisVoice | null;
  autoSendOnSilence?: boolean;
  silenceThresholdMs?: number;
}

export function VoiceControl({ 
  onTranscript, 
  selectedVoice,
  autoSendOnSilence = true,
  silenceThresholdMs = 3000
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef("");
  const isListeningRef = useRef(false);
  const waitingForSilenceRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const hasSubmittedRef = useRef(false);
  const lastProcessedIndexRef = useRef(0);
  const isProcessingRef = useRef(false);
  const autoSendOnSilenceRef = useRef(autoSendOnSilence);
  const silenceThresholdMsRef = useRef(silenceThresholdMs);
  
  // Update callback ref when it changes - but don't depend on onTranscript in main useEffect
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Update config refs without triggering recognition recreation
  useEffect(() => {
    autoSendOnSilenceRef.current = autoSendOnSilence;
    silenceThresholdMsRef.current = silenceThresholdMs;
  }, [autoSendOnSilence, silenceThresholdMs]);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Voice input not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionConstructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.continuous = true;
    recognition.interimResults = true; // Enable interim results for better UX
    recognition.lang = 'en-AU'; // Australian English
    
    // Mobile optimization: limit alternatives to reduce processing
    if ('maxAlternatives' in recognition) {
      (recognition as SpeechRecognition & { maxAlternatives: number }).maxAlternatives = 1;
    }

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Prevent duplicate processing (critical for mobile)
      if (isProcessingRef.current) {
        return;
      }

      let interim = '';
      let final = '';

      // Only process results we haven't seen before (prevents Samsung duplication)
      for (let i = lastProcessedIndexRef.current; i < event.results.length; i++) {
        const result = event.results[i];
        if (result !== undefined) {
          const alternative = result[0];
          if (alternative !== undefined) {
            const transcriptPiece = alternative.transcript;
            if (result.isFinal) {
              final += transcriptPiece + ' ';
              lastProcessedIndexRef.current = i + 1; // Track processed index
            } else {
              interim += transcriptPiece;
            }
          }
        }
      }

      // Update final transcript accumulator
      if (final.length > 0) {
        finalTranscriptRef.current += final;
      }

      // Update display transcripts
      setTranscript(finalTranscriptRef.current);
      setInterimTranscript(interim);

      // Only start timer when we have meaningful final results and not already waiting
      if (final.trim().length > 0 && autoSendOnSilenceRef.current && finalTranscriptRef.current.trim().length > 0 && !waitingForSilenceRef.current) {
        // Clear existing timer
        if (silenceTimerRef.current !== null) {
          clearTimeout(silenceTimerRef.current);
        }

        // Set flag to ignore further results
        waitingForSilenceRef.current = true;

        // Start new silence timer
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current !== null) {
            recognitionRef.current.stop();
          }
        }, silenceThresholdMsRef.current);
      } else if (autoSendOnSilenceRef.current && !waitingForSilenceRef.current) {
        // For testing: also trigger silence detection after any speech activity (even empty)
        if (silenceTimerRef.current !== null) {
          clearTimeout(silenceTimerRef.current);
        }

        waitingForSilenceRef.current = true;

        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current !== null) {
            recognitionRef.current.stop();
          }
        }, silenceThresholdMsRef.current);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Clear all timers
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // Reset all flags to prevent stuck state
      isProcessingRef.current = false;
      hasSubmittedRef.current = false;
      waitingForSilenceRef.current = false;
      lastProcessedIndexRef.current = 0;

      // Clear transcripts
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');

      // Set appropriate error message
      if (event.error === 'network') {
        setError('Network error. Please check your internet connection.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else if (event.error === 'aborted') {
        // Aborted is normal when user stops, don't show error
        setError(null);
      } else {
        setError(`Voice recognition error: ${event.error}. Please try again.`);
      }

      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;

      // Always clear silence timer
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // If we were waiting for silence timer and recognition ended naturally,
      // treat this as the silence we were waiting for and send immediately
      if (waitingForSilenceRef.current) {
        waitingForSilenceRef.current = false;

        const textToSend = finalTranscriptRef.current.trim();
        // Only submit if we haven't already submitted this transcript
        if (textToSend.length > 0 && !hasSubmittedRef.current && !isProcessingRef.current) {
          isProcessingRef.current = true;
          hasSubmittedRef.current = true;
          onTranscriptRef.current(textToSend);

          // Clear transcripts after submission
          finalTranscriptRef.current = '';
          setTranscript('');
          setInterimTranscript('');

          // Reset processing flags after a short delay
          setTimeout(() => {
            isProcessingRef.current = false;
            hasSubmittedRef.current = false;
          }, 500);
        }
      }

      // Always reset these flags on end
      waitingForSilenceRef.current = false;
      lastProcessedIndexRef.current = 0;

      // If we didn't submit, ensure processing flags are reset
      if (!hasSubmittedRef.current) {
        isProcessingRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current !== null) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current !== null && !isListening) {
      // Mobile Safari detection and compatibility check
      const isMobileSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                            /Safari/.test(navigator.userAgent) && 
                            !/Chrome/.test(navigator.userAgent);
      
      if (isMobileSafari) {
        // Check if user has activated the page (required for iOS Safari)
        if (!('userActivation' in navigator) || !navigator.userActivation?.isActive) {
          setError("Tap the microphone button to enable voice input on iOS Safari.");
          return;
        }
      }

      setTranscript("");
      setInterimTranscript("");
      finalTranscriptRef.current = "";
      waitingForSilenceRef.current = false;
      hasSubmittedRef.current = false; // Reset submission flag for new session
      lastProcessedIndexRef.current = 0; // Reset processed index
      isProcessingRef.current = false; // Reset processing flag
      setError(null);
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current !== null && isListening) {
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }
      waitingForSilenceRef.current = false;
      recognitionRef.current.stop();
      const textToSend = finalTranscriptRef.current.trim();
      // Only submit if we haven't already submitted this transcript
      if (textToSend.length > 0 && !hasSubmittedRef.current && !isProcessingRef.current) {
        isProcessingRef.current = true;
        hasSubmittedRef.current = true;
        onTranscriptRef.current(textToSend);

        // Reset processing flag after a short delay
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 500);
      }
      finalTranscriptRef.current = "";
      setTranscript("");
      setInterimTranscript("");
      lastProcessedIndexRef.current = 0;
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setError("Text-to-speech not supported in this browser.");
      return;
    }

    // Gracefully handle speech synthesis queue
    const speakText = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice !== null) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        // Don't show error for common issues like interruption
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          setError('Voice playback error. Please try again.');
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    // If currently speaking, pause, cancel, then speak new text
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setTimeout(() => {
        window.speechSynthesis.cancel();
        speakText();
      }, 100);
    } else {
      speakText();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}

interface VoiceButtonsProps {
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  disabled?: boolean;
  error?: string | null;
}

export function VoiceButtons({
  onStartListening,
  onStopListening,
  onStopSpeaking,
  isListening,
  isSpeaking,
  disabled,
  error
}: VoiceButtonsProps) {
  return (
    <div className="flex gap-2 items-center">
      {/* Microphone Button */}
      <button
        onClick={isListening ? onStopListening : onStartListening}
        disabled={(disabled ?? false) || isSpeaking}
        className={`p-2 rounded-lg transition-all ${
          isListening
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600'
        } disabled:cursor-not-allowed`}
        title={isListening ? 'Stop recording (or wait for auto-send)' : 'Start voice input'}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Stop Speaking Button */}
      {isSpeaking && (
        <button
          onClick={onStopSpeaking}
          className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
          title="Stop coach voice"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        </button>
      )}

      {/* Error indicator */}
      {(error !== null && error !== undefined && error.length > 0) && (
        <div className="text-xs text-red-600 dark:text-red-400 max-w-[200px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}

// New component for live transcript overlay
interface LiveTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function LiveTranscript({ transcript, interimTranscript, isListening }: LiveTranscriptProps) {
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
  onVoiceSelect
}: VoiceSettingsModalProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for English voices only
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en')
      );
      setVoices(englishVoices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    const handleVoicesChanged = () => {
      loadVoices();
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    // Cleanup: remove event listener on unmount
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
    
    utterance.onend = () => {
      setTestingVoice(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🎙️ Voice Settings
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Close voice settings"
              aria-label="Close voice settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Choose a voice for your coach. Click "Test" to hear each voice.
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {voices.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading voices...
            </div>
          ) : (
            <div className="space-y-3">
              {voices.map((voice) => (
                <div
                  key={voice.name}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedVoice?.name === voice.name
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                  }`}
                  onClick={() => onVoiceSelect(voice)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {voice.name}
                        </h4>
                        {voice.default && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {voice.lang} • {voice.localService ? 'Local' : 'Online'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        testVoice(voice);
                      }}
                      disabled={testingVoice === voice.name}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                      title="Test this voice"
                    >
                      {testingVoice === voice.name ? 'Playing...' : 'Test'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
