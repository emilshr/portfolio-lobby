package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	"portfolio/lobby/services"
)

func Login(context *gin.Context) {
	var loginInput struct {
		Email    string `json:"email" binding:"required" form:"email"`
		Password string `json:"password" binding:"required" form:"password"`
	}

	if err := context.Bind(&loginInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	result, err := service.Login(loginInput.Email, loginInput.Password)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	_, err = service.StoreRefreshToken(result.RefreshToken)

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	context.SetSameSite(http.SameSiteNoneMode)
	context.SetCookie(constants.REFRESH_TOKEN_COOKIE, result.RefreshToken, 86400, "/", "", false, true)

	context.JSON(http.StatusOK, gin.H{"accessToken": result.AccessToken, "username": result.Username})

}
