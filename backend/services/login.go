package service

import (
	"errors"
	"fmt"
	"portfolio/lobby/db"

	"golang.org/x/crypto/bcrypt"
)

type Response struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func Login(email string, password string) (*Response, error) {
	fmt.Printf("Login request from email: %s\n", email)

	var hashedPassword string
	var userId int8
	var username string
	var isVerified bool

	err := db.Db.QueryRow(`SELECT hashed_password, id, username, is_verified from user WHERE email=?`, email).Scan(&hashedPassword, &userId, &username, &isVerified)

	if !isVerified {
		return nil, errors.New("account is not verified")
	}

	if err != nil {
		fmt.Println("Error while querying for users ", err.Error())
		return nil, errors.New("user does not exist")
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return nil, errors.New("invalid password")
	}

	token := CreateLoginToken(userId, username)
	refreshToken, err := CreateRefreshToken(userId)

	if err != nil {
		return nil, errors.New("unknown error")
	}

	return &Response{AccessToken: token, RefreshToken: *refreshToken}, nil
}