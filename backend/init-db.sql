-- Initialize FootballZone database
-- This script runs when the PostgreSQL container starts

-- Create database if not exists (handled by POSTGRES_DB env var)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'Europe/Sofia';