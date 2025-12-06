import { Request, Response } from 'express';
import { DriverService } from '../services/DriverService';

const service = new DriverService();

export class DriverController {
  async findAll(req: Request, res: Response) {
    try {
      const drivers = await service.findAll();
      return res.json(drivers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const driver = await service.findById(id);

      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      return res.json(driver);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const driver = await service.create(req.body);
      return res.status(201).json(driver);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const driver = await service.update(id, req.body);
      return res.json(driver);
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

  async getViolatorsByPoints(req: Request, res: Response) {
    try {
      const violators = await service.getViolatorsByPoints();
      return res.json(violators);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

