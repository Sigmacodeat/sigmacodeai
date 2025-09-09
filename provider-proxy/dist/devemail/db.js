import { PrismaClient } from '@prisma/client';
// Prisma Client Singleton to avoid multiple instances in dev hot-reload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn']
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
export default prisma;
