package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/db"
	middleware "portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
	"portfolio/lobby/services"
)

func main() {
	// Initializing required clients & dependencies
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()
	db.InitializeRedisClient()
	service.InitializeEmailClient()

	// Initializing GIN router
	router := gin.Default()
	router.SetTrustedProxies(nil)

	// Middlewares
	router.Use(cors.New(middleware.CorsMiddleware()))

	// health-check route
	router.GET("/health-check", middleware.RateLimiter, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "OK"})
	})

	// Public routes
	router.GET("/whoami", routes.Me)
	router.POST("/login", middleware.RateLimiter, routes.Login)
	router.GET("/refresh", routes.Refresh)
	router.POST("/register", middleware.RateLimiter, routes.Register)
	router.GET("/confirm/:token", routes.ConfirmAccount)
	router.POST("/get-reset-password", routes.GetResetPasswordLink)
	router.POST("/reset-password/:token", routes.ResetPassword)
	router.GET("/messages", routes.ListMessages)
	router.GET("/comments", routes.ListComments)

	// Protected routes
	router.Use(middleware.ProtectedRoute())
	router.POST("/messages", middleware.RateLimiter, routes.SendMessage)
	router.POST("/logout", routes.Logout)
	router.POST("/comments", routes.AddComment)
	router.DELETE("/comments/:id", routes.DeleteComment)

	// Running the server
	router.Run("0.0.0.0:8080")
}
