package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"portfolio/lobby/db"
	middleware "portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
	"portfolio/lobby/services"
)

func main() {
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()
	service.InitializeEmailClient()

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Authorization", "Origin"}
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost"}
	config.AddAllowHeaders("Authorization", "Origin", "Content-Type", "Set-Cookie", "Credentials", "Content-Length", "Access-Control-Allow-Credentials")
	config.AddExposeHeaders("Set-Cookie")

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
