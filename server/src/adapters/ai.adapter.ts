import { generateCopyBank } from '../engine/copyBanks.js';

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

export const aiAdapter = new MockAIAdapter();
