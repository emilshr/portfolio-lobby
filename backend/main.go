package main

import (
	"github.com/gin-gonic/gin"
	"portfolio/lobby/db"
	"portfolio/lobby/routes"
)

func main() {
	db.InitializeAndTestDatabaseConnection()
	db.CreateSchemas()

	router := gin.Default()
	router.POST("/login", routes.Login)

	router.Run("0.0.0.0:8080")
}
