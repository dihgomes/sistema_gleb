const { PrismaClient } = require('@prisma/client');

// Instância única do Prisma Client
const prisma = new PrismaClient();

module.exports = prisma;
