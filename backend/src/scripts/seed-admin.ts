/**
 * Seed script — creates the first super admin.
 *
 * Run once:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts
 *
 * Or via npm script:
 *   npm run seed:admin
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? 'admin@cse.edu';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@1234';
const ADMIN_NAME     = process.env.SEED_ADMIN_NAME     ?? 'Super Admin';

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in .env');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

async function main() {
  console.log('\n🌱  CSE Department — Admin Seed Script');
  console.log('─'.repeat(45));
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Name    : ${ADMIN_NAME}`);
  console.log(`   Role    : super_admin`);
  console.log('─'.repeat(45));

  const ok = await confirm('Proceed? (y/n): ');
  if (!ok) { console.log('Aborted.'); process.exit(0); }

  await prisma.$connect();
  console.log('✅  Connected to PostgreSQL');

  const existing = await prisma.admin.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`⚠️   Admin with email ${ADMIN_EMAIL} already exists. Skipping.`);
    await prisma.$disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.admin.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'super_admin',
      permissions: [
        'manage_faculty', 'manage_news', 'manage_events', 'manage_notice',
        'manage_gallery', 'manage_alumni', 'manage_research', 'manage_admins',
      ],
      isActive: true,
      isEmailVerified: true,
    },
  });

  console.log('\n🎉  Super admin created successfully!');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log('\n⚠️   Change your password immediately after first login!\n');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('❌  Seed failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
