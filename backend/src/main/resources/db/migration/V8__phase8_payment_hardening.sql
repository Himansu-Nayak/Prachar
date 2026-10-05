-- ============================================================
-- Flyway Migration: V8__phase8_payment_hardening.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16/17
-- Description: Phase 8 Payment Hardening, Idempotency & Webhook Deduplication
-- ============================================================

-- Add refund tracking and idempotency columns to payment_transactions
ALTER TABLE payment_transactions
    ADD COLUMN IF NOT EXISTS refunded_amount_minor BIGINT NOT NULL DEFAULT 0 CHECK (refunded_amount_minor >= 0),
    ADD COLUMN IF NOT EXISTS refund_reason TEXT,
    ADD COLUMN IF NOT EXISTS refund_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100);

-- Unique constraint on idempotency_key (ignoring NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_transactions_idempotency_key
    ON payment_transactions(idempotency_key)
    WHERE idempotency_key IS NOT NULL;

-- Webhook events ledger table for idempotency and forensic auditing
CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    payload TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_payment_webhook_events_event_id UNIQUE (event_id)
);

-- Performance indexes for webhook deduplication & lookups
CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_event_id ON payment_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_entity_id ON payment_webhook_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_created_at ON payment_webhook_events(created_at DESC);
