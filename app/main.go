package main

import (
	"github.com/gin-gonic/gin"
	"portfolio/lobby/db"
	"portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
	"portfolio/lobby/services"
)

func main() {
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()
	service.InitializeEmailClient()

	router := gin.Default()
	router.Use(middleware.CorsMiddleware())

	router.POST("/login", routes.Login)
	router.POST("/register", routes.Register)
	router.GET("/confirm/:token", routes.ConfirmAccount)
	router.POST("/get-reset-password", routes.GetResetPasswordLink)
	router.POST("/reset-password/:token", routes.ResetPassword)

	router.Run("0.0.0.0:8080")
}
