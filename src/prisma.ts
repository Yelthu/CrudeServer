import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Auto-detect the right connection string (local or Docker)
const connectionString =
    process.env.DATABASE_URL_DOCKER ||  // For Docker (uses container name 'postgres')
    process.env.DATABASE_URL ||         // For local dev (uses 'localhost')
    '';

if (!connectionString) {
    throw new Error('DATABASE_URL or DATABASE_URL_DOCKER is missing in .env');
}

console.log('Using database connection:', connectionString.split('@')[1]?.split('/')[0] || 'unknown');  // Logs host for debugging

const adapter = new PrismaPg({ connectionString });

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,  // Pass the PrismaPg adapter
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;