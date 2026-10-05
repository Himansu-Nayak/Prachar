-- ============================================================
-- Flyway Migration: V6__phase6_advertising_engine.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16/17
-- Description: Phase 6 Advertising Packages, Campaigns, Creatives & State Machine
-- ============================================================

-- 1. Table: advertisement_packages (Authoritative Rate Card Registry)
CREATE TABLE IF NOT EXISTS advertisement_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    format_description VARCHAR(255) NOT NULL,
    color_type VARCHAR(20) NOT NULL DEFAULT 'BLACK_AND_WHITE',
    single_edition_price NUMERIC(10, 2) NOT NULL,
    three_edition_price NUMERIC(10, 2) NOT NULL,
    savings_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed approved historical PRACHAR rate card (P1 through P5)
INSERT INTO advertisement_packages (package_code, name, format_description, color_type, single_edition_price, three_edition_price, savings_amount, is_active)
VALUES
    ('P1', 'B&W Mini-Quarter', 'Mini-Quarter Page (Black & White)', 'BLACK_AND_WHITE', 550.00, 1500.00, 150.00, TRUE),
    ('P2', 'B&W Quarter', 'Quarter Page (Black & White)', 'BLACK_AND_WHITE', 1030.00, 3000.00, 90.00, TRUE),
    ('P3', 'B&W Half Page', 'Half Page (Black & White)', 'BLACK_AND_WHITE', 2050.00, 6000.00, 150.00, TRUE),
    ('P4', 'B&W Full Page', 'Full Page (Black & White)', 'BLACK_AND_WHITE', 4100.00, 12000.00, 300.00, TRUE),
    ('P5', 'Colour Full Page', 'Full Page (Premium Four-Colour)', 'FULL_COLOUR', 6000.00, 15000.00, 3000.00, TRUE)
ON CONFLICT (package_code) DO NOTHING;

-- 2. Table: advertisements (Merchant Ad Bookings & Phygital Campaigns)
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    package_code VARCHAR(10) NOT NULL REFERENCES advertisement_packages(package_code),
    edition_count INT NOT NULL DEFAULT 1 CHECK (edition_count IN (1, 3)),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    target_edition VARCHAR(50) NOT NULL,
    is_cutoff_passed BOOLEAN NOT NULL DEFAULT FALSE,
    headline VARCHAR(200) NOT NULL,
    ad_text TEXT,
    business_name VARCHAR(150),
    category VARCHAR(100),
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    city VARCHAR(100) NOT NULL DEFAULT 'Bhubaneswar',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PAYMENT_PENDING',
    payment_reference VARCHAR(100),
    rejection_reason TEXT,
    admin_notes TEXT,
    creative_storage_key VARCHAR(500),
    creative_filename VARCHAR(255),
    creative_content_type VARCHAR(100),
    creative_file_size BIGINT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance & ownership indexes
CREATE INDEX IF NOT EXISTS idx_advertisements_user_id ON advertisements(user_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_profile_id ON advertisements(profile_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_status ON advertisements(status);
CREATE INDEX IF NOT EXISTS idx_advertisements_payment_status ON advertisements(payment_status);
CREATE INDEX IF NOT EXISTS idx_advertisements_target_edition ON advertisements(target_edition);
CREATE INDEX IF NOT EXISTS idx_advertisements_created_at ON advertisements(created_at DESC);
