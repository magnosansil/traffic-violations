import prisma from '../db/prisma';

export interface CreateTrafficViolationDto {
  violationTypeId: string;
  vehicleId: string;
  driverId: string;
  violationDateTime: Date | string; // Combined date and time
  roadLocation: number; // Kilometer between 1 and 120
}

export interface UpdateTrafficViolationDto {
  violationTypeId?: string;
  vehicleId?: string;
  driverId?: string;
  violationDateTime?: Date | string;
  roadLocation?: number;
}

export class TrafficViolationService {
  async findAll() {
    return prisma.trafficViolation.findMany({
      include: {
        violationType: true,
        vehicle: {
          include: {
            owner: true,
          },
        },
        driver: true,
      },
      orderBy: {
        violationDateTime: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.trafficViolation.findUnique({
      where: { id },
      include: {
        violationType: true,
        vehicle: {
          include: {
            owner: true,
          },
        },
        driver: true,
      },
    });
  }

  async create(data: CreateTrafficViolationDto) {
    // Validate road location (between 1 and 120)
    if (data.roadLocation < 1 || data.roadLocation > 120) {
      throw new Error('Road location must be between 1 and 120 kilometers');
    }

    // Verify violation type exists
    const violationType = await prisma.trafficViolationType.findUnique({
      where: { id: data.violationTypeId },
    });
    if (!violationType) {
      throw new Error('Violation type not found');
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Verify driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: data.driverId },
    });
    if (!driver) {
      throw new Error('Driver not found');
    }

    return prisma.trafficViolation.create({
      data: {
        violationTypeId: data.violationTypeId,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        violationDateTime: new Date(data.violationDateTime),
        roadLocation: data.roadLocation,
      },
      include: {
        violationType: true,
        vehicle: {
          include: {
            owner: true,
          },
        },
        driver: true,
      },
    });
  }

  async update(id: string, data: UpdateTrafficViolationDto) {
    // Validate road location if provided
    if (data.roadLocation !== undefined) {
      if (data.roadLocation < 1 || data.roadLocation > 120) {
        throw new Error('Road location must be between 1 and 120 kilometers');
      }
    }

    // Verify violation type exists if provided
    if (data.violationTypeId) {
      const violationType = await prisma.trafficViolationType.findUnique({
        where: { id: data.violationTypeId },
      });
      if (!violationType) {
        throw new Error('Violation type not found');
      }
    }

    // Verify vehicle exists if provided
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      });
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
    }

    // Verify driver exists if provided
    if (data.driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: data.driverId },
      });
      if (!driver) {
        throw new Error('Driver not found');
      }
    }

    const updateData: any = { ...data };
    if (data.violationDateTime) {
      updateData.violationDateTime = new Date(data.violationDateTime);
    }

    return prisma.trafficViolation.update({
      where: { id },
      data: updateData,
      include: {
        violationType: true,
        vehicle: {
          include: {
            owner: true,
          },
        },
        driver: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.trafficViolation.delete({
      where: { id },
    });
  }

  async getDetailedList() {
    return prisma.trafficViolation.findMany({
      include: {
        violationType: {
          select: {
            description: true,
            level: true,
            points: true,
          },
        },
        vehicle: {
          select: {
            plate: true,
            species: true,
          },
        },
        driver: {
          select: {
            name: true,
            licenseNumber: true,
          },
        },
      },
      orderBy: {
        violationDateTime: 'desc',
      },
    });
  }
}

