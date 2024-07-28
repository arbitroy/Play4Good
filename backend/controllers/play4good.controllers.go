package controllers

import (
	"database/sql"
	"net/http"

	db "play4good-backend/db/sqlc"
	"play4good-backend/schemas"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Server struct {
    db   *db.Queries
    router *gin.Engine
}

func NewServer(db  *db.Queries) *Server {
    server := &Server{db : db }
    router := gin.Default()

    // User routes
    router.POST("/users", server.createUser)
    router.GET("/users/:id", server.getUser)
    router.PUT("/users/:id", server.updateUser)
    router.DELETE("/users/:id", server.deleteUser)

    // Team routes
    router.POST("/teams", server.createTeam)
    router.GET("/teams/:id", server.getTeam)
    router.PUT("/teams/:id", server.updateTeam)
    router.DELETE("/teams/:id", server.deleteTeam)

    // Cause routes
    router.POST("/causes", server.createCause)
    router.GET("/causes/:id", server.getCause)
    router.PUT("/causes/:id", server.updateCause)
    router.DELETE("/causes/:id", server.deleteCause)

    // Donation routes
    router.POST("/donations", server.createDonation)
    router.GET("/donations/:id", server.getDonation)

    // Leaderboard routes
    router.POST("/leaderboards", server.createLeaderboard)
    router.GET("/leaderboards/:id", server.getLeaderboard)
    router.PUT("/leaderboards/:id/entries", server.updateLeaderboardEntry)

    server.router = router
    return server
}

func (server *Server) Start(address string) error {
    return server.router.Run(address)
}

func errorResponse(err error) gin.H {
    return gin.H{"error": err.Error()}
}

// User Controllers
func (server *Server) createUser(ctx *gin.Context) {
    var payload *schemas.UserCreateRequest;
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

    user, err := server.db .CreateUser(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, user)
}

func (server *Server) getUser(ctx *gin.Context) {
    id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

	id := int32(id64)

    user, err := server.db.GetUser(ctx, id)
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

func (server *Server) updateUser(ctx *gin.Context) {
    id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	id := int32(id64)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

	var payload *schemas.UserUpdateRequest
	
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

    arg := db.UpdateUserParams{
        ID:        id,
        Username:  payload.Username,
        Email:     payload.Email,
        FirstName:    sql.NullString{String: payload.FirstName, Valid: payload.FirstName != ""},
		LastName:     sql.NullString{String: payload.LastName, Valid: payload.LastName != ""},
        AvatarUrl: sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
    }

    user, err := server.db .UpdateUser(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, user)
}

func (server *Server) deleteUser(ctx *gin.Context) {
    id64, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

	id := int32(id64)

    err = server.db .DeleteUser(ctx, id)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Team Controllers
func (server *Server) createTeam(ctx *gin.Context) {
    var payload *schemas.TeamCreateRequest
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

    arg := db.CreateTeamParams{
        Name:        payload.Name,
        Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
        AvatarUrl:   sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
    }

    team, err := server.db .CreateTeam(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, team)
}

func (server *Server) getTeam (ctx *gin.Context) {
	id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }
	id := int32(id64)
    team, err := server.db.GetTeam(ctx, id)
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

func (server *Server) updateTeam (ctx *gin.Context) {
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
		ID:			 id,
		Name:        payload.Name,
        Description: sql.NullString{String: payload.Description, Valid: payload.Description != ""},
        AvatarUrl:   sql.NullString{String: payload.AvatarURL, Valid: payload.AvatarURL != ""},
	}
        

    team, err := server.db.UpdateTeam(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, team)
}

// Cause Controllers
func (server *Server) createCause(ctx *gin.Context) {
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
        EndDate:     sql.NullTime{
			Time:  payload.EndDate,
			Valid: !payload.EndDate.IsZero(),
		},
        Status:     sql.NullString{String: payload.Status, Valid: payload.Status != ""},
    }

    cause, err := server.db .CreateCause(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, cause)
}

// Implement getCause, updateCause, deleteCause similarly

// Donation Controllers
func (server *Server) createDonation(ctx *gin.Context) {
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
        DonationType:  sql.NullString{String: payload.DonationType, Valid: payload.DonationType != ""},
    }

    donation, err := server.db .CreateDonation(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, donation)
}

// Implement getDonation similarly

// Leaderboard Controllers
func (server *Server) createLeaderboard(ctx *gin.Context) {
    var payload *schemas.LeaderboardCreateRequest
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

    arg := db.CreateLeaderboardParams{
        Name:      payload.Name,
        Type:      sql.NullString{String: payload.Type, Valid: payload.Type != ""},
        StartDate: sql.NullTime{
			Time:  payload.StartDate,
			Valid: !payload.StartDate.IsZero(),
		},
        EndDate:     sql.NullTime{
			Time:  payload.EndDate,
			Valid: !payload.EndDate.IsZero(),
		},
    }

    leaderboard, err := server.db .CreateLeaderboard(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, leaderboard)
}

// Implement getLeaderboard similarly

func (server *Server) updateLeaderboardEntry(ctx *gin.Context) {
    var payload *schemas.LeaderboardEntryUpdateRequest
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        ctx.JSON(http.StatusBadRequest, errorResponse(err))
        return
    }

    arg := db.UpdateLeaderboardEntryParams{
        LeaderboardID: int32(payload.LeaderboardID),
        UserID:        int32(payload.UserID),
        TeamID:        int32(payload.TeamID),
        Score:         sql.NullString{
			String: strconv.FormatFloat(payload.Score, 'f', -1, 64),
			Valid:  true,
		},
    }

    entry, err := server.db .UpdateLeaderboardEntry(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, entry)
}