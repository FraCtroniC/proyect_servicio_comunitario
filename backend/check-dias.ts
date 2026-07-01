import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const dias = await prisma.dia.findMany();
  console.log('Dias:', dias);
}
main().catch(console.error).finally(() => prisma.$disconnect());
