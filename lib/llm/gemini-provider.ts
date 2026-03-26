// Gemini LLM Provider

import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, LLMMessage, LLMResponse, LLMOptions } from './provider';

export class GeminiProvider implements LLMProvider {
  name = 'Gemini';
  private client: GoogleGenerativeAI | null = null;

  constructor(private apiKey: string) {
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('Gemini API key not configured');
    }

    const modelName = options?.model || 'gemini-2.5-flash';
    const model = this.client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 500,
      },
    });

    const prompt = this.convertMessages(messages);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = this.cleanResponse(response.text());

    // Estimate tokens (rough approximation)
    const tokensUsed = Math.ceil(text.length / 4);
    
    // Gemini pricing: $0.075 per 1M input tokens, $0.30 per 1M output tokens
    // For flash model, it's much cheaper (free tier available)
    const cost = modelName.includes('flash') ? 0 : (tokensUsed / 1000000) * 0.30;

    return {
      text,
      provider: 'gemini',
      model: modelName,
      tokensUsed,
      cost,
    };
  }

  async isAvailable(): Promise<boolean> {
    return this.client !== null;
  }

  estimateCost(messages: LLMMessage[]): number {
    // Gemini Flash is free tier, so cost is 0
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 4);
    
    // Free for flash model
    return 0;
  }

  private convertMessages(messages: LLMMessage[]): string {
    let prompt = '';
    
    for (const msg of messages) {
      if (msg.role === 'system') {
        prompt += `${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    }
    
    prompt += 'Assistant: ';
    return prompt;
  }

  private cleanResponse(text: string): string {
    let cleaned = text.trim();
    
    const unwantedPhrases = [
      /thinking phase/gi,
      /\[thinking\]/gi,
      /\[\/thinking\]/gi,
      /thinking:/gi,
      /^assistant:\s*/gi,
      /^user:\s*/gi,
    ];
    
    for (const phrase of unwantedPhrases) {
      cleaned = cleaned.replace(phrase, '');
    }
    
    const endMarkers = ['\n\nUser:', '\n\nAssistant:', '\nUser:', '\nAssistant:'];
    for (const marker of endMarkers) {
      const index = cleaned.indexOf(marker);
      if (index !== -1) {
        cleaned = cleaned.substring(0, index);
      }
    }
    
    return cleaned.trim();
  }
}
