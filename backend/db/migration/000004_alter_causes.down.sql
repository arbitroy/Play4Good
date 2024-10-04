-- Down Migration: Remove image and category from causes table
ALTER TABLE causes
DROP COLUMN image;

ALTER TABLE causes
DROP COLUMN category;
