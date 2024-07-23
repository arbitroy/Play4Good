-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_team table
CREATE TABLE user_team (
    user_id INTEGER REFERENCES users(id),
    team_id INTEGER REFERENCES teams(id),
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, team_id)
);

-- Create causes table
CREATE TABLE causes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    goal DECIMAL(10, 2),
    current_amount DECIMAL(10, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    cause_id INTEGER REFERENCES causes(id),
    team_id INTEGER REFERENCES teams(id),
    amount DECIMAL(10, 2),
    donation_type VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboards table
CREATE TABLE leaderboards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20),
    start_date DATE,
    end_date DATE
);

-- Create leaderboard_entries table
CREATE TABLE leaderboard_entries (
    leaderboard_id INTEGER REFERENCES leaderboards(id),
    user_id INTEGER REFERENCES users(id),
    team_id INTEGER REFERENCES teams(id),
    score DECIMAL(10, 2),
    rank INTEGER,
    PRIMARY KEY (leaderboard_id, user_id, team_id)
);