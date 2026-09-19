-- Add coverImage column to notices table
ALTER TABLE "notices" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
