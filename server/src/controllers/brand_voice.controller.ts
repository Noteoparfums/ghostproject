import type { Request, Response } from 'express';
import { brandVoiceService } from '../services/brand_voice.service.js';

export const brandVoiceController = {
  async list(req: Request, res: Response) {
    const userId = req.user!.id;
    const result = await brandVoiceService.list(userId);
    res.json({ data: result });
  },

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const data = req.body;

    const voice = await brandVoiceService.create({
      userId,
      name: data.name,
      toneSliders: data.tone_sliders,
      sampleTexts: data.sample_texts ? data.sample_texts.join('\n') : '',
      bannedWords: data.banned_words || [],
      styleSummary: '' // Generated asynchronously in production
    });

    res.status(201).json({ data: voice });
  },

  async get(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const voice = await brandVoiceService.getById(id, userId);
    res.json({ data: voice });
  },

  async update(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const data = req.body;

    const voice = await brandVoiceService.update(id, userId, {
      name: data.name,
      toneSliders: data.tone_sliders,
      sampleTexts: data.sample_texts ? data.sample_texts.join('\n') : undefined,
      bannedWords: data.banned_words
    });

    res.json({ data: voice });
  },

  async delete(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await brandVoiceService.delete(id, userId);
    res.status(204).send();
  }
};
