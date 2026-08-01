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
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? 'admin@cse.edu';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@1234';
const ADMIN_NAME     = process.env.SEED_ADMIN_NAME     ?? 'Super Admin';
const MONGODB_URI    = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

// Inline schema (avoid circular NestJS DI in a plain script)
const AdminSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  passwordHash:     { type: String, required: true },
  role:             { type: String, default: 'super_admin' },
  permissions:      { type: [String], default: [] },
  isActive:         { type: Boolean, default: true },
  isEmailVerified:  { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
}, { timestamps: true, collection: 'admins' });

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

  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB Atlas');

  const AdminModel = mongoose.model('Admin', AdminSchema);
  const existing = await AdminModel.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    console.log(`⚠️   Admin with email ${ADMIN_EMAIL} already exists. Skipping.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await AdminModel.create({
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
  });

  console.log(`\n🎉  Super admin created successfully!`);
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log('\n⚠️   Change your password immediately after first login!\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌  Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
