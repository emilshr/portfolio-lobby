package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
)

func ResetPassword(context *gin.Context) {
	password := context.Request.FormValue("password")
	token, foundParam := context.Params.Get("token")

	if !foundParam {
		context.JSON(http.StatusBadRequest, gin.H{"message": "No token found"})
	}

	decodedToken, err := service.DecodePasswordResetToken(token)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid token"})
	}

	isUpdated, err := service.UpdatePassword(password, decodedToken.Email)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update password"})
	}

	if isUpdated {
		context.Status(http.StatusOK)
	} else {
		context.Status(http.StatusBadRequest)
	}
}
