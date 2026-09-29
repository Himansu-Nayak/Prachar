-- ============================================================
-- Flyway Migration: V3__phase3_digital_profile_and_qr_analytics.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16
-- Description: Phase 3 Profile Fields, QR Status, and Scan Analytics Event Foundation
-- ============================================================

-- Profile Entity Extensions (Business name, location district/state, social links)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name VARCHAR(150);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district VARCHAR(100) NOT NULL DEFAULT 'Khordha';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT 'Odisha';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_instagram VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_facebook VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_twitter VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_linkedin VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- QR Code Entity Extensions (Status lifecycle)
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);

-- Table: qr_scan_events (Telemetry foundation with DPDP Act 2023 privacy compliance)
CREATE TABLE IF NOT EXISTS qr_scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(64),
    user_agent VARCHAR(500),
    referrer VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_qr_scan_events_qr_id ON qr_scan_events(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scan_events_profile_id ON qr_scan_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_qr_scan_events_scanned_at ON qr_scan_events(scanned_at);
