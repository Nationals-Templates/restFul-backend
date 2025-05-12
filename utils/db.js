const { PrismaClient } = require('../generated/prisma/client');

const globalPrisma = { prisma: null }

const prisma = globalPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma

module.exports = prisma