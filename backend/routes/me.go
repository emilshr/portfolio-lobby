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
		fmt.Println("No refresh token found")
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
		return
	}

	refreshTokenClaims, isRefreshTokenValid, err := service.DecodeRefreshToken(refreshToken)

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
		return
	}

	if isRefreshTokenValid && time.Unix(refreshTokenClaims.Expiry, 0).After(time.Now()) {
		if len(token) == 0 {
			context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
			return
		} else {
			accessTokenClaims, isAccessTokenValid, err := service.DecodeLoginToken(token)
			if err != nil {
				context.JSON(http.StatusUnauthorized, gin.H{"code": "access_token_expired", "message": err.Error()})
				return
			}
			if time.Unix(accessTokenClaims.Expiry, 0).After(time.Now()) && isAccessTokenValid {
				context.JSON(http.StatusOK, gin.H{"username": accessTokenClaims.Username})
				return
			} else {
				context.JSON(http.StatusUnauthorized, gin.H{"code": "access_token_expired"})
				return
			}
		}
	} else {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "user_not_logged_in"})
	}
}
