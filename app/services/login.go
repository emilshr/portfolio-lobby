package service

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"portfolio/lobby/db"
)

type Response struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	Message      string `json:"message"`
	Status       bool   `json:"status"`
}

func Login(email string, password string) Response {
	fmt.Printf("Login request from email: %s\n", email)

	var hashedPassword string
	var userId int8
	var username string

	err := db.Db.QueryRow(`SELECT hashed_password, id, username from user WHERE email=?`, email).Scan(&hashedPassword, &userId, &username)

	if err != nil {
		log.Fatal("Error while querying for users", err.Error())
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return Response{Message: "Invalid credentials", Status: false, AccessToken: ""}
	}

	token := CreateLoginToken(userId, username)
	refreshToken, err := CreateRefreshToken(userId)

	if err != nil {
		return Response{Message: "Internal server error", AccessToken: "", RefreshToken: "", Status: false}
	}

	return Response{Message: "Ok", Status: true, AccessToken: token, RefreshToken: *refreshToken}
}
