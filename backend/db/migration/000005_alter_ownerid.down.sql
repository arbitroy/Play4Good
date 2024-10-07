-- Down Migration: Remove image and category from causes table
ALTER TABLE causes
DROP COLUMN owner_id;

ALTER TABLE users
DROP COLUMN user_role;
