import { useState, useEffect, useRef, useCallback } from 'react';

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

interface UseVoiceRecognitionOptions {
  onTranscript?: (text: string) => void;
  language?: string;
  silenceThresholdMs?: number;
  autoSendOnSilence?: boolean;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useVoiceRecognition({
  onTranscript,
  language = 'en-GB',
  silenceThresholdMs = 1500,
  autoSendOnSilence = true,
}: UseVoiceRecognitionOptions = {}): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');
  const waitingForSilenceRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const lastProcessedIndexRef = useRef(0);

  // Update callback ref without triggering effects
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice input not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();

    recognition.continuous = false;  // Changed to false to get proper end events
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = lastProcessedIndexRef.current; i < event.results.length; i++) {
        const result = event.results[i];
        if (result !== undefined) {
          const alternative = result[0];
          if (alternative !== undefined) {
            const transcriptPiece = alternative.transcript;
            if (result.isFinal) {
              final += transcriptPiece + ' ';
              lastProcessedIndexRef.current = i + 1;
            } else {
              interim += transcriptPiece;
            }
          }
        }
      }

      if (final.length > 0) {
        finalTranscriptRef.current += final;
      }

      setTranscript(finalTranscriptRef.current);
      setInterimTranscript(interim);

      // Auto-send on silence
      if (final.trim().length > 0 && autoSendOnSilence && !waitingForSilenceRef.current) {
        if (silenceTimerRef.current !== null) {
          clearTimeout(silenceTimerRef.current);
        }

        waitingForSilenceRef.current = true;

        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current !== null) {
            recognitionRef.current.stop();
          }
        }, silenceThresholdMs);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }

      if (event.error === 'network') {
        setError('Network error. Please check your internet connection.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else if (event.error !== 'aborted') {
        setError(`Voice error: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }

      // Submit transcript if waiting for silence
      if (waitingForSilenceRef.current) {
        const textToSend = finalTranscriptRef.current.trim();
        if (textToSend.length > 0) {
          onTranscriptRef.current?.(textToSend);
          finalTranscriptRef.current = '';
          setTranscript('');
          setInterimTranscript('');
        }
      }

      waitingForSilenceRef.current = false;
      lastProcessedIndexRef.current = 0;
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
  }, [language, silenceThresholdMs, autoSendOnSilence]);

  const startListening = useCallback(() => {
    if (recognitionRef.current !== null && !isListening) {
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      waitingForSilenceRef.current = false;
      lastProcessedIndexRef.current = 0;
      setError(null);

      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }

      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current !== null && isListening) {
      if (silenceTimerRef.current !== null) {
        clearTimeout(silenceTimerRef.current);
      }
      waitingForSilenceRef.current = false;
      recognitionRef.current.stop();

      const textToSend = finalTranscriptRef.current.trim();
      if (textToSend.length > 0) {
        onTranscriptRef.current?.(textToSend);
      }

      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      lastProcessedIndexRef.current = 0;
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    lastProcessedIndexRef.current = 0;
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
