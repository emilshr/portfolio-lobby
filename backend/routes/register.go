package routes

import (
	"fmt"
	"log"
	"net/http"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	service "portfolio/lobby/services"
	"portfolio/lobby/types"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		log.Fatal("Error while hashing password", err.Error())
	}

	createdUserResult, err := db.Db.Exec(`INSERT INTO user(username, email, hashed_password, created_at) values(?,?,?,?)`, username, email, hashedPassword, time.Now())

	if err != nil {
		log.Fatal("Error while registering a user", err.Error())
	}

	createdUserId, err := createdUserResult.LastInsertId()

	if err != nil {
		fmt.Println("Error while fetching the ID of the last inserted user")

	}

	generatedConfirmationToken := service.CreateConfirmationToken(createdUserId)

	_, err = db.Db.Exec(`INSERT INTO confirmation_token(token, user_id) values(?,?)`, generatedConfirmationToken, createdUserId)

	if err != nil {
		log.Fatal("Error while inserting confirmation token for user ", createdUserId)
	}

	confirmationUrl := constants.BACKEND_HOST + "/" + generatedConfirmationToken

	emailPayload := service.SendEmailPayload{
		To:      []string{"delivered@resend.dev"},
		Subject: "This is a test email",
		Html:    "<h1>Sample content</h1><br /><a href=\"" + confirmationUrl + "\">Confirmation link</a>",
		Text:    "To verify your account. Click on the following link or copy paste it in your browser",
	}

	service.SendEmail(emailPayload)

	context.Status(http.StatusCreated)
}
