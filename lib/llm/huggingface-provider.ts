// Hugging Face Inference Providers API (Free Tier)
// Uses official @huggingface/inference SDK

import { LLMProvider, LLMMessage, LLMResponse, LLMOptions } from './provider';

export class HuggingFaceProvider implements LLMProvider {
  name = 'HuggingFace';
  private apiKey: string;
  private client: any = null;

  // Free models available on HF Inference Providers
  private readonly DEFAULT_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';
  
  // Alternative free models:
  // - 'Qwen/Qwen2.5-Coder-32B-Instruct' (best for code and math)
  // - 'mistralai/Mistral-7B-Instruct-v0.3' (good general purpose)
  // - 'microsoft/Phi-3.5-mini-instruct' (fast, efficient)
  // - 'HuggingFaceH4/zephyr-7b-beta' (conversational)

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeClient();
  }

  private async initializeClient() {
    if (typeof window === 'undefined' && this.apiKey) {
      // Server-side only
      try {
        const { HfInference } = await import('@huggingface/inference');
        this.client = new HfInference(this.apiKey);
      } catch (error) {
        console.warn('HuggingFace SDK not available:', error);
        // Client will remain null, provider won't be used
      }
    }
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    // Ensure client is initialized
    if (!this.client) {
      await this.initializeClient();
    }

    if (!this.client) {
      throw new Error('HuggingFace SDK not available. Using fallback provider.');
    }

    const model = options?.model || this.DEFAULT_MODEL;
    
    try {
      // Convert to chat format
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Use HuggingFace Inference SDK
      const response = await this.client.chatCompletion({
        model: model,
        messages: formattedMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 500,
      });

      const text = response.choices?.[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || Math.ceil(text.length / 4);

      return {
        text: this.cleanResponse(text, ''),
        provider: 'huggingface',
        model,
        tokensUsed,
        cost: 0, // Free tier
      };
    } catch (error: any) {
      // If model is loading, provide helpful error
      if (error.message?.includes('loading') || error.message?.includes('503')) {
        throw new Error('HuggingFace model is loading. Please try again in 20-30 seconds.');
      }
      throw new Error(`HuggingFace API error: ${error.message}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      // Ensure client is initialized
      if (!this.client) {
        await this.initializeClient();
      }

      if (!this.client) return false;

      // Test with a simple request
      await this.client.chatCompletion({
        model: this.DEFAULT_MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      });

      return true;
    } catch (error: any) {
      // Model loading is considered "available" (will work soon)
      if (error.message?.includes('loading') || error.message?.includes('503')) {
        return true;
      }
      return false;
    }
  }

  estimateCost(messages: LLMMessage[]): number {
    // HuggingFace Inference API is free (with rate limits)
    return 0;
  }

  private cleanResponse(text: string, originalPrompt: string): string {
    let cleaned = text.trim();
    
    // Remove the original prompt if it's included
    if (cleaned.startsWith(originalPrompt)) {
      cleaned = cleaned.substring(originalPrompt.length).trim();
    }

    // Remove instruction markers
    cleaned = cleaned.replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/g, '').trim();

    // Remove common artifacts
    const unwantedPhrases = [
      /thinking phase/gi,
      /\[thinking\]/gi,
      /\[\/thinking\]/gi,
    ];
    
    for (const phrase of unwantedPhrases) {
      cleaned = cleaned.replace(phrase, '');
    }

    return cleaned.trim();
  }

  /**
   * Get list of recommended free models for education (2026)
   */
  static getRecommendedModels(): string[] {
    return [
      'meta-llama/Llama-3.2-3B-Instruct', // Fast, efficient, good for education
      'Qwen/Qwen2.5-Coder-32B-Instruct', // Best for code and math
      'mistralai/Mistral-7B-Instruct-v0.3', // General purpose, reliable
      'microsoft/Phi-3.5-mini-instruct', // Very fast, good quality
      'HuggingFaceH4/zephyr-7b-beta', // Conversational
    ];
  }
}
