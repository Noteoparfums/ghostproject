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
export declare class GroqAIAdapter implements AIAdapter {
    private readonly apiKey;
    constructor(apiKey: string);
    private request;
    generate(brief: string, type: string, tone: unknown, bannedWords: string[]): Promise<AIResult>;
    stream(brief: string, type: string, tone: unknown, bannedWords: string[], onChunk: (text: string) => void): Promise<AIProviderInfo>;
}
export declare class MockAIAdapter implements AIAdapter {
    generate(brief: string, type: string, tone: any, bannedWords: string[]): Promise<AIResult>;
    stream(brief: string, type: string, tone: any, bannedWords: string[], onChunk: (text: string) => void): Promise<AIProviderInfo>;
}
export declare const aiAdapter: AIAdapter;
//# sourceMappingURL=ai.adapter.d.ts.map