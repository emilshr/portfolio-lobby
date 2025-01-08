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

	fetchedToken, decodedToken, err := service.IsPasswordResetTokenValid(token)

	if decodedToken == nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	isUpdated, err := service.UpdatePassword(password, decodedToken.Email, fetchedToken.Id)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if isUpdated {
		context.Status(http.StatusOK)
	} else {
		context.Status(http.StatusBadRequest)
	}
}
