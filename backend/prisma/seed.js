const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = (pw) => bcrypt.hash(pw, 10);

  // Remove old generic demo accounts
  
  await prisma.user.deleteMany({ where: { email: { in: ['creator@example.com','consumer@example.com'] } } });

  // Seed project-specific accounts

  await prisma.user.upsert({
    where: { email: 'hamza@snapnest.com' },
    update: { passwordHash: await hash('Hamza@Nest1!'), name: 'Hamza Khan' },
    create: { name: 'Hamza Khan', email: 'hamza@snapnest.com', passwordHash: await hash('Hamza@Nest1!'), role: 'creator' },
  });
  await prisma.user.upsert({
    where: { email: 'zara@snapnest.com' },
    update: { passwordHash: await hash('Zara#Snap2!'), name: 'Zara Ahmed' },
    create: { name: 'Zara Ahmed', email: 'zara@snapnest.com', passwordHash: await hash('Zara#Snap2!'), role: 'creator' },
  });
  await prisma.user.upsert({
    where: { email: 'jake@snapnest.com' },
    update: { passwordHash: await hash('Jake!Turn3@'), name: 'Jake Turner' },
    create: { name: 'Jake Turner', email: 'jake@snapnest.com', passwordHash: await hash('Jake!Turn3@'), role: 'creator' },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@snapnest.com' },
    update: { passwordHash: await hash('Lily@View1!2'), name: 'Lily Viewer' },
    create: { name: 'Lily Viewer', email: 'viewer@snapnest.com', passwordHash: await hash('Lily@View1!2'), role: 'consumer' },
  });

  console.log('Seeded SnapNest — 4 accounts');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
