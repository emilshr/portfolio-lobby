package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"portfolio/lobby/db"
	"portfolio/lobby/types"
	"time"
)

func Register(context *gin.Context) {
	username := context.Request.FormValue("username")
	email := context.Request.FormValue("email")
	password := context.Request.FormValue("password")

	users := []types.User{}

	fmt.Printf("Querying for existing user with email %s\n", email)

	result, err := db.Db.Query(`SELECT id from user WHERE username=? OR email=?`, username, email)

	if err != nil {
		log.Fatal("Error while searching for existing users", err.Error())
	}

	defer result.Close()

	for result.Next() {
		var user types.User
		err = result.Scan(&user.Id)

		if err != nil {
			log.Fatal("Error while querying users", err.Error())
		}
		users = append(users, user)
	}

	if len(users) != 0 {
		fmt.Printf("User with email: %s or username: %s already exists\n", email, username)

		context.JSON(http.StatusConflict, gin.H{"message": "Email/username already exists"})
		return
	}

	result.Close()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		log.Fatal("Error while hashing password", err.Error())
	}

	_, err = db.Db.Exec(`INSERT INTO user(username, email, hashed_password, created_at) values(?,?,?,?)`, username, email, hashedPassword, time.Now())

	if err != nil {
		log.Fatal("Error while registering a user", err.Error())
	}

	context.Status(http.StatusCreated)
}
