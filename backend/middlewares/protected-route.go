package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	service "portfolio/lobby/services"
	"time"
)

func ProtectedRoute() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if len(token) == 0 {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		decodedToken, isValid, err := service.DecodeLoginToken(token)

		if err != nil || !isValid {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		if decodedToken.ExpiresAt.Time.Before(time.Now()) {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		refreshToken, err := ctx.Cookie(constants.REFRESH_TOKEN_COOKIE)

		if err != nil {
			fmt.Println("Error while accessing access token", err.Error())
			ctx.Status(http.StatusUnauthorized)
			return
		}

		ctx.Set("userId", decodedToken.UserId)
		ctx.Set("username", decodedToken.Username)
		ctx.Set("refreshToken", refreshToken)
		ctx.Next()
	}
}
