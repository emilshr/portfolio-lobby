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

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	_, err = service.StoreRefreshToken(result.RefreshToken)

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	context.SetCookie(constants.REFRESH_TOKEN_COOKIE, result.RefreshToken, 86400, "/", "", true, true)
	context.JSON(http.StatusOK, gin.H{"accessToken": result.AccessToken, "username": result.Username})

}
