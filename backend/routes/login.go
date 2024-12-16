package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	context.Status(http.StatusInternalServerError)
}
