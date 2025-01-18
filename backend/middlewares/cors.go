package middleware

import (
	"net/http"
	"portfolio/lobby/constants"

	"github.com/gin-gonic/gin"
)

func CorsMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		if constants.ENV == "local" {
			context.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		} else {
			context.Writer.Header().Set("Access-Control-Allow-Origin", "https://emilshr.com")
		}
		context.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		context.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		context.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if context.Request.Method == "OPTIONS" {
			context.AbortWithStatus(http.StatusNoContent)
			return
		}

		context.Next()
	}
}
