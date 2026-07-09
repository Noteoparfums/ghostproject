import { generateCopyBank } from '../engine/copyBanks.js';
export class MockAIAdapter {
    async generate(brief, type, tone, bannedWords) {
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
    async stream(brief, type, tone, bannedWords, onChunk) {
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
//# sourceMappingURL=ai.adapter.js.map