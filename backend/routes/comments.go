package routes

import (
	"net/http"
	service "portfolio/lobby/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func ListComments(context *gin.Context) {
	postSlug := context.Param("postSlug")
	fetchedComments, err := service.FetchComments(postSlug)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch comments"})
		return
	}

	context.JSON(http.StatusOK, fetchedComments)
}

func AddComment(context *gin.Context) {
	tokenClaims, err := getUserAttributesFromContext(context)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	var addCommentInput struct {
		Comment  string `json:"comment" binding:"required" form:"comment"`
		PostSlug string `json:"postSlug" binding:"required" form:"postSlug"`
	}

	if err := context.Bind(&addCommentInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	addedComment, err := service.AddComment(addCommentInput.Comment, addCommentInput.PostSlug, tokenClaims.userId)

	if err != nil || addedComment == nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"id": addedComment.Id, "comment": addedComment.Comment, "username": tokenClaims.username, "post_slug": addedComment.PostSlug, "created_at": time.Now().Local().String()})
}

func DeleteComment(context *gin.Context) {
	tokenClaims, err := getUserAttributesFromContext(context)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	commentId := context.Param("id")

	parsedCommentId, err := strconv.Atoi(commentId)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid comment id"})
		return
	}

	isDeleted, err := service.DeleteComment(int8(parsedCommentId), tokenClaims.userId)

	if err != nil || !isDeleted {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	context.Status(http.StatusNoContent)
}
