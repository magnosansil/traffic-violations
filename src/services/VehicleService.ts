import prisma from '../db/prisma';
import { VehicleSpecies } from '@prisma/client';

export interface CreateVehicleDto {
  plate: string;
  species: VehicleSpecies;
  brand: string;
  model: string;
  ownerId?: string | null;
}

export interface UpdateVehicleDto {
  plate?: string;
  species?: VehicleSpecies;
  brand?: string;
  model?: string;
  ownerId?: string | null;
}

export class VehicleService {
  async findAll() {
    return prisma.vehicle.findMany({
      include: {
        owner: true,
        violations: {
          include: {
            violationType: true,
            driver: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        owner: true,
        violations: {
          include: {
            violationType: true,
            driver: true,
          },
        },
      },
    });
  }

  async findByPlate(plate: string) {
    return prisma.vehicle.findUnique({
      where: { plate },
    });
  }

  async findBySpecies(species: VehicleSpecies) {
    return prisma.vehicle.findMany({
      where: { species },
      include: {
        owner: true,
        violations: {
          include: {
            violationType: true,
            driver: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateVehicleDto) {
    // Check if plate already exists
    const existingVehicle = await this.findByPlate(data.plate);
    if (existingVehicle) {
      throw new Error('Já existe cadastro de veículo com esta placa.');
    }

    // If ownerId is provided, verify it exists
    if (data.ownerId) {
      const owner = await prisma.driver.findUnique({
        where: { id: data.ownerId },
      });
      if (!owner) {
        throw new Error('Proprietário não encontrado!');
      }
    }

    return prisma.vehicle.create({
      data: {
        ...data,
        ownerId: data.ownerId || null,
      },
      include: {
        owner: true,
      },
    });
  }

  async update(id: string, data: UpdateVehicleDto) {
    // If updating plate, check if it's already in use
    if (data.plate) {
      const existingVehicle = await this.findByPlate(data.plate);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new Error('Já existe cadastro de veículo com esta placa.');
      }
    }

    // If ownerId is provided, verify it exists
    if (data.ownerId !== undefined) {
      if (data.ownerId) {
        const owner = await prisma.driver.findUnique({
          where: { id: data.ownerId },
        });
        if (!owner) {
          throw new Error('Proprietário não encontrado!');
        }
      }
    }

    return prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        ownerId: data.ownerId === null ? null : data.ownerId,
      },
      include: {
        owner: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}

