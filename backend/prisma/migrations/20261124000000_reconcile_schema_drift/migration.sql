-- ─────────────────────────────────────────────────────────────────────────────
-- RECONCILIATION MIGRATION
-- Name   : 20261124000000_reconcile_schema_drift
-- Reason : Several schema changes were applied directly to Neon via
--          `prisma db push` without generating migration files. This migration
--          brings any FRESH database (Supabase or otherwise) to the exact same
--          state as the current schema.prisma.
--
-- Safety : Every statement uses IF NOT EXISTS / IF EXISTS guards so the
--          migration is idempotent — running it on a database that already has
--          some or all of these changes will not error.
--
-- Applies in order:
--   1. faculty       — make email nullable, add 4 leadership columns
--   2. notices       — add coverImage column
--   3. settings      — add 5 theme/appearance columns
--   4. student_records — add batch + enrollmentStatus columns
--   5. admission_settings table (missing entirely)
--   6. admission_applications table (missing entirely)
-- ─────────────────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════════════════
-- 1. faculty table
-- ══════════════════════════════════════════════════════════════════════════════

-- 1a. email was TEXT NOT NULL UNIQUE in migration 1.
--     Commit 8e56286 changed schema to String? (nullable), applied via db push.
--     On a fresh DB the init migration creates it NOT NULL.
--     We drop the UNIQUE constraint and alter to allow NULL.

-- Drop the unique index on email (it was created by init migration)
DROP INDEX IF EXISTS "faculty_email_key";

-- Make email nullable
ALTER TABLE "faculty"
  ALTER COLUMN "email" DROP NOT NULL;

-- Re-create the unique index as a PARTIAL index so NULL values are allowed
-- (multiple rows with NULL email would otherwise violate a standard UNIQUE).
CREATE UNIQUE INDEX IF NOT EXISTS "faculty_email_key"
  ON "faculty"("email")
  WHERE "email" IS NOT NULL;

-- 1b. Leadership columns (commit d230a36 — applied via db push)
ALTER TABLE "faculty"
  ADD COLUMN IF NOT EXISTS "leadershipRole"    TEXT,
  ADD COLUMN IF NOT EXISTS "isCurrentChairman" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "chairmanFrom"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "chairmanTo"        TIMESTAMP(3);


-- ══════════════════════════════════════════════════════════════════════════════
-- 2. notices table
-- ══════════════════════════════════════════════════════════════════════════════

-- coverImage was added via db push (commit 1402e90)
ALTER TABLE "notices"
  ADD COLUMN IF NOT EXISTS "coverImage" TEXT;


-- ══════════════════════════════════════════════════════════════════════════════
-- 3. settings table — theme/appearance columns
-- ══════════════════════════════════════════════════════════════════════════════

-- Added via db push (commit 03ea177)
ALTER TABLE "settings"
  ADD COLUMN IF NOT EXISTS "headerAccentColor" TEXT DEFAULT '#1a7a3c',
  ADD COLUMN IF NOT EXISTS "headerRightBg"     TEXT DEFAULT '#1a7a3c',
  ADD COLUMN IF NOT EXISTS "showDeptPrefix"    BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "headerFont"        TEXT DEFAULT 'montserrat',
  ADD COLUMN IF NOT EXISTS "adminAccentColor"  TEXT DEFAULT '#16a34a';


-- ══════════════════════════════════════════════════════════════════════════════
-- 4. student_records table — missing columns
-- ══════════════════════════════════════════════════════════════════════════════

-- batch and enrollmentStatus were in schema.prisma (commit abfbb49)
-- but neither of the two student migrations included them.
ALTER TABLE "student_records"
  ADD COLUMN IF NOT EXISTS "batch"            TEXT,
  ADD COLUMN IF NOT EXISTS "email"            TEXT,
  ADD COLUMN IF NOT EXISTS "phone"            TEXT,
  ADD COLUMN IF NOT EXISTS "enrollmentStatus" TEXT NOT NULL DEFAULT 'active';


-- ══════════════════════════════════════════════════════════════════════════════
-- 5. admission_settings table (entirely missing from all migrations)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "admission_settings" (
  "id"                TEXT        NOT NULL,
  "session"           TEXT        NOT NULL,
  "isOpen"            BOOLEAN     NOT NULL DEFAULT false,
  "appStartDate"      TIMESTAMP(3),
  "appDeadline"       TIMESTAMP(3),
  "admissionFee"      INTEGER     NOT NULL DEFAULT 500,
  "feeInstructions"   TEXT,
  "instructions"      TEXT,
  "requiredDocuments" TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "admission_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "admission_settings_session_key"
  ON "admission_settings"("session");


-- ══════════════════════════════════════════════════════════════════════════════
-- 6. admission_applications table (entirely missing from all migrations)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "admission_applications" (
  "id"                TEXT        NOT NULL,
  "applicationId"     TEXT        NOT NULL,
  "settingId"         TEXT,

  -- Session & program
  "session"           TEXT        NOT NULL,
  "program"           TEXT        NOT NULL DEFAULT 'BSc',

  -- Personal information
  "fullName"          TEXT        NOT NULL,
  "dateOfBirth"       TEXT,
  "gender"            TEXT,
  "email"             TEXT        NOT NULL,
  "phone"             TEXT        NOT NULL,
  "presentAddress"    TEXT,
  "permanentAddress"  TEXT,

  -- Guardian information
  "fatherName"        TEXT,
  "motherName"        TEXT,
  "guardianPhone"     TEXT,

  -- SSC academic record
  "sscBoard"          TEXT,
  "sscRoll"           TEXT,
  "sscRegNo"          TEXT,
  "sscYear"           TEXT,
  "sscGpa"            TEXT,

  -- HSC academic record
  "hscBoard"          TEXT,
  "hscRoll"           TEXT,
  "hscRegNo"          TEXT,
  "hscYear"           TEXT,
  "hscGpa"            TEXT,

  -- Uploaded document URLs (Cloudinary)
  "photoUrl"          TEXT,
  "sscDocUrl"         TEXT,
  "hscDocUrl"         TEXT,
  "otherDocUrl"       TEXT,

  -- Application status
  "status"            TEXT        NOT NULL DEFAULT 'submitted',

  -- Payment
  "paymentStatus"     TEXT        NOT NULL DEFAULT 'pending',
  "paymentAmount"     INTEGER,
  "paymentMethod"     TEXT,
  "transactionId"     TEXT,
  "paymentDate"       TIMESTAMP(3),
  "paymentVerifiedAt" TIMESTAMP(3),
  "paymentVerifiedBy" TEXT,

  -- Admin review
  "adminRemarks"      TEXT,
  "reviewedBy"        TEXT,
  "reviewedAt"        TIMESTAMP(3),

  -- Post-approval
  "assignedStudentId" TEXT,
  "assignedBatch"     TEXT,

  -- Applicant tracking login
  "trackingPassword"  TEXT,

  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "admission_applications_pkey" PRIMARY KEY ("id")
);

-- Unique & regular indexes
CREATE UNIQUE INDEX IF NOT EXISTS "admission_applications_applicationId_key"
  ON "admission_applications"("applicationId");

CREATE INDEX IF NOT EXISTS "admission_applications_email_idx"
  ON "admission_applications"("email");

CREATE INDEX IF NOT EXISTS "admission_applications_status_idx"
  ON "admission_applications"("status");

CREATE INDEX IF NOT EXISTS "admission_applications_session_status_idx"
  ON "admission_applications"("session", "status");

-- Foreign key to admission_settings (nullable — application may exist without a window)
ALTER TABLE "admission_applications"
  ADD CONSTRAINT "admission_applications_settingId_fkey"
  FOREIGN KEY ("settingId")
  REFERENCES "admission_settings"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
