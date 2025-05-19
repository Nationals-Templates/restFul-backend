// prisma/seed.js
const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'deborahrutagengwa@gmail.com';
  const adminPassword = await bcrypt.hash('debra123', 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'admin' },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin',
      phone: '1234567890',
      role: 'admin'
    }
  });
  console.log('✅ Admin user created');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });