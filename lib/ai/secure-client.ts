// Secure AI client with guard rails and multi-provider support

import { LLMRouter, LLMMessage, ProviderType } from '../llm/provider';
import { GeminiProvider } from '../llm/gemini-provider';
import { HuggingFaceProvider } from '../llm/huggingface-provider';
import { getContentFilter } from '../guardrails/content-filter';
import { getRateLimiter } from '../guardrails/rate-limiter';

export interface SecureClientConfig {
  geminiApiKey?: string;
  huggingfaceApiKey?: string;
  primaryProvider?: ProviderType;
  enableGuardRails?: boolean;
  enableRateLimiting?: boolean;
}

export class SecureAIClient {
  private router: LLMRouter;
  private contentFilter = getContentFilter();
  private rateLimiter = getRateLimiter();
  private config: SecureClientConfig;

  constructor(config: SecureClientConfig) {
    this.config = {
      enableGuardRails: true,
      enableRateLimiting: true,
      ...config,
    };

    // Initialize router with fallback strategy
    // Gemini primary (fast, reliable), HuggingFace secondary (free, good quality)
    this.router = new LLMRouter({
      primary: config.primaryProvider || 'gemini',
      fallback: ['huggingface'], // HuggingFace as secondary/fallback
      costThreshold: 0.01, // Max $0.01 per request
    });

    // Register providers
    // Only register HuggingFace if explicitly enabled (to avoid module errors)
    if (config.huggingfaceApiKey && process.env.ENABLE_HUGGINGFACE === 'true') {
      try {
        this.router.registerProvider(
          'huggingface',
          new HuggingFaceProvider(config.huggingfaceApiKey)
        );
      } catch (error) {
        console.warn('HuggingFace provider not available, using Gemini only');
      }
    }

    if (config.geminiApiKey) {
      this.router.registerProvider(
        'gemini',
        new GeminiProvider(config.geminiApiKey)
      );
    }
  }

  async chat(
    messages: LLMMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      studentId?: string;
      skipGuardRails?: boolean;
    }
  ): Promise<string> {
    // Rate limiting check
    if (this.config.enableRateLimiting && options?.studentId) {
      const rateCheck = this.rateLimiter.checkLimit(options.studentId, 'minute');
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason || 'Rate limit exceeded');
      }
    }

    // Content filtering on user messages
    if (this.config.enableGuardRails && !options?.skipGuardRails) {
      const userMessages = messages.filter(m => m.role === 'user');
      for (const msg of userMessages) {
        const sanitized = this.contentFilter.sanitizeInput(msg.content);
        msg.content = sanitized;

        const inputCheck = this.contentFilter.checkUserInput(msg.content);
        if (!inputCheck.allowed) {
          throw new Error(`Content filter: ${inputCheck.reason}`);
        }
      }
    }

    // Call LLM
    const response = await this.router.chat(messages, {
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });

    // Content filtering on AI response (lenient for teacher responses)
    if (this.config.enableGuardRails && !options?.skipGuardRails) {
      const responseCheck = this.contentFilter.checkAIResponse(response.text);
      if (!responseCheck.allowed) {
        // Only block high severity issues (inappropriate content)
        // Allow medium severity (educational check) for teacher context
        if (responseCheck.severity === 'high') {
          console.error('AI response blocked:', responseCheck.reason);
          return 'I apologize, but I cannot provide that response. Let me help you with your studies instead.';
        } else {
          // Log but allow medium severity (likely false positive for greetings/encouragement)
          console.warn('AI response flagged but allowed:', responseCheck.reason);
        }
      }
    }

    return response.text;
  }

  getTotalCost(): number {
    return this.router.getTotalCost();
  }

  resetCost(): void {
    this.router.resetCost();
  }

  getProviderStatus() {
    return this.router.getProviderStatus();
  }
}

// Singleton instance
let secureClient: SecureAIClient | null = null;

export function getSecureAIClient(): SecureAIClient {
  if (!secureClient) {
    secureClient = new SecureAIClient({
      geminiApiKey: process.env.GEMINI_API_KEY,
      huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
      primaryProvider: (process.env.PRIMARY_LLM_PROVIDER as ProviderType) || 'huggingface',
      enableGuardRails: process.env.ENABLE_GUARDRAILS !== 'false',
      enableRateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
    });
  }
  return secureClient;
}
