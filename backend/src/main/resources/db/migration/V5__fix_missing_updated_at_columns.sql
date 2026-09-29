-- ============================================================
-- Flyway Migration: V5__fix_missing_updated_at_columns.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 17
-- Description: Add missing updated_at column to otps and refresh_tokens tables.
--              These tables extend BaseEntity in Java (which declares updated_at)
--              but V2 migration only added created_at for these tables.
--              This migration is purely ADDITIVE — no data is deleted or modified.
-- ============================================================

-- Fix 1: otps table — add updated_at defaulting to created_at value
-- (OTP records are immutable after creation, so updated_at = created_at is correct)
ALTER TABLE otps
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill: set updated_at = created_at for all existing OTP rows
UPDATE otps SET updated_at = created_at WHERE updated_at <> created_at OR updated_at IS NULL;

-- Fix 2: refresh_tokens table — add updated_at defaulting to created_at value
ALTER TABLE refresh_tokens
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill: set updated_at = created_at for all existing refresh_token rows
UPDATE refresh_tokens SET updated_at = created_at WHERE updated_at <> created_at OR updated_at IS NULL;
