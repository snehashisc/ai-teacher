// LLM Provider abstraction layer for cost optimization

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  provider: string;
  model: string;
  tokensUsed?: number;
  cost?: number;
}

export interface LLMProvider {
  name: string;
  chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;
  isAvailable(): Promise<boolean>;
  estimateCost(messages: LLMMessage[]): number;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export type ProviderType = 'gemini' | 'huggingface' | 'local';

export interface ProviderConfig {
  primary: ProviderType;
  fallback: ProviderType[];
  costThreshold?: number; // Max cost per request in USD
}

/**
 * LLM Router - intelligently routes requests to best provider
 */
export class LLMRouter {
  private providers: Map<ProviderType, LLMProvider> = new Map();
  private config: ProviderConfig;
  private totalCost: number = 0;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  registerProvider(type: ProviderType, provider: LLMProvider): void {
    this.providers.set(type, provider);
  }

  async chat(
    messages: LLMMessage[],
    options?: LLMOptions & { forceProvider?: ProviderType }
  ): Promise<LLMResponse> {
    // If specific provider requested
    if (options?.forceProvider) {
      const provider = this.providers.get(options.forceProvider);
      if (provider) {
        return this.executeWithProvider(provider, messages, options);
      }
    }

    // Try primary provider
    const primaryProvider = this.providers.get(this.config.primary);
    if (primaryProvider && await primaryProvider.isAvailable()) {
      const estimatedCost = primaryProvider.estimateCost(messages);
      
      // Check cost threshold
      if (!this.config.costThreshold || estimatedCost <= this.config.costThreshold) {
        try {
          return await this.executeWithProvider(primaryProvider, messages, options);
        } catch (error) {
          console.error(`Primary provider ${this.config.primary} failed:`, error);
        }
      } else {
        console.log(`Primary provider too expensive ($${estimatedCost}), trying fallback`);
      }
    }

    // Try fallback providers
    for (const fallbackType of this.config.fallback) {
      const fallbackProvider = this.providers.get(fallbackType);
      if (fallbackProvider && await fallbackProvider.isAvailable()) {
        try {
          return await this.executeWithProvider(fallbackProvider, messages, options);
        } catch (error) {
          console.error(`Fallback provider ${fallbackType} failed:`, error);
        }
      }
    }

    throw new Error('All LLM providers failed or unavailable');
  }

  private async executeWithProvider(
    provider: LLMProvider,
    messages: LLMMessage[],
    options?: LLMOptions
  ): Promise<LLMResponse> {
    const response = await provider.chat(messages, options);
    
    // Track cost
    if (response.cost) {
      this.totalCost += response.cost;
    }

    return response;
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  resetCost(): void {
    this.totalCost = 0;
  }

  getProviderStatus(): Record<ProviderType, boolean> {
    const status: any = {};
    for (const [type, provider] of this.providers.entries()) {
      provider.isAvailable().then(available => {
        status[type] = available;
      });
    }
    return status;
  }
}
