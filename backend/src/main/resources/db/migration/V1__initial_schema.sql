-- ============================================================
-- Flyway Migration: V1__initial_schema.sql
-- Project: PRACHAR (Phygital Publicity Platform)
-- Database: PostgreSQL 16
-- Description: Core Schema for Users, Profiles, Cards, and QRs
-- ============================================================

-- Enable pgcrypto extension for gen_random_uuid() if required
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username_slug VARCHAR(60) NOT NULL UNIQUE,
    display_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tagline VARCHAR(255),
    bio TEXT,
    primary_phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    email VARCHAR(255),
    website_url VARCHAR(500),
    address_text VARCHAR(300),
    city VARCHAR(100) NOT NULL DEFAULT 'Bhubaneswar',
    avatar_url VARCHAR(500),
    banner_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: digital_cards
CREATE TABLE digital_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    theme_color VARCHAR(20) NOT NULL DEFAULT '#0F172A',
    layout_type VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    is_nfc_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: qr_codes
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    code_uuid VARCHAR(64) NOT NULL UNIQUE,
    target_url VARCHAR(500) NOT NULL,
    scan_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & rapid resolution
CREATE INDEX idx_profiles_username_slug ON profiles(username_slug);
CREATE INDEX idx_profiles_city_category ON profiles(city, category);
CREATE INDEX idx_qr_codes_code_uuid ON qr_codes(code_uuid);
