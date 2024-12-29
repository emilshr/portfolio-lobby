package service

import (
	"fmt"
	"log"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateConfirmationToken(userId int64) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, ConfirmationTokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{},
		UserId:           fmt.Sprint(userId),
		Expiry:           time.Now().Add(time.Minute * 15).Unix(),
	})

	signedToken, err := token.SignedString(constants.CONFIRMATION_JWT_SECRET)

	if err != nil {
		log.Fatal("Error while signing token ", err.Error())
	}

	return signedToken
}

func CreateLoginToken(userId int8, username string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, LoginTokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{},
		UserId:           userId,
		Username:         username,
		IssuedAt:         time.Now().Unix(),
		Expiry:           time.Now().Add(time.Hour * 24).Unix(),
	})

	signedToken, err := token.SignedString(constants.CONFIRMATION_JWT_SECRET)

	if err != nil {
		log.Fatal("Error while signing login token ", err.Error())
	}

	return signedToken
}

func CreatePasswordResetToken(email string) (*string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, PasswordResetClaims{
		RegisteredClaims: jwt.RegisteredClaims{},
		Email:            email,
		IssuedAt:         time.Now().Unix(),
		Expiry:           time.Now().Add(time.Minute * 10).Unix(),
	})

	signedToken, err := token.SignedString(constants.PASSWORD_RESET_JWT_SECRET)

	if err != nil {
		log.Fatal("Error while signing token ", err.Error())
	}

	fetchedUser, err := GetUserByEmail(email)

	if err != nil {
		return nil, fmt.Errorf("error while getting user %s", err.Error())
	}

	_, err = db.Db.Exec(`INSERT INTO password_reset(user_id, token) VALUES(?,?)`, fetchedUser.Id, signedToken)

	if err != nil {
		return nil, fmt.Errorf("error while inserting new record to password reset %s", err.Error())
	}

	return &signedToken, nil
}

func CreateRefreshToken(userId int8) (*string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, RefreshTokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{},
		userId:           userId,
		IssuedAt:         time.Now().Unix(),
		Expiry:           time.Now().Add(time.Minute * 10).Unix(),
	})

	signedToken, err := token.SignedString(constants.REFRESH_JWT_SECRET)

	if err != nil {
		return nil, fmt.Errorf("error while signing token %s", err.Error())
	}

	_, err = db.Db.Exec(`INSERT INTO refresh_token(user_id, token) VALUES(?,?)`, userId, signedToken)

	if err != nil {
		return nil, fmt.Errorf("error while inserting new record to password reset %s", err.Error())
	}

	return &signedToken, nil
}
