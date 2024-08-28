-- name: CreateUser :one
INSERT INTO users (username, email, password_hash, first_name, last_name, avatar_url)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateUser :one
UPDATE users
SET username = $2, email = $3, first_name = $4, last_name = $5, avatar_url = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: CreateTeam :one
INSERT INTO teams (name, description, avatar_url)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetTeam :one
SELECT * FROM teams
WHERE id = $1 LIMIT 1;

-- name: ListTeams :many
SELECT * FROM teams
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateTeam :one
UPDATE teams
SET name = $2, description = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteTeam :exec
DELETE FROM teams
WHERE id = $1;

-- name: AddUserToTeam :one
INSERT INTO user_team (user_id, team_id, role)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateUserTeamRole :one
UPDATE user_team
SET role = $3
WHERE user_id = $1 AND team_id = $2
RETURNING *;

-- name: RemoveUserFromTeam :exec
DELETE FROM user_team
WHERE user_id = $1 AND team_id = $2;

-- name: CreateCause :one
INSERT INTO causes (name, description, goal, start_date, end_date, status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetCause :one
SELECT * FROM causes
WHERE id = $1 LIMIT 1;

-- name: ListCauses :many
SELECT * FROM causes
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateCause :one
UPDATE causes
SET name = $2, description = $3, goal = $4, current_amount = $5, start_date = $6, end_date = $7, status = $8, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteCause :exec
DELETE FROM causes
WHERE id = $1;

-- name: CreateDonation :one
INSERT INTO donations (user_id, cause_id, team_id, amount, donation_type, status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetDonation :one
SELECT * FROM donations
WHERE id = $1 LIMIT 1;

-- name: ListDonations :many
SELECT * FROM donations
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateDonationStatus :one
UPDATE donations
SET status = $2
WHERE id = $1
RETURNING *;

-- name: CreateLeaderboard :one
INSERT INTO leaderboards (name, type, start_date, end_date)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetLeaderboard :one
SELECT * FROM leaderboards
WHERE id = $1 LIMIT 1;

-- name: ListLeaderboards :many
SELECT * FROM leaderboards
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateLeaderboardEntry :one
INSERT INTO leaderboard_entries (leaderboard_id, user_id, team_id, score, rank)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (leaderboard_id, user_id, team_id) DO UPDATE
SET score = EXCLUDED.score, rank = EXCLUDED.rank
RETURNING *;

-- name: GetLeaderboardEntries :many
SELECT * FROM leaderboard_entries
WHERE leaderboard_id = $1
ORDER BY rank
LIMIT $2 OFFSET $3;

-- name: CreateUserToken :one
INSERT INTO user_tokens (user_id, token, expiry)
VALUES ($1, $2, $3)
RETURNING id, user_id, token, expiry, created_at, updated_at;

-- name: GetUserTokenByUserID :one
SELECT id, user_id, token, expiry, created_at, updated_at
FROM user_tokens
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 1;

-- name: DeleteUserToken :exec
DELETE FROM user_tokens
WHERE user_id = $1
AND token = $2;

-- name: DeleteExpiredTokens :exec
DELETE FROM user_tokens
WHERE expiry < now();
