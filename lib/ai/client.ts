import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function convertMessagesToPrompt(messages: ChatMessage[]): string {
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

export async function chat(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  const client = getGeminiClient();
  const modelName = options?.model || 'gemini-2.5-flash';
  
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 500,
    },
  });

  const prompt = convertMessagesToPrompt(messages);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function chatStream(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<void> {
  const client = getGeminiClient();
  const modelName = options?.model || 'gemini-2.5-flash';
  
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 500,
    },
  });

  const prompt = convertMessagesToPrompt(messages);
  const result = await model.generateContentStream(prompt);
  
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      onChunk(text);
    }
  }
}
