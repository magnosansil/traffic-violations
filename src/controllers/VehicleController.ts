import { Request, Response } from 'express';
import { VehicleService } from '../services/VehicleService';
import { VehicleSpecies } from '@prisma/client';

const service = new VehicleService();

export class VehicleController {
  async findAll(req: Request, res: Response) {
    try {
      const vehicles = await service.findAll();
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await service.findById(id);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.json(vehicle);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findBySpecies(req: Request, res: Response) {
    try {
      const { species } = req.params;

      // Validate species
      if (!Object.values(VehicleSpecies).includes(species as VehicleSpecies)) {
        return res.status(400).json({ error: 'Invalid vehicle species' });
      }

      const vehicles = await service.findBySpecies(species as VehicleSpecies);
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const vehicle = await service.create(req.body);
      return res.status(201).json(vehicle);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await service.update(id, req.body);
      return res.json(vehicle);
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

