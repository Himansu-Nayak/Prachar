-- ============================================================
-- Flyway Migration: V10__phase10_transactional_outbox.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16/17
-- Description: Phase 10 Transactional Outbox for Resilient Async Side Effects
-- ============================================================

CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    payload_version INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    available_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by VARCHAR(100),
    CONSTRAINT chk_outbox_events_status CHECK (status IN ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED', 'DEAD_LETTER'))
);

-- Fast lookup for background workers claiming pending tasks
CREATE INDEX IF NOT EXISTS idx_outbox_events_status_available ON outbox_events (status, available_at);

-- Lookup by aggregate entity
CREATE INDEX IF NOT EXISTS idx_outbox_events_aggregate ON outbox_events (aggregate_type, aggregate_id);

-- Stale lock recovery index for crashed workers
CREATE INDEX IF NOT EXISTS idx_outbox_events_stale_lock ON outbox_events (status, locked_at);
