// Advanced voice features with real-time evaluation

export interface VoiceConfig {
  language: 'en-IN' | 'en-US' | 'hi-IN';
  teacherVoice: 'female' | 'male';
  speechRate: number;
  autoSpeak: boolean;
}

export class AdvancedSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private config: VoiceConfig;

  constructor(config: Partial<VoiceConfig> = {}) {
    this.config = {
      language: config.language || 'en-IN',
      teacherVoice: config.teacherVoice || 'female',
      speechRate: config.speechRate || 0.9,
      autoSpeak: config.autoSpeak ?? true,
    };

    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.initializeRecognition();
    }
  }

  private initializeRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true; // Get partial results
      this.recognition.lang = this.config.language;
      this.recognition.maxAlternatives = 3; // Get multiple interpretations
    }
  }

  // Enhanced speaking with emotion
  speakWithEmotion(
    text: string,
    emotion: 'neutral' | 'encouraging' | 'correcting' | 'excited'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Adjust voice based on emotion
      switch (emotion) {
        case 'encouraging':
          utterance.rate = 0.95;
          utterance.pitch = 1.1;
          break;
        case 'correcting':
          utterance.rate = 0.85;
          utterance.pitch = 0.95;
          break;
        case 'excited':
          utterance.rate = 1.0;
          utterance.pitch = 1.15;
          break;
        default:
          utterance.rate = this.config.speechRate;
          utterance.pitch = 1.0;
      }

      const voices = this.synthesis.getVoices();
      const preferredVoice = this.selectVoice(voices);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      this.synthesis.speak(utterance);
    });
  }

  private selectVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // Try to find Indian English voice first
    let voice = voices.find(v => 
      v.lang === 'en-IN' && v.name.toLowerCase().includes(this.config.teacherVoice)
    );

    // Fallback to any English voice with preferred gender
    if (!voice) {
      voice = voices.find(v => 
        v.lang.includes('en') && v.name.toLowerCase().includes(this.config.teacherVoice)
      );
    }

    // Fallback to any English voice
    if (!voice) {
      voice = voices.find(v => v.lang.includes('en'));
    }

    return voice || null;
  }

  // Listen with real-time transcription
  listenWithRealtime(
    onInterim: (transcript: string) => void,
    onFinal: (transcript: string, confidence: number) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) return;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal) {
          onFinal(transcript, confidence);
        } else {
          onInterim(transcript);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Could not understand. Please try again.';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please speak clearly.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not accessible. Please check permissions.';
      }
      
      onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError?.('Failed to start listening');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  // Update configuration
  updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.language && this.recognition) {
      this.recognition.lang = config.language;
    }
  }
}

// Check browser support
export function checkVoiceSupport(): {
  ttsSupported: boolean;
  sttSupported: boolean;
  message?: string;
} {
  if (typeof window === 'undefined') {
    return { ttsSupported: false, sttSupported: false };
  }

  const ttsSupported = 'speechSynthesis' in window;
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const sttSupported = !!SpeechRecognition;

  let message;
  if (!ttsSupported && !sttSupported) {
    message = 'Voice features not supported in this browser. Try Chrome or Edge.';
  } else if (!sttSupported) {
    message = 'Voice input not supported. Teacher can still speak to you!';
  }

  return { ttsSupported, sttSupported, message };
}
