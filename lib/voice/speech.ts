// Voice/Speech utilities for AI Teacher

export class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true; // Keep listening
        this.recognition.interimResults = true; // Show partial results
        this.recognition.lang = 'en-IN'; // Indian English
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  // Text-to-Speech: Teacher speaks
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    onEnd?: () => void;
  }): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = options?.rate ?? 0.9; // Slightly slower for clarity
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    
    // Try to use a female voice (sounds more like a teacher)
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('en') && v.name.includes('Female')
    ) || voices.find(v => v.lang.includes('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    this.synthesis.speak(utterance);
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  // Speech Recognition: Student speaks
  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onInterim?: (transcript: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      return;
    }

    let finalTranscript = '';
    let silenceTimer: NodeJS.Timeout | null = null;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results
      if (onInterim && interimTranscript) {
        onInterim(interimTranscript);
      }

      // Reset silence timer on new speech
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }

      // Auto-stop after 2 seconds of silence
      silenceTimer = setTimeout(() => {
        if (finalTranscript.trim()) {
          this.stopListening();
          onResult(finalTranscript.trim());
        }
      }, 2000);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      
      // Don't treat "no-speech" as an error, just stop
      if (event.error === 'no-speech') {
        this.isListening = false;
        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim());
        }
        return;
      }
      
      onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError?.('Failed to start listening');
    }
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() ?? [];
  }
}

// Singleton instance
let speechService: SpeechService | null = null;

export function getSpeechService(): SpeechService {
  if (!speechService) {
    speechService = new SpeechService();
  }
  return speechService;
}
