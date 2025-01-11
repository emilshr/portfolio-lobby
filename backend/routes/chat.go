package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	service "portfolio/lobby/services"
	"strconv"
)

func SendMessage(context *gin.Context) {
	var sendMessageInput struct {
		Message string `json:"message" binding:"required" form:"message"`
	}

	if err := context.Bind(&sendMessageInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	tokenClaims, err := getUserAttributesFromContext(context)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	isSent, err := service.SendMessage(sendMessageInput.Message, tokenClaims.userId)

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
	pageQuery := context.Query("page")

	var page int = 0

	if pageQuery != "" {
		parsedPage, err := strconv.Atoi(pageQuery)

		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid page number"})
			return
		}

		page = parsedPage
	}

	paginatedResponse, err := service.ListMessages(page)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch messages"})
		return
	}

	context.JSON(http.StatusOK, paginatedResponse)
}
