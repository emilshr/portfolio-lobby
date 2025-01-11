package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
)

func ResetPassword(context *gin.Context) {
	var resetPasswordInput struct {
		Password string `json:"password" binding:"required" form:"password"`
	}

	if err := context.Bind(&resetPasswordInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	token, foundParam := context.Params.Get("token")

	if !foundParam {
		context.JSON(http.StatusBadRequest, gin.H{"message": "No token found"})
	}

	fetchedToken, decodedToken, err := service.IsPasswordResetTokenValid(token)

	if decodedToken == nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	isUpdated, err := service.UpdatePassword(resetPasswordInput.Password, decodedToken.Email, fetchedToken.Id)

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
