package schemas
import (
    "time"
)

// UserCreateRequest represents the request body for creating a new user
type UserCreateRequest struct {
    Username  string `json:"username" binding:"required,min=3,max=50"`
    Email     string `json:"email" binding:"required,email"`
    Password  string `json:"password" binding:"required,min=8"`
    FirstName string `json:"first_name" binding:"required"`
    LastName  string `json:"last_name" binding:"required"`
    AvatarURL string `json:"avatar_url" binding:"omitempty,url"`
}

// UserUpdateRequest represents the request body for updating a user
type UserUpdateRequest struct {
    Username  string `json:"username" binding:"omitempty,min=3,max=50"`
    Email     string `json:"email" binding:"omitempty,email"`
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
    AvatarURL string `json:"avatar_url" binding:"omitempty,url"`
}

// TeamCreateRequest represents the request body for creating a new team
type TeamCreateRequest struct {
    Name        string `json:"name" binding:"required,min=3,max=100"`
    Description string `json:"description"`
    AvatarURL   string `json:"avatar_url" binding:"omitempty,url"`
}

// TeamUpdateRequest represents the request body for updating a team
type TeamUpdateRequest struct {
    Name        string `json:"name" binding:"omitempty,min=3,max=100"`
    Description string `json:"description"`
    AvatarURL   string `json:"avatar_url" binding:"omitempty,url"`
}

// CauseCreateRequest represents the request body for creating a new cause
type CauseCreateRequest struct {
    Name        string     `json:"name" binding:"required,min=3,max=100"`
    Description string     `json:"description"`
    Goal        float64    `json:"goal" binding:"required,min=0"`
    StartDate   time.Time  `json:"start_date" binding:"required"`
    EndDate     time.Time  `json:"end_date" binding:"required,gtfield=StartDate"`
    Status      string     `json:"status" binding:"required,oneof=active inactive completed"`
}

// CauseUpdateRequest represents the request body for updating a cause
type CauseUpdateRequest struct {
    Name        string     `json:"name" binding:"omitempty,min=3,max=100"`
    Description string     `json:"description"`
    Goal        float64    `json:"goal" binding:"omitempty,min=0"`
    StartDate   time.Time  `json:"start_date"`
    EndDate     time.Time  `json:"end_date" binding:"omitempty,gtfield=StartDate"`
    Status      string     `json:"status" binding:"omitempty,oneof=active inactive completed"`
}

// DonationCreateRequest represents the request body for creating a new donation
type DonationCreateRequest struct {
    UserID       int64   `json:"user_id" binding:"required"`
    CauseID      int64   `json:"cause_id" binding:"required"`
    TeamID       int64   `json:"team_id"`
    Amount       float64 `json:"amount" binding:"required,min=0"`
    DonationType string  `json:"donation_type" binding:"required,oneof=money goods service"`
}

// LeaderboardCreateRequest represents the request body for creating a new leaderboard
type LeaderboardCreateRequest struct {
    Name      string    `json:"name" binding:"required,min=3,max=100"`
    Type      string    `json:"type" binding:"required,oneof=individual team"`
    StartDate time.Time `json:"start_date" binding:"required"`
    EndDate   time.Time `json:"end_date" binding:"required,gtfield=StartDate"`
}

// LeaderboardEntryUpdateRequest represents the request body for updating a leaderboard entry
type LeaderboardEntryUpdateRequest struct {
    LeaderboardID int64   `json:"leaderboard_id" binding:"required"`
    UserID        int64   `json:"user_id"`
    TeamID        int64   `json:"team_id"`
    Score         float64 `json:"score" binding:"required,min=0"`
}