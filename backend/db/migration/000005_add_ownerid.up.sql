-- Migration: Add image (TEXT) and category (VARCHAR) to causes table
ALTER TABLE causes
ADD COLUMN owner_id INTEGER REFERENCES users(id);

ALTER TABLE users
ADD COLUMN user_role VARCHAR(100);