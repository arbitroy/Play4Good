-- Up migration: Change avatar_url from VARCHAR(255) to TEXT in both users and teams tables
ALTER TABLE users
    ALTER COLUMN avatar_url TYPE TEXT;

ALTER TABLE teams
    ALTER COLUMN avatar_url TYPE TEXT;
