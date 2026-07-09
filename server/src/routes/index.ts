import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import brandVoiceRoutes from './brand_voice.routes.js';
import generationRoutes from './generation.routes.js';
import billingRoutes from './billing.routes.js';
import webhookRoutes from './webhook.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/brand-voices', brandVoiceRoutes);
apiRouter.use('/generate', generationRoutes);
apiRouter.use('/billing', billingRoutes);
apiRouter.use('/webhooks', webhookRoutes);
