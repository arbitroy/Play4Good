package controllers

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"time"

	db "play4good-backend/db/sqlc"
	"play4good-backend/schemas"
	"play4good-backend/util"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Play4GoodController struct {
	db  *db.Queries
	ctx context.Context
}

func NewPlay4GoodController(db *db.Queries, ctx context.Context) *Play4GoodController {
	return &Play4GoodController{db, ctx}
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}

// Helper function to validate token and return associated user ID
func (c *Play4GoodController) validateToken(ctx *gin.Context) error {
	// Get token from cookie instead of Authorization header
	cookie, err := ctx.Cookie("token")
	if err != nil {
		return fmt.Errorf("authentication required")
	}

	// Parse and validate the token
	userID, err := util.ParseToken(cookie)
	if err != nil {
		return fmt.Errorf("invalid token")
	}

	// Store userID in context for later use
	ctx.Set("userID", userID)
	return nil
}

func (pc *Play4GoodController) SignUpUser(ctx *gin.Context) {
	// Parse and validate the request body
	var req struct {
		Username  string `json:"username" binding:"required,min=3,max=50"`
		Email     string `json:"email" binding:"required,email"`
		Password  string `json:"password" binding:"required,min=8"`
		FirstName string `json:"first_name" binding:"required"`
		LastName  string `json:"last_name" binding:"required"`
		AvatarURL string `json:"avatar_url" binding:"omitempty,url"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the email already exists in the database
	_, err := pc.db.GetUserByEmail(pc.ctx, req.Email)
	if err == nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash the user's password
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	// Create a new user in the database
	newUser := db.CreateUserParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword, // Note: You should hash this password before storing
		FirstName:    sql.NullString{String: req.FirstName, Valid: req.FirstName != ""},
		LastName:     sql.NullString{String: req.LastName, Valid: req.LastName != ""},
		AvatarUrl:    sql.NullString{String: req.AvatarURL, Valid: req.AvatarURL != ""},
	}

	user, err := pc.db.CreateUser(pc.ctx, newUser)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	// Generate the JWT token
	tokenString, err := util.GenerateJWT(int(user.ID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Create a new token record in the database
	expiry := time.Now().Add(24 * time.Hour) // 24-hour expiry
	_, err = pc.db.CreateUserToken(pc.ctx, db.CreateUserTokenParams{
		UserID: sql.NullInt32{Int32: user.ID, Valid: true},
		Token:  tokenString,
		Expiry: expiry,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})
		return
	}

	// Set cookie
	ctx.SetCookie(
		"token",
		tokenString,
		3600, // 1 hour
		"/",
		"",
		false, // Set to true in production for HTTPS
		true,  // HTTP only
	)

	// Return the created user (excluding sensitive information like password) and the JWT token
	ctx.JSON(http.StatusCreated, gin.H{
		"id":         user.ID,
		"first_name": user.FirstName,
		"username":   user.Username,
		"last_name":  user.LastName,
		"email":      user.Email,
		"avatarUrl":  user.AvatarUrl,
		"token":      tokenString,
	})
}

func (pc *Play4GoodController) LoginUser(ctx *gin.Context) {
	// Parse and validate the request
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Retrieve the user from the database
	user, err := pc.db.GetUserByEmail(pc.ctx, req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Verify the password
	if err := util.CheckPassword(req.Password, user.PasswordHash); err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check if the user already has a valid token
	userToken, err := pc.db.GetUserTokenByUserID(pc.ctx, sql.NullInt32{Int32: user.ID, Valid: true})
	if err == nil && userToken.Expiry.After(time.Now()) {
		// Return the existing token if it's still valid
		ctx.JSON(http.StatusOK, gin.H{
			"id":         user.ID,
			"first_name": user.FirstName,
			"username":   user.Username,
			"last_name":  user.LastName,
			"email":      user.Email,
			"avatarUrl":  user.AvatarUrl,
			"token":      userToken.Token,
		})
		return
	}

	// If no valid token, generate a new one
	tokenString, err := util.GenerateJWT(int(user.ID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Create a new token record in the database
	expiry := time.Now().Add(24 * time.Hour) // 24-hour expiry
	_, err = pc.db.CreateUserToken(pc.ctx, db.CreateUserTokenParams{
		UserID: sql.NullInt32{Int32: user.ID, Valid: true},
		Token:  tokenString,
		Expiry: expiry,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})
		return
	}

	// Return the token to the client
	ctx.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"username":   user.Username,
		"email":      user.Email,
		"avatarUrl":  user.AvatarUrl,
		"token":      tokenString,
	})
}


func (c *Play4GoodController) GetCurrentUser(ctx *gin.Context) {
    userID, exists := ctx.Get("userID")
    if !exists {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
        return
    }

    user, err := c.db.GetUser(ctx, int32(userID.(int)))
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
        return
    }

    ctx.JSON(http.StatusOK, user)
}

func (pc *Play4GoodController) LogoutUser(ctx *gin.Context) {
    // Clear the cookie
    ctx.SetCookie(
        "token",
        "",
        -1,
        "/",
        "",
        false,
        true,
    )

    ctx.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// User Controllers
func (c *Play4GoodController) CreateUser(ctx *gin.Context) {
	var payload *schemas.UserCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateUserParams{
		Username:     payload.Username,
		Email:        payload.Email,
		PasswordHash: payload.Password, // Note: You should hash this password before storing
		FirstName:    sql.NullString{String: payload.FirstName, Valid: payload.FirstName != ""},
		LastName:     sql.NullString{String: payload.LastName, Valid: payload.LastName != ""},
		AvatarUrl:    sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
	}

	user, err := c.db.CreateUser(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) GetUser(ctx *gin.Context) {
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	id := int32(id64)

	user, err := c.db.GetUser(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) GetUserByEmail(ctx *gin.Context) {
	email := ctx.Param("email")

	if email == "" {
		ctx.JSON(http.StatusBadRequest, errorResponse(fmt.Errorf("email is required")))
		return
	}

	user, err := c.db.GetUserByEmail(ctx, email)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("user not found")))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) UpdateUser(ctx *gin.Context) {
	// Extract the token from the Authorization header
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
		return
	}

	// Extract the token string
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// Parse and validate the token
	userID, err := util.ParseToken(tokenString)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Get the user ID from the URL parameter and ensure it matches the token's user ID
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	id := int32(id64)
	if err != nil || id != int32(userID) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized access"})
		return
	}

	// Proceed with updating the user information
	var payload *schemas.UserUpdateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	arg := db.UpdateUserParams{
		ID:        id,
		Username:  payload.Username,
		Email:     payload.Email,
		FirstName: sql.NullString{String: payload.FirstName, Valid: payload.FirstName != ""},
		LastName:  sql.NullString{String: payload.LastName, Valid: payload.LastName != ""},
		AvatarUrl: sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
	}

	user, err := c.db.UpdateUser(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) DeleteUser(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	id := int32(id64)

	err = c.db.DeleteUser(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Team Controllers
func (c *Play4GoodController) CreateTeam(ctx *gin.Context) {

	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Parse the request payload
	var payload *schemas.TeamCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Create the team, associating it with the authenticated user (userID)
	arg := db.CreateTeamParams{
		Name:        payload.Name,
		Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
		AvatarUrl:   sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
	}

	team, err := c.db.CreateTeam(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	ctx.JSON(http.StatusOK, team)
}

func (c *Play4GoodController) GetTeam(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	id := int32(id64)
	team, err := c.db.GetTeam(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, team)
}

func (c *Play4GoodController) UpdateTeam(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	id := int32(id64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var payload *schemas.TeamUpdateRequest

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.UpdateTeamParams{
		ID:          id,
		Name:        payload.Name,
		Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
		AvatarUrl:   sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
	}

	team, err := c.db.UpdateTeam(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, team)
}

func (c *Play4GoodController) DeleteTeam(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	id := int32(id64)

	err = c.db.DeleteTeam(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Team deleted successfully"})
}

// Cause Controllers
func (c *Play4GoodController) CreateCause(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.CauseCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateCauseParams{
		Name:        payload.Name,
		Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
		Goal: sql.NullString{
			String: strconv.FormatFloat(payload.Goal, 'f', -1, 64),
			Valid:  true,
		},
		StartDate: sql.NullTime{
			Time:  payload.StartDate,
			Valid: !payload.StartDate.IsZero(),
		},
		EndDate: sql.NullTime{
			Time:  payload.EndDate,
			Valid: !payload.EndDate.IsZero(),
		},
		Status:   sql.NullString{String: payload.Status, Valid: payload.Status != ""},
		Image:    sql.NullString{String: payload.Image, Valid: payload.Image != ""},
		Category: sql.NullString{String: payload.Category, Valid: payload.Category != ""},
	}

	cause, err := c.db.CreateCause(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, cause)
}

func (c *Play4GoodController) GetCause(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	id := int32(id64)
	cause, err := c.db.GetCause(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, cause)
}
func (c *Play4GoodController) UpdateCause(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	id := int32(id64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var payload *schemas.CauseUpdateRequest

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.UpdateCauseParams{
		ID:          id,
		Name:        payload.Name,
		Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
		Goal: sql.NullString{
			String: strconv.FormatFloat(payload.Goal, 'f', -1, 64),
			Valid:  true,
		},
		StartDate: sql.NullTime{
			Time:  payload.StartDate,
			Valid: !payload.StartDate.IsZero(),
		},
		EndDate: sql.NullTime{
			Time:  payload.EndDate,
			Valid: !payload.EndDate.IsZero(),
		},
		Status:   sql.NullString{String: payload.Status, Valid: payload.Status != ""},
		Image:    sql.NullString{String: payload.Image, Valid: payload.Image != ""},
		Category: sql.NullString{String: payload.Category, Valid: payload.Category != ""},
	}

	cause, err := c.db.UpdateCause(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, cause)
}
func (c *Play4GoodController) DeleteCause(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	id := int32(id64)

	err = c.db.DeleteCause(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Cause deleted successfully"})
}

// Donation Controllers
func (c *Play4GoodController) CreateDonation(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.DonationCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateDonationParams{
		UserID: sql.NullInt32{
			Int32: int32(payload.UserID),
			Valid: true,
		},
		CauseID: sql.NullInt32{
			Int32: int32(payload.CauseID),
			Valid: true,
		},
		TeamID: sql.NullInt32{
			Int32: int32(payload.TeamID),
			Valid: payload.TeamID != 0,
		},
		Amount: sql.NullString{
			String: strconv.FormatFloat(payload.Amount, 'f', -1, 64),
			Valid:  true,
		},
		DonationType: sql.NullString{String: payload.DonationType, Valid: payload.DonationType != ""},
	}

	donation, err := c.db.CreateDonation(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, donation)
}

func (c *Play4GoodController) GetDonation(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	id := int32(id64)
	donation, err := c.db.GetDonation(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, donation)
}

// AddUserToTeam adds a user to a team
func (c *Play4GoodController) AddUserToTeam(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.UserTeamCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.AddUserToTeamParams{
		UserID: int32(payload.UserID),
		TeamID: int32(payload.TeamID),
		Role:   payload.Role,
	}

	userTeam, err := c.db.AddUserToTeam(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, userTeam)
}

// UpdateUserTeamRole updates a user's role in a team
func (c *Play4GoodController) UpdateUserTeamRole(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	userID, err := strconv.ParseInt(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	teamID, err := strconv.ParseInt(ctx.Param("teamId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var payload *schemas.UserTeamUpdateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.UpdateUserTeamRoleParams{
		UserID: int32(userID),
		TeamID: int32(teamID),
		Role:   payload.Role,
	}

	userTeam, err := c.db.UpdateUserTeamRole(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, userTeam)
}

// RemoveUserFromTeam removes a user from a team
func (c *Play4GoodController) RemoveUserFromTeam(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	userID, err := strconv.ParseInt(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	teamID, err := strconv.ParseInt(ctx.Param("teamId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.RemoveUserFromTeamParams{
		UserID: int32(userID),
		TeamID: int32(teamID),
	}

	err = c.db.RemoveUserFromTeam(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User removed from team successfully"})
}

// Leaderboard Controllers
func (c *Play4GoodController) CreateLeaderboard(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.LeaderboardCreateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateLeaderboardParams{
		Name: payload.Name,
		Type: sql.NullString{String: payload.Type, Valid: payload.Type != ""},
		StartDate: sql.NullTime{
			Time:  payload.StartDate,
			Valid: !payload.StartDate.IsZero(),
		},
		EndDate: sql.NullTime{
			Time:  payload.EndDate,
			Valid: !payload.EndDate.IsZero(),
		},
	}

	leaderboard, err := c.db.CreateLeaderboard(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, leaderboard)
}

func (c *Play4GoodController) GetLeaderboard(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	id := int32(id64)
	leaderboard, err := c.db.GetLeaderboard(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, leaderboard)
}

func (c *Play4GoodController) UpdateLeaderboardEntry(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.LeaderboardEntryUpdateRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.UpdateLeaderboardEntryParams{
		LeaderboardID: int32(payload.LeaderboardID),
		UserID:        int32(payload.UserID),
		TeamID:        int32(payload.TeamID),
		Score: sql.NullString{
			String: strconv.FormatFloat(payload.Score, 'f', -1, 64),
			Valid:  true,
		},
	}

	entry, err := c.db.UpdateLeaderboardEntry(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, entry)
}

// ListUsers returns a list of all users
func (c *Play4GoodController) ListUsers(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	var payload *schemas.ListUsersRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListUsersParams{
		Limit:  int32(payload.Limit),
		Offset: int32(payload.Offset),
	}
	users, err := c.db.ListUsers(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, users)
}

// ListCauses returns a list of all causes
func (c *Play4GoodController) ListCauses(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var payload *schemas.ListCausesRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListCausesParams{
		Limit:  int32(payload.Limit),
		Offset: int32(payload.Offset),
	}

	causes, err := c.db.ListCauses(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, causes)
}

// ListDonations returns a list of all donations
func (c *Play4GoodController) ListDonations(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var payload *schemas.ListDonationsRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListDonationsParams{
		Limit:  int32(payload.Limit),
		Offset: int32(payload.Offset),
	}
	donations, err := c.db.ListDonations(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, donations)
}

// ListTeams returns a list of all teams
func (c *Play4GoodController) ListTeams(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var payload *schemas.ListTeamsRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListTeamsParams{
		Limit:  int32(payload.Limit),
		Offset: int32(payload.Offset),
	}
	teams, err := c.db.ListTeams(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, teams)
}

// ListLeaderboards returns a list of all leaderboards
func (c *Play4GoodController) ListLeaderboards(ctx *gin.Context) {
	err := c.validateToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var payload *schemas.ListLeaderBoardsRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListLeaderboardsParams{
		Limit:  int32(payload.Limit),
		Offset: int32(payload.Offset),
	}

	leaderboards, err := c.db.ListLeaderboards(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, leaderboards)
}


