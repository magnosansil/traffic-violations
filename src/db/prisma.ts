import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const prismaClientSingleton = () => {
  // Configuração do Pool otimizada para Neon (PostgreSQL serverless)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Configurações recomendadas para Neon
    max: 1, // Neon funciona melhor com conexões individuais
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // SSL é necessário para Neon
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
