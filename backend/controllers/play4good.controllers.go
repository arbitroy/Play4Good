package controllers

import (
	"context"
	"database/sql"
	"net/http"

	db "play4good-backend/db/sqlc"
	"play4good-backend/schemas"
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

// User Controllers
func (c *Play4GoodController) CreateUser(ctx *gin.Context) {
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

    user, err := c.db .CreateUser(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) GetUser(ctx *gin.Context) {
    id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
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

func (c *Play4GoodController) UpdateUser(ctx *gin.Context) {
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

    user, err := c.db .UpdateUser(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, user)
}

func (c *Play4GoodController) DeleteUser(ctx *gin.Context) {
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

    team, err := c.db.CreateTeam(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, team)
}

func (c *Play4GoodController) GetTeam (ctx *gin.Context) {
	id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
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

func (c *Play4GoodController) UpdateTeam (ctx *gin.Context) {
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
        

    team, err := c.db.UpdateTeam(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, team)
}

func (c *Play4GoodController) DeleteTeam (ctx *gin.Context){
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

    cause, err := c.db .CreateCause(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, cause)
}

func (c *Play4GoodController) GetCause(ctx *gin.Context){
    id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
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
func (c *Play4GoodController) UpdateCause(ctx *gin.Context){
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
        ID: id,
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
        

    cause, err := c.db.UpdateCause(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, cause)
}
func (c *Play4GoodController) DeleteCause(ctx *gin.Context){
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

    donation, err := c.db .CreateDonation(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, donation)
}

func (c *Play4GoodController) GetDonation(ctx *gin.Context){
    id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
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

// Leaderboard Controllers
func (c *Play4GoodController) CreateLeaderboard(ctx *gin.Context) {
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

    leaderboard, err := c.db .CreateLeaderboard(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, leaderboard)
}

func (c *Play4GoodController) GetLeaderboard(ctx *gin.Context){
    id64, err := strconv.ParseInt(ctx.Param("id"), 10,32)
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

    entry, err := c.db .UpdateLeaderboardEntry(ctx, arg)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, errorResponse(err))
        return
    }

    ctx.JSON(http.StatusOK, entry)
}