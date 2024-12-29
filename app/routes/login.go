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

	result := service.Login(email, password)

	var httpStatus int

	if result.Status {
		httpStatus = http.StatusOK
	} else {
		httpStatus = http.StatusUnauthorized
	}
	context.SetCookie(constants.REFRESH_TOKEN_COOKIE, result.RefreshToken, 86400, "/", constants.BACKEND_HOST_DOMAIN, true, true)
	context.JSON(httpStatus, result)
}
