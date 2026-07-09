import { type TransactionConnection } from '../lib/db.js';
export interface BrandVoiceRow {
    id: number;
    user_id: number;
    name: string;
    tone_sliders: any;
    sample_texts: string;
    banned_words: any;
    style_summary: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare const brandVoiceRepository: {
    create(data: {
        userId: number;
        name: string;
        toneSliders: any;
        sampleTexts: string;
        bannedWords: any;
        styleSummary: string;
    }, tx?: TransactionConnection): Promise<BrandVoiceRow>;
    findById(id: number, tx?: TransactionConnection): Promise<BrandVoiceRow | null>;
    update(id: number, updates: {
        name?: string;
        toneSliders?: any;
        sampleTexts?: string;
        bannedWords?: any;
        styleSummary?: string;
    }, tx?: TransactionConnection): Promise<void>;
    delete(id: number, tx?: TransactionConnection): Promise<void>;
    list(userId: number, tx?: TransactionConnection): Promise<BrandVoiceRow[]>;
};
//# sourceMappingURL=brand_voice.repository.d.ts.map