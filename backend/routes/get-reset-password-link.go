package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
)

func GetResetPasswordLink(context *gin.Context) {
	var passwordResetInput struct {
		Email string `json:"email" binding:"required" form:"email"`
	}

	if err := context.Bind(&passwordResetInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	signedToken, err := service.CreatePasswordResetToken(passwordResetInput.Email)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	} else {
		context.JSON(http.StatusOK, gin.H{"data": signedToken})
	}
}
