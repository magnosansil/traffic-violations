import { Request, Response } from 'express';
import { TrafficViolationTypeService } from '../services/TrafficViolationTypeService';

const service = new TrafficViolationTypeService();

export class TrafficViolationTypeController {
  async findAll(req: Request, res: Response) {
    try {
      const types = await service.findAll();
      return res.json(types);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const type = await service.findById(id);

      if (!type) {
        return res.status(404).json({ error: 'Traffic violation type not found' });
      }

      return res.json(type);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const type = await service.create(req.body);
      return res.status(201).json(type);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const type = await service.update(id, req.body);
      return res.json(type);
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
}

