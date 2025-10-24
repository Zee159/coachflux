import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseVoiceSynthesisReturn {
  isSpeaking: boolean;
  error: string | null;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getAvailableVoices: () => SpeechSynthesisVoice[];
}

export function useVoiceSynthesis({
  rate = 0.95,
  pitch = 1.0,
  volume = 1.0,
  voice = null,
}: UseVoiceSynthesisOptions = {}): UseVoiceSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
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

  const speakText = useCallback(
    (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);

      if (voice !== null) {
        utterance.voice = voice;
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          setError(`Speech error: ${event.error}`);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, volume, voice]
  );

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) {
        setError('Text-to-speech not supported.');
        return;
      }

      if (text.trim().length === 0) {
        return;
      }

      // Gracefully handle existing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setTimeout(() => {
          window.speechSynthesis.cancel();
          speakText(text);
        }, 100);
      } else {
        speakText(text);
      }
    },
    [speakText]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  const getAvailableVoices = useCallback(() => availableVoices, [availableVoices]);

  return {
    isSpeaking,
    error,
    speak,
    stop,
    pause,
    resume,
    getAvailableVoices,
  };
}
