-- Geocoded addresses cache table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS geocoded_addresses (
  address TEXT PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_geocoded_addresses_created_at ON geocoded_addresses(created_at DESC);

-- Enable Row Level Security (optional, but good practice)
ALTER TABLE geocoded_addresses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is backend-only)
CREATE POLICY "Allow all operations" ON geocoded_addresses
  FOR ALL
  USING (true)
  WITH CHECK (true);
