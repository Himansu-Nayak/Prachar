-- ============================================================
-- Flyway Migration: V9__phase9_webhook_lifecycle_and_resilience.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16/17
-- Description: Phase 9 Webhook Lifecycle Hardening & Audit Resilience
-- ============================================================

-- Add lifecycle tracking, failure capture, and retry metrics to payment_webhook_events
ALTER TABLE payment_webhook_events
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;

-- Performance index for webhook status queries and recovery workers
CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_status ON payment_webhook_events(status);
