# Fresh Voice Implementation Guide

## Overview

This is a modular, architecture-aligned voice implementation for CoachFlux that follows your established patterns:
- **Custom hooks** for logic separation (`useVoiceRecognition`, `useVoiceSynthesis`)
- **Presentational components** for UI (`VoiceButton`, `LiveTranscriptDisplay`)
- **TypeScript strict mode** with zero `any` types
- **Proper cleanup** and memory management
- **Mobile Safari compatibility**

## Architecture

### File Structure

```
src/
├── hooks/
│   ├── useVoiceRecognition.ts    # Speech recognition logic
│   ├── useVoiceSynthesis.ts      # Text-to-speech logic
│   └── index.ts                  # Barrel export
├── components/
│   ├── VoiceButton.tsx           # Microphone button UI
│   └── LiveTranscriptDisplay.tsx # Live transcript overlay
```

## Core Hooks

### `useVoiceRecognition(options?)`

Manages Web Speech API recognition with automatic silence detection.

**Options:**
- `onTranscript?: (text: string) => void` - Callback when transcript is ready
- `language?: string` - Language code (default: 'en-GB')
- `silenceThresholdMs?: number` - Silence timeout (default: 1500ms)
- `autoSendOnSilence?: boolean` - Auto-submit on silence (default: true)

**Returns:**
```typescript
{
  isListening: boolean;
  transcript: string;           // Final transcript
  interimTranscript: string;    // Interim (in-progress) transcript
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}
```

**Example Usage:**
```typescript
const { isListening, transcript, startListening, stopListening, error } = useVoiceRecognition({
  onTranscript: (text) => {
    handleSubmit(text);
  },
  language: 'en-GB',
  silenceThresholdMs: 1500,
  autoSendOnSilence: true,
});
```

### `useVoiceSynthesis(options?)`

Manages Web Speech API synthesis (text-to-speech).

**Options:**
- `rate?: number` - Speech rate (default: 0.95)
- `pitch?: number` - Voice pitch (default: 1.0)
- `volume?: number` - Volume (default: 1.0)
- `voice?: SpeechSynthesisVoice | null` - Selected voice

**Returns:**
```typescript
{
  isSpeaking: boolean;
  error: string | null;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getAvailableVoices: () => SpeechSynthesisVoice[];
}
```

**Example Usage:**
```typescript
const { isSpeaking, speak, stop, getAvailableVoices } = useVoiceSynthesis({
  rate: 0.95,
  pitch: 1.0,
  voice: selectedVoice,
});

// Speak text
speak("Hello, how can I help you today?");

// Stop speaking
stop();
```

## UI Components

### `VoiceButton`

Microphone button with integrated error display.

**Props:**
```typescript
{
  isListening: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
}
```

**Example:**
```typescript
<VoiceButton
  isListening={isListening}
  disabled={submitting}
  onStart={startListening}
  onStop={stopListening}
  error={error}
/>
```

### `LiveTranscriptDisplay`

Shows live transcript while listening.

**Props:**
```typescript
{
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}
```

**Example:**
```typescript
<LiveTranscriptDisplay
  transcript={transcript}
  interimTranscript={interimTranscript}
  isListening={isListening}
/>
```

## Integration with SessionView

### Step 1: Import Hooks and Components

```typescript
import { useVoiceRecognition, useVoiceSynthesis } from '../hooks';
import { VoiceButton } from './VoiceButton';
import { LiveTranscriptDisplay } from './LiveTranscriptDisplay';
```

### Step 2: Initialize Hooks

```typescript
const { isListening, transcript, interimTranscript, error, startListening, stopListening } = 
  useVoiceRecognition({
    onTranscript: (text) => {
      void handleSubmit(text);
    },
    language: 'en-GB',
    silenceThresholdMs: 1500,
    autoSendOnSilence: true,
  });

const { isSpeaking, speak, stop: stopSpeaking } = useVoiceSynthesis({
  rate: 0.95,
  pitch: 1.0,
  voice: null, // Can be set from user preference
});
```

### Step 3: Add to JSX

```typescript
{/* Input controls row */}
<div className="flex gap-2 items-stretch">
  {/* Voice Button */}
  <VoiceButton
    isListening={isListening}
    disabled={submitting || isSpeaking}
    onStart={startListening}
    onStop={stopListening}
    error={error}
  />

  {/* Input with transcript overlay */}
  <div className="flex-1 relative">
    <LiveTranscriptDisplay
      transcript={transcript}
      interimTranscript={interimTranscript}
      isListening={isListening}
    />
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      // ... other props
    />
  </div>
</div>
```

## Key Features

### ✅ Memory Management
- Proper cleanup of event listeners
- Timeout cleanup on component unmount
- No memory leaks from speech synthesis

### ✅ Error Handling
- Browser compatibility detection
- Microphone permission errors
- Network error handling
- Graceful fallbacks

### ✅ Mobile Safari Support
- User gesture detection (if needed)
- Proper event handling for iOS
- Fallback for limited Web Speech API support

### ✅ Auto-Submit on Silence
- Configurable silence threshold
- Automatic transcript submission
- Visual feedback during listening

### ✅ Interim Results
- Shows in-progress speech
- Better UX feedback
- Clear distinction from final transcript

### ✅ Speech Synthesis Queue
- Graceful pause before cancellation
- Proper state management
- No jarring interruptions

## Browser Support

| Browser | Recognition | Synthesis |
|---------|-------------|-----------|
| Chrome  | ✅ Full     | ✅ Full   |
| Edge    | ✅ Full     | ✅ Full   |
| Safari  | ✅ Full     | ✅ Full   |
| Firefox | ⚠️ Limited  | ✅ Full   |

## Type Safety

All code follows your strict TypeScript rules:
- ✅ No `any` types
- ✅ No type assertions without validation
- ✅ Explicit error handling
- ✅ Proper interface definitions
- ✅ Full type inference where possible

## Testing

### Test Voice Recognition
```typescript
const { startListening, stopListening, transcript } = useVoiceRecognition({
  onTranscript: (text) => console.log('Transcript:', text),
});

startListening();
// Speak into microphone
stopListening();
```

### Test Voice Synthesis
```typescript
const { speak, stop } = useVoiceSynthesis();

speak("Testing voice synthesis");
// After 3 seconds:
stop();
```

## Future Enhancements

1. **Voice Preferences Storage**
   - Save selected voice to localStorage
   - Remember speech rate/pitch settings

2. **Voice Selection UI**
   - Modal for voice selection
   - Voice preview/testing

3. **Analytics**
   - Track voice feature usage
   - Monitor error rates

4. **Accessibility**
   - ARIA labels for screen readers
   - Keyboard shortcuts for voice control

5. **Advanced Features**
   - Multiple language support
   - Voice commands
   - Transcription history

## Troubleshooting

### "Voice input not supported"
- Check browser compatibility
- Ensure HTTPS (required for Web Speech API)
- Try Chrome or Edge

### Microphone not working
- Check browser permissions
- Ensure microphone is not in use by another app
- Try reloading the page

### Speech synthesis not working
- Check browser support
- Ensure volume is not muted
- Try different voice selection

## References

- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechRecognition - MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [SpeechSynthesis - MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
