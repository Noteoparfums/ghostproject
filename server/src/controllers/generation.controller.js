import { generationService } from '../services/generation.service.js';
import { generationRepository, generatedAssetRepository } from '../repositories/generation.repository.js';
import { generateSchema, regenerateSectionSchema } from '@ghostwriter/shared';
import { AppError } from '../lib/errors.js';
export const generationController = {
    async generate(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const data = generateSchema.parse(req.body);
        // startGeneration expects to take over the response stream
        const payload = {
            projectId: data.project_id || undefined,
            brandVoiceId: data.brand_voice_id || undefined,
            funnelType: data.funnel_type,
            brief: data.product,
            targetAudience: data.audience
        };
        await generationService.startGeneration(req.user.id, payload, res);
    },
    async regenerateSection(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const assetId = parseInt(req.params.assetId || '0', 10);
        const data = regenerateSectionSchema.parse(req.body);
        const newAsset = await generationService.regenerateSection(req.user.id, assetId, data.instruction || '');
        res.json({ data: newAsset });
    },
    async listGenerations(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const page = parseInt(req.query.page || '1', 10);
        const perPage = parseInt(req.query.per_page || '20', 10);
        const result = await generationRepository.listByUser(req.user.id, page, perPage);
        res.json(result);
    },
    async listAssetsForProject(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const projectId = parseInt(req.params.projectId || '0', 10);
        // In a real app we should check if user owns project
        const assets = await generatedAssetRepository.listByProject(projectId);
        res.json({ data: assets });
    },
    async updateAsset(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const assetId = parseInt(req.params.assetId || '0', 10);
        // check ownership...
        const asset = await generatedAssetRepository.findById(assetId);
        if (!asset || asset.user_id !== req.user.id) {
            throw new AppError('NOT_FOUND', 'Asset not found');
        }
        const { content, is_favorited } = req.body;
        if (content !== undefined) {
            await generatedAssetRepository.updateContent(assetId, content);
        }
        if (is_favorited !== undefined) {
            await generatedAssetRepository.toggleFavorite(assetId, is_favorited);
        }
        res.json({ data: await generatedAssetRepository.findById(assetId) });
    }
};
//# sourceMappingURL=generation.controller.js.map