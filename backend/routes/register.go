package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	service "portfolio/lobby/services"
	"portfolio/lobby/types"
	"time"
)

func Register(context *gin.Context) {
	var registerInput struct {
		Email    string `json:"email" binding:"required" form:"email"`
		Username string `json:"username" binding:"required" form:"username"`
		Password string `json:"password" binding:"required" form:"password"`
	}

	if err := context.Bind(&registerInput); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	users := []types.User{}

	fmt.Printf("Querying for existing user with email %s\n", registerInput.Email)

	result, err := db.Db.Query(`SELECT id from user WHERE username=? OR email=?`, registerInput.Username, registerInput.Email)

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
		fmt.Printf("User with email: %s or username: %s already exists\n", registerInput.Email, registerInput.Username)

		context.JSON(http.StatusConflict, gin.H{"message": "Email/username already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerInput.Password), bcrypt.DefaultCost)

	if err != nil {
		log.Fatal("Error while hashing password", err.Error())
	}

	createdUserResult, err := db.Db.Exec(`INSERT INTO user(username, email, hashed_password, created_at) values(?,?,?,?)`, registerInput.Username, registerInput.Email, hashedPassword, time.Now())

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

	confirmationUrl := constants.BACKEND_HOST + "/" + "confirm/" + generatedConfirmationToken

	emailPayload := service.SendEmailPayload{
		To:      []string{registerInput.Email},
		Subject: "Account confirmation link",
		Html:    "<span><h2>Click on the below link to confirm your account</h2><br /><a href=\"" + confirmationUrl + "\">Confirmation link</a><br/><p>Alternatively, you can copy paste the following link in your browser to verify your account " + confirmationUrl + "</p></span>",
		Text:    "To verify your account. Click on the following link or copy paste it in your browser",
	}

	service.SendEmail(emailPayload)

	context.Status(http.StatusCreated)
}
