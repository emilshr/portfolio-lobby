package routes

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	service "portfolio/lobby/services"
)

func ConfirmAccount(context *gin.Context) {
	token, foundParam := context.Params.Get("token")

	if !foundParam {
		log.Fatal("No token found in the link")
	}

	claims, isTokenValid := service.DecodeConfirmationToken(token)

	if claims == nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Token has expired"})
		return
	}

	if isTokenValid {
		isUserAlreadyVerified, _ := service.CheckUserStatus(claims.UserId)
		if isUserAlreadyVerified {
			context.JSON(http.StatusOK, gin.H{"message": "User already verified"})
			return
		}

		service.ConfirmUser(claims.UserId)
		context.JSON(http.StatusOK, gin.H{"message": "Your account is verified"})
	} else {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Your account is not verified"})
	}
}
