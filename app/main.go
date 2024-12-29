package main

import (
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	"portfolio/lobby/middlewares"
	"portfolio/lobby/routes"
	"portfolio/lobby/services"

	"github.com/gin-gonic/gin"
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
	router.GET("/test", func(context *gin.Context) {
		val, _ := context.Cookie(constants.REFRESH_TOKEN_COOKIE)
		println("value is ", val, context.Request.Host, context.Request.Header)
		context.Status(200)
	})

	router.Run("0.0.0.0:8080")
}
