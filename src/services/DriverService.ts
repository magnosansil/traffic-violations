import prisma from '../db/prisma';
import { Gender } from '@prisma/client';

export interface CreateDriverDto {
  name: string;
  gender: Gender;
  birthDate: Date | string;
  licenseNumber: string;
  licenseValidity: Date | string;
}

export interface UpdateDriverDto {
  name?: string;
  gender?: Gender;
  birthDate?: Date | string;
  licenseNumber?: string;
  licenseValidity?: Date | string;
}

export class DriverService {
  async findAll() {
    return prisma.driver.findMany({
      include: {
        ownedVehicles: true,
        trafficViolations: {
          include: {
            violationType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.driver.findUnique({
      where: { id },
      include: {
        ownedVehicles: true,
        trafficViolations: {
          include: {
            violationType: true,
            vehicle: true,
          },
        },
      },
    });
  }

  async findByLicenseNumber(licenseNumber: string) {
    return prisma.driver.findUnique({
      where: { licenseNumber },
    });
  }

  async create(data: CreateDriverDto) {
    // Check if license number already exists
    const existingDriver = await this.findByLicenseNumber(data.licenseNumber);
    if (existingDriver) {
      throw new Error('Driver with this license number already exists');
    }

    return prisma.driver.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        licenseValidity: new Date(data.licenseValidity),
      },
    });
  }

  async update(id: string, data: UpdateDriverDto) {
    // If updating license number, check if it's already in use
    if (data.licenseNumber) {
      const existingDriver = await this.findByLicenseNumber(data.licenseNumber);
      if (existingDriver && existingDriver.id !== id) {
        throw new Error('Driver with this license number already exists');
      }
    }

    const updateData: any = { ...data };
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }
    if (data.licenseValidity) {
      updateData.licenseValidity = new Date(data.licenseValidity);
    }

    return prisma.driver.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.driver.delete({
      where: { id },
    });
  }

  async getViolatorsByPoints() {
    const drivers = await prisma.driver.findMany({
      include: {
        trafficViolations: {
          include: {
            violationType: true,
          },
        },
      },
    });

    const driversWithPoints = drivers.map((driver) => {
      const totalPoints = driver.trafficViolations.reduce(
        (sum, violation) => sum + violation.violationType.points,
        0
      );
      return {
        ...driver,
        totalPoints,
      };
    });

    return driversWithPoints
      .filter((driver) => driver.totalPoints > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }
}

