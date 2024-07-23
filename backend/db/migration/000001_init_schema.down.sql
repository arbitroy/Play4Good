-- Drop tables in reverse order of creation to avoid foreign key constraints
DROP TABLE IF EXISTS leaderboard_entries;
DROP TABLE IF EXISTS leaderboards;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS causes;
DROP TABLE IF EXISTS user_team;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS users;