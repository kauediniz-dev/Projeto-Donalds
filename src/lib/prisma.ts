import { PrismaClient } from "@prisma/client";

/**
 * Aqui criamos um "tipo global" para armazenar o Prisma.
 * Isso evita recriar várias conexões no ambiente de desenvolvimento (Next.js).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Se já existir uma instância do Prisma (em dev), reutiliza.
 * Caso contrário, cria uma nova conexão com o banco.
 */
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // opcional: mostra queries no terminal (útil em dev)
  });

/**
 * Em desenvolvimento, salvamos a instância no global
 * para evitar múltiplas conexões ao banco (hot reload do Next).
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Exportamos o Prisma como "db"
 * 👉 padrão mais comum para usar no projeto inteiro
 */
export const db = prisma;
