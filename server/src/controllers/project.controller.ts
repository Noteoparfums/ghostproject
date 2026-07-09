import type { Request, Response } from 'express';
import { projectService } from '../services/project.service.js';

export const projectController = {
  async list(req: Request, res: Response) {
    const userId = req.user!.id;
    const { page, per_page, status } = req.query as any;

    const result = await projectService.list(userId, status, page, per_page);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const { name, description } = req.body;

    const project = await projectService.create(userId, name, description);
    res.status(201).json({ data: project });
  },

  async get(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const project = await projectService.getById(id, userId);
    res.json({ data: project });
  },

  async update(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const updates = req.body;

    const project = await projectService.update(id, userId, updates);
    res.json({ data: project });
  },

  async delete(req: Request, res: Response) {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await projectService.delete(id, userId);
    res.status(204).send();
  }
};
