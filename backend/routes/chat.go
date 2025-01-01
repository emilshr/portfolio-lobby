package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
)

func SendMessage(context *gin.Context) {
	message := context.Request.FormValue("message")
	tokenClaims, err := getUserAttributesFromContext(context)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	isSent, err := service.SendMessage(message, tokenClaims.userId)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if isSent {
		context.Status(http.StatusCreated)
	} else {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Message not sent"})
	}
}

func ListMessages(context *gin.Context) {
	fetchedMessages, err := service.ListMessages()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch messages"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"messages": fetchedMessages})
}
