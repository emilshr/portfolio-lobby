package main

import (
	"portfolio/lobby/db"
	middleware "portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
	"portfolio/lobby/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()
	service.InitializeEmailClient()

	router := gin.Default()
	// router.Use(middleware.CorsMiddleware())

	config := cors.DefaultConfig()
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Authorization"}
	config.AllowOrigins = []string{"http://localhost:5173"}

	router.Use(cors.New(config))

	// Public routes
	router.GET("/whoami", routes.Me)
	router.POST("/login", routes.Login)
	router.GET("/refresh", routes.Refresh)
	router.POST("/register", routes.Register)
	router.GET("/confirm/:token", routes.ConfirmAccount)
	router.POST("/get-reset-password", routes.GetResetPasswordLink)
	router.POST("/reset-password/:token", routes.ResetPassword)

	// Protected routes
	router.Use(middleware.ProtectedRoute())
	router.POST("/messages", routes.SendMessage)
	router.GET("/messages", routes.ListMessages)
	router.POST("/logout", routes.Logout)

	router.Run("0.0.0.0:8080")
}
