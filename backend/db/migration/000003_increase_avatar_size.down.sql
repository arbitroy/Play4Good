-- Down migration: Revert avatar_url from TEXT to VARCHAR(255) in both users and teams tables
ALTER TABLE users
    ALTER COLUMN avatar_url TYPE VARCHAR(255);

ALTER TABLE teams
    ALTER COLUMN avatar_url TYPE VARCHAR(255);
