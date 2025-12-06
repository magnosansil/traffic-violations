import { Request, Response } from 'express';
import { TrafficViolationService } from '../services/TrafficViolationService';

const service = new TrafficViolationService();

export class TrafficViolationController {
  async findAll(req: Request, res: Response) {
    try {
      const violations = await service.findAll();
      return res.json(violations);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const violation = await service.findById(id);

      if (!violation) {
        return res.status(404).json({ error: 'Traffic violation not found' });
      }

      return res.json(violation);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const violation = await service.create(req.body);
      return res.status(201).json(violation);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const violation = await service.update(id, req.body);
      return res.json(violation);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getDetailedList(req: Request, res: Response) {
    try {
      const violations = await service.getDetailedList();
      return res.json(violations);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

