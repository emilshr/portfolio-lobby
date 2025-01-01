package routes

import (
	"errors"
	"github.com/gin-gonic/gin"
)

type Response struct {
	userId   int8
	username string
}

func getUserAttributesFromContext(context *gin.Context) (*Response, error) {
	userId, exists := context.Get("userId")

	if !exists {
		return nil, errors.New("no user id found in context")
	}

	username, exists := context.Get("username")
	if !exists {
		return nil, errors.New("no username found in context")
	}

	response := Response{userId: userId.(int8), username: username.(string)}

	return &response, nil
}
