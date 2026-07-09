import type { FunnelType } from '@ghostwriter/shared';
export interface Brief {
    product: string;
    audience: string;
    tone: string;
    offer: string;
    awareness: number;
}
export interface GeneratedAsset {
    asset_type: string;
    label: string;
    content: string;
    framework_note: string;
}
export declare function generateCopyBank(briefRaw: string, assetType: string): string;
export declare function buildAssets(funnel: FunnelType, brief: Brief): GeneratedAsset[];
export declare function buildBrief(product: string, audience: string, tone: string): Brief;
//# sourceMappingURL=copyBanks.d.ts.map