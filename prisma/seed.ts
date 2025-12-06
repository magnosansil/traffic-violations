import 'dotenv/config';
import { PrismaClient, ViolationLevel, VehicleSpecies, Gender } from '@prisma/client';

// Para scripts de seed, usamos PrismaClient diretamente sem adapter
// O adapter é necessário apenas para a aplicação em runtime
// Neon funciona bem com PrismaClient padrão para seeds
// O PrismaClient lê automaticamente a DATABASE_URL do .env
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpar dados existentes (opcional - comente se quiser preservar dados)
  console.log('🗑️  Cleaning existing data...');
  await prisma.trafficViolation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.trafficViolationType.deleteMany();

  // Criar tipos de violação
  console.log('📋 Creating violation types...');
  const violationTypes = await Promise.all([
    prisma.trafficViolationType.create({
      data: {
        description: 'Dirigir sem cinto de segurança',
        level: ViolationLevel.GRAVE,
        points: 5,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Ultrapassar sinal vermelho',
        level: ViolationLevel.GRAVISSIMA,
        points: 7,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Estacionar em local proibido',
        level: ViolationLevel.LEVE,
        points: 3,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Usar celular ao volante',
        level: ViolationLevel.GRAVE,
        points: 5,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Dirigir acima da velocidade permitida',
        level: ViolationLevel.MEDIA,
        points: 4,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Dirigir sem habilitação',
        level: ViolationLevel.GRAVISSIMA,
        points: 7,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Não usar seta ao mudar de faixa',
        level: ViolationLevel.LEVE,
        points: 3,
      },
    }),
    prisma.trafficViolationType.create({
      data: {
        description: 'Dirigir sob efeito de álcool',
        level: ViolationLevel.GRAVISSIMA,
        points: 7,
      },
    }),
  ]);

  // Criar motoristas
  console.log('👤 Creating drivers...');
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'João Silva',
        gender: Gender.MASCULINO,
        birthDate: new Date('1990-05-15'),
        licenseNumber: '123456789',
        licenseValidity: new Date('2025-12-31'),
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Maria Santos',
        gender: Gender.FEMININO,
        birthDate: new Date('1985-08-20'),
        licenseNumber: '987654321',
        licenseValidity: new Date('2026-06-30'),
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Carlos Oliveira',
        gender: Gender.MASCULINO,
        birthDate: new Date('1992-11-10'),
        licenseNumber: '456789123',
        licenseValidity: new Date('2027-03-15'),
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Ana Costa',
        gender: Gender.FEMININO,
        birthDate: new Date('1988-03-25'),
        licenseNumber: '789123456',
        licenseValidity: new Date('2025-08-20'),
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Pedro Alves',
        gender: Gender.MASCULINO,
        birthDate: new Date('1987-07-12'),
        licenseNumber: '321654987',
        licenseValidity: new Date('2026-11-30'),
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Fernanda Lima',
        gender: Gender.FEMININO,
        birthDate: new Date('1995-02-18'),
        licenseNumber: '654987321',
        licenseValidity: new Date('2028-01-10'),
      },
    }),
  ]);

  // Criar veículos
  console.log('🚗 Creating vehicles...');
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plate: 'ABC-1234',
        species: VehicleSpecies.PASSAGEIROS,
        brand: 'Toyota',
        model: 'Corolla',
        ownerId: drivers[0].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'XYZ-5678',
        species: VehicleSpecies.CARGA,
        brand: 'Volkswagen',
        model: 'Amarok',
        ownerId: drivers[1].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'DEF-9012',
        species: VehicleSpecies.PASSAGEIROS,
        brand: 'Honda',
        model: 'Civic',
        ownerId: drivers[2].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'GHI-3456',
        species: VehicleSpecies.PASSAGEIROS,
        brand: 'Ford',
        model: 'Ka',
        ownerId: drivers[3].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'JKL-7890',
        species: VehicleSpecies.CARGA,
        brand: 'Mercedes-Benz',
        model: 'Sprinter',
        ownerId: drivers[4].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'MNO-2468',
        species: VehicleSpecies.PASSAGEIROS,
        brand: 'Fiat',
        model: 'Uno',
        ownerId: drivers[5].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'PQR-1357',
        species: VehicleSpecies.MISTO,
        brand: 'Renault',
        model: 'Master',
        ownerId: null, // Veículo sem proprietário
      },
    }),
  ]);

  // Criar violações de trânsito (aproximadamente 10)
  console.log('🚨 Creating traffic violations...');
  const violations = await Promise.all([
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[0].id, // Sem cinto
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        violationDateTime: new Date('2024-01-15T14:30:00'),
        roadLocation: 45,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[1].id, // Sinal vermelho
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        violationDateTime: new Date('2024-01-20T10:15:00'),
        roadLocation: 78,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[2].id, // Estacionar proibido
        vehicleId: vehicles[2].id,
        driverId: drivers[2].id,
        violationDateTime: new Date('2024-02-05T08:45:00'),
        roadLocation: 12,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[3].id, // Celular ao volante
        vehicleId: vehicles[3].id,
        driverId: drivers[3].id,
        violationDateTime: new Date('2024-02-10T16:20:00'),
        roadLocation: 56,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[4].id, // Velocidade acima do permitido
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        violationDateTime: new Date('2024-02-15T11:30:00'),
        roadLocation: 89,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[5].id, // Sem habilitação
        vehicleId: vehicles[4].id,
        driverId: drivers[4].id,
        violationDateTime: new Date('2024-02-18T09:15:00'),
        roadLocation: 34,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[6].id, // Não usar seta
        vehicleId: vehicles[5].id,
        driverId: drivers[5].id,
        violationDateTime: new Date('2024-02-22T13:45:00'),
        roadLocation: 67,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[7].id, // Dirigir embriagado
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        violationDateTime: new Date('2024-03-01T22:30:00'),
        roadLocation: 23,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[2].id, // Estacionar proibido (repetido)
        vehicleId: vehicles[3].id,
        driverId: drivers[3].id,
        violationDateTime: new Date('2024-03-05T15:20:00'),
        roadLocation: 91,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[3].id, // Celular ao volante (repetido)
        vehicleId: vehicles[2].id,
        driverId: drivers[2].id,
        violationDateTime: new Date('2024-03-08T17:10:00'),
        roadLocation: 45,
      },
    }),
    prisma.trafficViolation.create({
      data: {
        violationTypeId: violationTypes[4].id, // Velocidade acima do permitido
        vehicleId: vehicles[4].id,
        driverId: drivers[4].id,
        violationDateTime: new Date('2024-03-12T14:00:00'),
        roadLocation: 112,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${violationTypes.length} violation types created`);
  console.log(`   - ${drivers.length} drivers created`);
  console.log(`   - ${vehicles.length} vehicles created`);
  console.log(`   - ${violations.length} traffic violations created`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
