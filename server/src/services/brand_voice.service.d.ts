export declare const brandVoiceService: {
    create(data: {
        userId: number;
        name: string;
        toneSliders: any;
        sampleTexts: string;
        bannedWords: any;
        styleSummary: string;
    }): Promise<import("../repositories/brand_voice.repository.js").BrandVoiceRow>;
    getById(id: number, userId: number): Promise<import("../repositories/brand_voice.repository.js").BrandVoiceRow>;
    update(id: number, userId: number, updates: {
        name?: string;
        toneSliders?: any;
        sampleTexts?: string;
        bannedWords?: any;
        styleSummary?: string;
    }): Promise<import("../repositories/brand_voice.repository.js").BrandVoiceRow>;
    delete(id: number, userId: number): Promise<void>;
    list(userId: number): Promise<import("../repositories/brand_voice.repository.js").BrandVoiceRow[]>;
};
//# sourceMappingURL=brand_voice.service.d.ts.map