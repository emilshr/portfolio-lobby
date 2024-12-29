package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	"portfolio/lobby/services"
)

func Login(context *gin.Context) {
	email := context.Request.FormValue("email")
	password := context.Request.FormValue("password")

	result, err := service.Login(email, password)

	var httpStatus int

	if err != nil && result != nil {
		httpStatus = http.StatusOK
		context.SetCookie(constants.REFRESH_TOKEN_COOKIE, result.RefreshToken, 86400, "/", constants.BACKEND_HOST_DOMAIN, true, true)
		context.JSON(httpStatus, result)
	} else {
		httpStatus = http.StatusUnauthorized
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
	}
}
