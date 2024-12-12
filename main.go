package main

import (
	"net/http"
	"portfolio/lobby/types"
	"strconv"

	"github.com/gin-gonic/gin"
)

var persons = []types.Person{
	{Id: 1, Name: "John"},
	{Id: 2, Name: "Another Abby"},
}

func getData(context *gin.Context) {
	context.IndentedJSON(http.StatusOK, persons)
}

func getDataById(context *gin.Context) {
	id := context.Param("id")
	parsedId, err := strconv.Atoi(id)

	if err != nil {
		panic(1)
	}

	for _, person := range persons {
		if person.Id == int8(parsedId) {
			context.IndentedJSON(http.StatusOK, person)
			return
		}
	}
	context.Status(http.StatusNotFound)
}

func main() {
	router := gin.Default()
	router.GET("/people", getData)
	router.GET("/people/:id", getDataById)

	router.Run("localhost:8080")
}
