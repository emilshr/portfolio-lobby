package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
)

func GetResetPasswordLink(context *gin.Context) {
	email := context.Request.FormValue("email")

	signedToken, err := service.CreatePasswordResetToken(email)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Error while generating reset password link"})
	} else {
		context.JSON(http.StatusOK, gin.H{"data": signedToken})
	}
}
