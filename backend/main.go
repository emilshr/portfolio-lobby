package main

import (
	"github.com/gin-gonic/gin"
	"portfolio/lobby/db"
	"portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
)

func main() {
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()

	router := gin.Default()
	router.Use(middleware.CorsMiddleware())

	router.POST("/login", routes.Login)
	router.POST("/register", routes.Register)

	router.Run("0.0.0.0:8080")
}
