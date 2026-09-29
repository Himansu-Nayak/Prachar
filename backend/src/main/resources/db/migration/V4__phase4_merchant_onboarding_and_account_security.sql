-- ============================================================
-- Flyway Migration: V4__phase4_merchant_onboarding_and_account_security.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16
-- Description: Phase 4 Account Lifecycle, Merchant Onboarding Status & Security Indexes
-- ============================================================

-- 1. Account Lifecycle Management: ACTIVE, DISABLED, SUSPENDED, PENDING_VERIFICATION
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';

-- 2. Merchant Onboarding State: NOT_STARTED, IN_PROGRESS, PROFILE_CREATED, CARD_CREATED, QR_CREATED, COMPLETED
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED';

-- 3. Indexes for fast status filtering & administrative lookups
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_onboarding_status ON users(onboarding_status);

-- 4. Backfill existing users: If user already has an established profile, mark onboarding as COMPLETED
UPDATE users
SET onboarding_status = 'COMPLETED'
WHERE id IN (SELECT user_id FROM profiles);
