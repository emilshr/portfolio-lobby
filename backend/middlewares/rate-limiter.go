package middleware

import "github.com/gin-gonic/gin"

func RateLimiter(ctx *gin.Context) {
	println("Received req from IP ", ctx.ClientIP())
}
