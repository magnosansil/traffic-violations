import prisma from '../db/prisma';
import { ViolationLevel } from '@prisma/client';

export interface CreateTrafficViolationTypeDto {
  description: string;
  level: ViolationLevel;
}

export interface UpdateTrafficViolationTypeDto {
  description?: string;
  level?: ViolationLevel;
}

const getPointsByLevel = (level: ViolationLevel): number => {
  switch (level) {
    case ViolationLevel.LEVE:
      return 3;
    case ViolationLevel.MEDIA:
      return 4;
    case ViolationLevel.GRAVE:
      return 5;
    case ViolationLevel.GRAVISSIMA:
      return 7;
    default:
      return 0;
  }
};

export class TrafficViolationTypeService {
  async findAll() {
    return prisma.trafficViolationType.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.trafficViolationType.findUnique({
      where: { id },
      include: {
        violations: true,
      },
    });
  }

  async create(data: CreateTrafficViolationTypeDto) {
    const points = getPointsByLevel(data.level);

    return prisma.trafficViolationType.create({
      data: {
        ...data,
        points,
      },
    });
  }

  async update(id: string, data: UpdateTrafficViolationTypeDto) {
    const updateData: any = { ...data };

    if (data.level) {
      updateData.points = getPointsByLevel(data.level);
    }

    return prisma.trafficViolationType.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.trafficViolationType.delete({
      where: { id },
    });
  }
}

