package routes

import (
    "play4good-backend/controllers"
    "github.com/gin-gonic/gin"
)

type Play4GoodRoutes struct {
    play4goodController *controllers.Play4GoodController
}

func NewPlay4GoodRoutes(play4goodController *controllers.Play4GoodController) Play4GoodRoutes {
    return Play4GoodRoutes{play4goodController}
}

func (pr *Play4GoodRoutes) SetupRoutes(rg *gin.RouterGroup) {
    router := rg.Group("")

	router.POST("/signup", pr.play4goodController.SignUpUser)
    router.POST("/login", pr.play4goodController.LoginUser)
	// User routes
	router.POST("/users", pr.play4goodController.CreateUser)
	router.GET("/users/id/:id", pr.play4goodController.GetUser)
	router.GET("/users/email/:email", pr.play4goodController.GetUserByEmail)
	router.PUT("/users/:id", pr.play4goodController.UpdateUser)
	router.DELETE("/users/:id", pr.play4goodController.DeleteUser)

	// Team routes
	router.POST("/teams", pr.play4goodController.CreateTeam)
	router.GET("/teams/:id", pr.play4goodController.GetTeam)
	router.PUT("/teams/:id", pr.play4goodController.UpdateTeam)
	router.DELETE("/teams/:id", pr.play4goodController.DeleteTeam)

	// Cause routes
	router.POST("/causes", pr.play4goodController.CreateCause)
	router.GET("/causes/:id", pr.play4goodController.GetCause)
	router.PUT("/causes/:id", pr.play4goodController.UpdateCause)
	router.DELETE("/causes/:id", pr.play4goodController.DeleteCause)

	// Donation routes
	router.POST("/donations", pr.play4goodController.CreateDonation)
	router.GET("/donations/:id", pr.play4goodController.GetDonation)

	// Leaderboard routes
	router.POST("/leaderboards", pr.play4goodController.CreateLeaderboard)
	router.GET("/leaderboards/:id", pr.play4goodController.GetLeaderboard)
	router.PUT("/leaderboards/:id/entries", pr.play4goodController.UpdateLeaderboardEntry)

	router.POST("/user-team", pr.play4goodController.AddUserToTeam)
    router.PUT("/user-team/:userId/:teamId", pr.play4goodController.UpdateUserTeamRole)
    router.DELETE("/user-team/:userId/:teamId", pr.play4goodController.RemoveUserFromTeam)
}