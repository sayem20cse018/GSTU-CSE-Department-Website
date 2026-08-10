-- Create student system tables
CREATE TABLE IF NOT EXISTS "student_records" (
  "id"          TEXT NOT NULL,
  "studentId"   TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "session"     TEXT NOT NULL,
  "isVerified"  BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_records_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "student_records_studentId_key" ON "student_records"("studentId");
CREATE INDEX IF NOT EXISTS "student_records_studentId_idx" ON "student_records"("studentId");

CREATE TABLE IF NOT EXISTS "student_users" (
  "id"              TEXT NOT NULL,
  "studentId"       TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "email"           TEXT NOT NULL,
  "passwordHash"    TEXT NOT NULL,
  "session"         TEXT NOT NULL,
  "phone"           TEXT,
  "photo"           TEXT,
  "isActive"        BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt"     TIMESTAMP(3),
  "lastLoginIp"     TEXT,
  "totalLoginCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "student_users_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "student_records"("studentId") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "student_users_studentId_key" ON "student_users"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "student_users_email_key"     ON "student_users"("email");
CREATE INDEX IF NOT EXISTS "student_users_studentId_idx"        ON "student_users"("studentId");

CREATE TABLE IF NOT EXISTS "student_sessions" (
  "id"            TEXT NOT NULL,
  "studentUserId" TEXT NOT NULL,
  "token"         TEXT NOT NULL,
  "ipAddress"     TEXT,
  "userAgent"     TEXT,
  "loginAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "logoutAt"      TIMESTAMP(3),
  "isActive"      BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "student_sessions_studentUserId_fkey"
    FOREIGN KEY ("studentUserId") REFERENCES "student_users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "student_sessions_token_key"         ON "student_sessions"("token");
CREATE INDEX IF NOT EXISTS "student_sessions_studentUserId_idx"        ON "student_sessions"("studentUserId");
CREATE INDEX IF NOT EXISTS "student_sessions_isActive_lastSeenAt_idx"  ON "student_sessions"("isActive","lastSeenAt");
