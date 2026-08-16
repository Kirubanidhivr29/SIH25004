-- SIH25004 / SIH25005 - Animal Type Classification
-- Database schema: breeds (reference data) + scans (live census data)

CREATE TABLE IF NOT EXISTS breeds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    animal_type VARCHAR(20) NOT NULL CHECK (animal_type IN ('cattle', 'buffalo')),
    origin_state VARCHAR(100),
    milk_yield_liters_per_day VARCHAR(50),   -- range as text, e.g. "8-10"
    adaptability_score VARCHAR(20),          -- e.g. "High", "Medium", "Low"
    disease_resistance VARCHAR(20),          -- e.g. "High", "Medium", "Low"
    coat_color TEXT,
    horn_type TEXT,
    body_size VARCHAR(50),
    notes TEXT,
    image_ref TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    breed_id INTEGER REFERENCES breeds(id),
    predicted_breed_name VARCHAR(100) NOT NULL,   -- denormalized for fast reads even if breed row changes
    confidence NUMERIC(5,2) NOT NULL,             -- 0.00 - 100.00
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    state VARCHAR(100),                            -- resolved from lat/lng, or user-selected fallback
    flagged_health_issue BOOLEAN DEFAULT FALSE,
    health_notes TEXT,
    scanned_by VARCHAR(100),                        -- FLW / farmer identifier (optional, can be device id)
    scanned_at TIMESTAMP DEFAULT NOW(),
    image_ref TEXT                                  -- optional stored image path/url
);

CREATE INDEX IF NOT EXISTS idx_scans_state ON scans(state);
CREATE INDEX IF NOT EXISTS idx_scans_breed ON scans(breed_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at);
