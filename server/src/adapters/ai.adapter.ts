import { generateCopyBank } from '../engine/copyBanks.js';
import { env } from '../config/env.js';

export interface AIProviderInfo {
  provider: string;
  model: string;
  tokensUsed: number;
}

export interface AIResult {
  content: string;
  providerInfo: AIProviderInfo;
}

export interface AIAdapter {
  generate(brief: string, type: string, tone: any, bannedWords: string[]): Promise<AIResult>;
  stream(brief: string, type: string, tone: any, bannedWords: string[], onChunk: (text: string) => void): Promise<AIProviderInfo>;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_FALLBACK_MODELS = ['openai/gpt-oss-120b', 'llama-3.1-8b-instant'];

function modelCandidates(): string[] {
  const fallbacks = env.AI_FALLBACK_MODELS
    ?.split(',')
    .map((model) => model.trim())
    .filter(Boolean) ?? DEFAULT_FALLBACK_MODELS;

  return [...new Set([env.AI_MODEL ?? DEFAULT_GROQ_MODEL, ...fallbacks])];
}

function systemPrompt(type: string, tone: unknown, bannedWords: string[]): string {
  const banned = bannedWords.length > 0
    ? `Never use these words or phrases: ${bannedWords.join(', ')}.`
    : '';

  return [
    'You are an elite direct-response copywriter.',
    `Write only the final ${type.replace(/_/g, ' ')} copy, without commentary or meta-explanations.`,
    `Use a ${String(tone || 'direct')} tone.`,
    'Make the copy specific, persuasive, credible, clear, and conversion-focused.',
    'Do not invent testimonials, statistics, guarantees, or unverifiable claims.',
    'Preserve useful formatting with headings, bullets, and calls to action where appropriate.',
    banned,
  ].filter(Boolean).join(' ');
}

function userPrompt(brief: string, type: string): string {
  return `Create the ${type.replace(/_/g, ' ')} for this campaign brief:\n\n${brief}`;
}

function isRetryableStatus(status: number): boolean {
  return status === 400 || status === 404 || status === 408 || status === 429 || status >= 500;
}

export class GroqAIAdapter implements AIAdapter {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(model: string, brief: string, type: string, tone: unknown, bannedWords: string[], stream: boolean) {
    return fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt(type, tone, bannedWords) },
          { role: 'user', content: userPrompt(brief, type) },
        ],
        temperature: 0.72,
        top_p: 0.92,
        max_completion_tokens: type.includes('script') || type.includes('page') ? 4096 : 2048,
        stream,
      }),
      signal: AbortSignal.timeout(90_000),
    });
  }

  async generate(brief: string, type: string, tone: unknown, bannedWords: string[]): Promise<AIResult> {
    let lastError: Error | null = null;

    for (const model of modelCandidates()) {
      try {
        const response = await this.request(model, brief, type, tone, bannedWords, false);
        if (!response.ok) {
          const message = await response.text();
          lastError = new Error(`Groq request failed (${response.status}): ${message.slice(0, 300)}`);
          if (isRetryableStatus(response.status)) continue;
          throw lastError;
        }

        const data = await response.json() as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { total_tokens?: number };
        };
        const content = data.choices?.[0]?.message?.content?.trim();
        if (!content) {
          lastError = new Error(`Groq model ${model} returned empty content`);
          continue;
        }

        return {
          content,
          providerInfo: {
            provider: 'groq',
            model,
            tokensUsed: data.usage?.total_tokens ?? Math.ceil(content.length / 4),
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown Groq error');
      }
    }

    throw lastError ?? new Error('No Groq model was available');
  }

  async stream(
    brief: string,
    type: string,
    tone: unknown,
    bannedWords: string[],
    onChunk: (text: string) => void,
  ): Promise<AIProviderInfo> {
    let lastError: Error | null = null;

    for (const model of modelCandidates()) {
      try {
        const response = await this.request(model, brief, type, tone, bannedWords, true);
        if (!response.ok || !response.body) {
          const message = await response.text();
          lastError = new Error(`Groq stream failed (${response.status}): ${message.slice(0, 300)}`);
          if (isRetryableStatus(response.status)) continue;
          throw lastError;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let contentLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === '[DONE]') continue;
            const data = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const chunk = data.choices?.[0]?.delta?.content;
            if (chunk) {
              contentLength += chunk.length;
              onChunk(chunk);
            }
          }
        }

        return {
          provider: 'groq',
          model,
          tokensUsed: Math.ceil(contentLength / 4),
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown Groq streaming error');
      }
    }

    throw lastError ?? new Error('No Groq model was available for streaming');
  }
}

export class MockAIAdapter implements AIAdapter {
  async generate(brief: string, type: string, tone: any, bannedWords: string[]): Promise<AIResult> {
    const content = generateCopyBank(brief, type);
    return {
      content,
      providerInfo: {
        provider: 'mock',
        model: 'ghost-1.0-mock',
        tokensUsed: content.length / 4 // rough estimate
      }
    };
  }

  async stream(brief: string, type: string, tone: any, bannedWords: string[], onChunk: (text: string) => void): Promise<AIProviderInfo> {
    const content = generateCopyBank(brief, type);
    
    // Simulate streaming by breaking into chunks and adding slight delays
    const chunks = content.split(' ');
    for (const chunk of chunks) {
      onChunk(chunk + ' ');
      await new Promise(r => setTimeout(r, 20)); // 20ms per word
    }

    return {
      provider: 'mock',
      model: 'ghost-1.0-mock',
      tokensUsed: content.length / 4
    };
  }
}

const groqApiKey = env.GROQ_API_KEY ?? env.AI_API_KEY;

export const aiAdapter: AIAdapter = env.AI_PROVIDER === 'groq' && groqApiKey
  ? new GroqAIAdapter(groqApiKey)
  : new MockAIAdapter();
