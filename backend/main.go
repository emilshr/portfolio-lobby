package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	"portfolio/lobby/types"
	"strconv"
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
	db.InitializeAndTestDatabaseConnection()

	currentEnvironment := os.Getenv(constants.ENV)

	fmt.Printf("Current environment is %s", currentEnvironment)

	router := gin.Default()
	router.GET("/people", getData)
	router.GET("/people/:id", getDataById)

	fmt.Println("The env var is", os.Getenv("TEST"))

	router.Run("0.0.0.0:8080")
}
