package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	service "portfolio/lobby/services"
)

func Logout(context *gin.Context) {
	refreshToken, exists := context.Get("refreshToken")

	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
	}

	isDeleted, err := service.Logout(refreshToken.(string))

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"code": err.Error()})
	}

	if isDeleted {
		context.SetCookie(constants.REFRESH_TOKEN_COOKIE, "", -1, "/", "", true, true)
	}
	context.Status(http.StatusOK)
}
