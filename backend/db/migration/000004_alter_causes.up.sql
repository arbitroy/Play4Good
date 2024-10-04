-- Migration: Add image (TEXT) and category (VARCHAR) to causes table
ALTER TABLE causes
ADD COLUMN image TEXT;

ALTER TABLE causes
ADD COLUMN category VARCHAR(100);