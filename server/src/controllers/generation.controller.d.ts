import type { Request, Response } from 'express';
export declare const generationController: {
    generate(req: Request, res: Response): Promise<void>;
    regenerateSection(req: Request, res: Response): Promise<void>;
    listGenerations(req: Request, res: Response): Promise<void>;
    listAssetsForProject(req: Request, res: Response): Promise<void>;
    updateAsset(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=generation.controller.d.ts.map