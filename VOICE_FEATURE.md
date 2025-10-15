# Voice Feature Documentation

## Overview
CoachFlux now includes a **free voice interaction feature** that allows users to:
- **Speak their responses** instead of typing (Speech-to-Text)
- **Hear coach responses** in a selected voice (Text-to-Speech)

## Technology Stack
- **Web Speech API** (built into Chrome/Edge browsers)
- **Zero cost** - no API keys or subscriptions required
- **Client-side processing** - works entirely in the browser

## Features

### 1. Speech-to-Text (Voice Input) ✨ NEW
- Click the **microphone button** to start recording
- Speak your response naturally
- **Real-time transcription** - see your words appear as you speak
- **Auto-send on silence** - automatically sends after 1.5 seconds of silence
- Or click the button again to manually stop and send
- Transcript appears in an overlay above the input box

### 2. Text-to-Speech (Coach Voice)
- Coach responses are automatically spoken aloud
- **Auto-play toggle** (🔊/🔇) in the header to enable/disable
- **Stop speaking button** appears when coach is talking
- Adjustable speaking rate for clarity

### 3. Voice Selection
- Click the **🎙️ button** in the header to open voice settings
- Choose from available system voices
- Test each voice before selecting
- Preference is saved in browser localStorage

## User Interface

### Header Controls
- **🎙️ Voice Settings** - Opens voice selection modal
- **🔊/🔇 Auto-play** - Toggle automatic voice playback of coach responses

### Input Area Controls
- **Microphone button** (left side)
  - Blue when ready
  - Red and pulsing when recording
- **Stop speaking button** (appears when coach is talking)
  - Orange button to interrupt coach voice

### Voice Settings Modal
- Lists all available English voices on the system
- Shows voice details (name, language, local/online)
- **Test button** to preview each voice
- Click any voice to select it
- Selection is automatically saved

## Browser Compatibility

### Fully Supported
- ✅ **Google Chrome** (desktop & mobile)
- ✅ **Microsoft Edge** (desktop & mobile)
- ✅ **Safari** (limited voice selection)

### Not Supported
- ❌ Firefox (no Web Speech API support)
- ❌ Older browsers

## Available Voices

Voices depend on the user's operating system:

### Windows
- Microsoft David (Male, US)
- Microsoft Zira (Female, US)
- Microsoft Mark (Male, UK)
- Microsoft Hazel (Female, UK)
- Additional language voices

### macOS
- Alex, Samantha, Victoria, etc.
- Generally higher quality than Windows voices

### Android/iOS
- System voices vary by device
- Usually includes Google/Apple voices

## Privacy & Data

- **All processing happens locally** in the browser
- **No data sent to external servers** for voice processing
- Voice preference stored in browser localStorage only
- Completely free with no tracking

## Technical Implementation

### Components Created
1. **VoiceControl.tsx** - Main voice control hook and components
   - `VoiceControl()` - Hook for managing STT/TTS
   - `VoiceButtons` - UI buttons for voice controls
   - `VoiceSettingsModal` - Voice selection interface

2. **SessionView.tsx** - Integrated voice controls
   - Voice buttons in input area
   - Voice settings in header
   - Auto-play coach responses
   - Persistent voice preferences

### Key Features
- **Auto-play coach responses** - Automatically speaks coach_reflection text
- **Transcript to input** - Voice input populates text field
- **Voice persistence** - Remembers selected voice across sessions
- **Error handling** - Graceful fallbacks for unsupported browsers
- **Accessibility** - All buttons have proper titles and ARIA labels

## Usage Instructions

### For Users

1. **Enable Voice Input**
   - Click the microphone button
   - Allow microphone access when prompted
   - Speak your response
   - Click again to stop recording

2. **Select Coach Voice**
   - Click 🎙️ in the header
   - Browse available voices
   - Click "Test" to hear each voice
   - Click on a voice to select it
   - Click "Done"

3. **Control Auto-play**
   - Click 🔊 to enable auto-play (coach speaks automatically)
   - Click 🔇 to disable auto-play (silent mode)
   - Use the stop button to interrupt coach mid-speech

### For Developers

#### Voice Control Hook
```typescript
const voiceControl = VoiceControl({
  onTranscript: (text) => setText(text),
  disabled: submitting,
  selectedVoice: selectedVoice,
});

// Access properties
voiceControl.isListening
voiceControl.isSpeaking
voiceControl.transcript
voiceControl.error

// Methods
voiceControl.startListening()
voiceControl.stopListening()
voiceControl.speak(text)
voiceControl.stopSpeaking()
```

#### Voice Buttons Component
```typescript
<VoiceButtons
  onStartListening={voiceControl.startListening}
  onStopListening={voiceControl.stopListening}
  onStopSpeaking={voiceControl.stopSpeaking}
  isListening={voiceControl.isListening}
  isSpeaking={voiceControl.isSpeaking}
  disabled={submitting}
  error={voiceControl.error}
/>
```

## Future Enhancements (Optional)

### Phase 2 - Self-Hosted Models
If you want better voice quality in the future:

1. **Whisper.cpp** for STT
   - Better accuracy
   - Works offline
   - Requires hosting

2. **Piper TTS** for TTS
   - Natural-sounding voices
   - Multiple accents
   - ~20MB per voice model

3. **Hosting Options**
   - Hugging Face Spaces (free tier)
   - Render (free tier)
   - User's local machine

## Troubleshooting

### "Voice input not supported"
- Use Chrome or Edge browser
- Update browser to latest version

### "Microphone access denied"
- Check browser permissions
- Allow microphone access in browser settings
- Check system microphone permissions

### "No voices available"
- Wait a moment for voices to load
- Refresh the page
- Check system text-to-speech settings

### Voice quality issues
- Try different voices in settings
- Check system volume
- macOS voices generally sound better than Windows

## Cost Analysis

| Feature | Cost |
|---------|------|
| Speech-to-Text | **FREE** (Web Speech API) |
| Text-to-Speech | **FREE** (Web Speech API) |
| Voice Storage | **FREE** (localStorage) |
| Hosting | **FREE** (client-side) |
| **Total** | **$0/month** |

## Conclusion

This voice feature provides a professional coaching experience at **zero cost**, making CoachFlux accessible to everyone. The Web Speech API is mature, reliable, and works seamlessly in modern browsers.

Perfect for a hobby project that you're giving away for free! 🎉
