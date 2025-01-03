package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	service "portfolio/lobby/services"
	"time"
)

func Me(context *gin.Context) {
	token := context.Request.Header.Get("Authorization")
	refreshToken, err := context.Cookie(constants.REFRESH_TOKEN_COOKIE)
	if err != nil {
		fmt.Println("No refresh token found ", err.Error())
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
		return
	}

	refreshTokenClaims, isRefreshTokenValid, err := service.DecodeRefreshToken(refreshToken)

	if err != nil {
		fmt.Println("Unable to decode refresh token ", err.Error())
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
		return
	}

	if isRefreshTokenValid && refreshTokenClaims.ExpiresAt.Time.After(time.Now()) {
		if len(token) == 0 {
			fmt.Println("Refresh token is valid but access token is empty")
			context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
			return
		} else {
			accessTokenClaims, isAccessTokenValid, err := service.DecodeLoginToken(token)
			if err != nil {
				println("Access token is invalid", err.Error())
				context.JSON(http.StatusUnauthorized, gin.H{"code": "access_token_expired", "message": err.Error()})
				return
			}
			if accessTokenClaims.ExpiresAt.After(time.Now()) && isAccessTokenValid {
				context.JSON(http.StatusOK, gin.H{"username": accessTokenClaims.Username})
				return
			} else {
				println("Access token has expired")
				context.JSON(http.StatusUnauthorized, gin.H{"code": "access_token_expired"})
				return
			}
		}
	} else {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
	}
}
