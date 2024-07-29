package main

import (
    "context"
    "database/sql"
    "fmt"
    "log"
    "net/http"

    "play4good-backend/controllers"
    dbCon "play4good-backend/db/sqlc"
    "play4good-backend/routes"
    "play4good-backend/util"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
)

var (
    server *gin.Engine
    db     *dbCon.Queries
    ctx    context.Context

    Play4GoodController *controllers.Play4GoodController
    Play4GoodRoutes     routes.Play4GoodRoutes
)

func init() {
    ctx = context.TODO()
    config, err := util.LoadConfig(".")

    if err != nil {
        log.Fatalf("could not loadconfig: %v", err)
    }

    conn, err := sql.Open(config.DbDriver, config.DbSource)
    if err != nil {
        log.Fatalf("Could not connect to database: %v", err)
    }

    db = dbCon.New(conn)

    fmt.Println("PostgreSql connected successfully...")

    Play4GoodController = controllers.NewPlay4GoodController(db, ctx)
    Play4GoodRoutes = routes.NewPlay4GoodRoutes(Play4GoodController)

    server = gin.Default()
}

func main() {
    config, err := util.LoadConfig(".")

    if err != nil {
        log.Fatalf("failed to load config: %v", err)
    }

    router := server.Group("/api")

    router.GET("/healthcheck", func(ctx *gin.Context) {
        ctx.JSON(http.StatusOK, gin.H{"message": "The Play4Good API is working fine"})
    })

    Play4GoodRoutes.SetupRoutes(router)

    server.NoRoute(func(ctx *gin.Context) {
        ctx.JSON(http.StatusNotFound, gin.H{"status": "failed", "message": fmt.Sprintf("The specified route %s not found", ctx.Request.URL)})
    })

    log.Fatal(server.Run(":" + config.ServerAddress))
}