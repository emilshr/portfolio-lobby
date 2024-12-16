package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/services"
)

func Login(context *gin.Context) {
	context.Status(http.StatusInternalServerError)

	email := context.Request.FormValue("email")
	password := context.Request.FormValue("password")

	result := service.Login(email, password)

	var httpStatus int

	if result.Status {
		httpStatus = http.StatusOK
	} else {
		httpStatus = http.StatusUnauthorized
	}
	context.JSON(httpStatus, result)
}
