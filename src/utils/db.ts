import { PrismaClient } from "@prisma/client";
import config from "../config/config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (config.nodeEnv !== "production") globalForPrisma.prisma = prisma;

export default prisma;
