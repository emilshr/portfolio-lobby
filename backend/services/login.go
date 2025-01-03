package service

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"portfolio/lobby/db"
)

type Response struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	Username     string `json:"username"`
}

func Login(email string, password string) (*Response, error) {
	fmt.Printf("Login request from email: %s\n", email)

	var hashedPassword string
	var userId int8
	var username string
	var isVerified bool

	err := db.Db.QueryRow(`SELECT hashed_password, id, username, is_verified from user WHERE email=?`, email).Scan(&hashedPassword, &userId, &username, &isVerified)

	if err != nil {
		fmt.Println("Error while querying for users ", err.Error())
		return nil, errors.New("user does not exist")
	}

	if !isVerified {
		return nil, errors.New("account is not verified")
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return nil, errors.New("invalid password")
	}

	token, err := CreateLoginToken(userId, username)

	if err != nil {
		return nil, err
	}

	refreshToken, err := CreateRefreshToken(userId)

	if err != nil {
		fmt.Println("Error while creating refresh token ", err.Error())
		return nil, err
	}

	response := Response{AccessToken: *token, RefreshToken: *refreshToken, Username: username}

	return &response, nil
}
