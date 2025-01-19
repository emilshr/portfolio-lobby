package middleware

import (
	"github.com/gin-contrib/cors"
	"portfolio/lobby/constants"
)

func CorsMiddleware() cors.Config {
	config := cors.DefaultConfig()
	config.AllowCredentials = true
	if constants.ENV == "local" {
		config.AllowOrigins = []string{"http://localhost:5173", "http://localhost"}
	} else {
		config.AllowOrigins = []string{"https://emilshr.com", "https://www.emilshr.com"}
	}
	config.AddAllowHeaders("Authorization", "Origin", "Content-Type", "Set-Cookie", "Credentials", "Content-Length", "Access-Control-Allow-Credentials")
	config.AddExposeHeaders("Set-Cookie")

	return config
}
