import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ log: ['query'] });
} else {
  // Lazy-load Prisma for dev (Turbopack)
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ['query'] });
  }
  prisma = global.prisma;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} after Prisma connection error`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error("Prisma retry failed");
}

export { prisma, withRetry };