import { PrismaClient } from "@prisma/client";

declare global {
   
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient; // variável para armazenar a instância do PrismaClient
if (process.env.NODE_ENV === "production") { // se estiver em produção, cria uma nova instância do PrismaClient
  prisma = new PrismaClient();
} else { // se estiver em desenvolvimento, verifica se já existe uma instância do PrismaClient armazenada na variável global.cachedPrisma, se não existir, cria uma nova instância e armazena na variável global.cachedPrisma, e depois atribui a variável prisma para a instância armazenada na variável global.cachedPrisma
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

// vou usar para chamar meu banco de dados
export const db = prisma;

// Esse código garante que vai ter pelo menos uma conexão com o banco de dados