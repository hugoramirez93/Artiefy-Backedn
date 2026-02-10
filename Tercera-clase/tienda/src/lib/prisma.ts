import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

// Initialize Prisma Client with Better SQLite3 adapter

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const dbPath = path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/");
const adapter = new PrismaBetterSqlite3({
	url: `file:${dbPath}`,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
