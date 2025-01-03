package service

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	"time"
)

func CreateConfirmationToken(userId int64) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, ConfirmationTokenClaims{
		UserId: fmt.Sprint(userId),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})

	signedToken, err := token.SignedString(constants.CONFIRMATION_JWT_SECRET)

	if err != nil {
		log.Fatal("Error while signing token ", err.Error())
	}

	return signedToken
}

func CreateLoginToken(userId int8, username string) (*string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, LoginTokenClaims{
		UserId:   userId,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 30)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})

	signedToken, err := token.SignedString(constants.LOGIN_JWT_SECRET)

	if err != nil {
		return nil, err
	}

	return &signedToken, nil
}

func CreatePasswordResetToken(email string) (*string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, PasswordResetClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 10)),
		},
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
		UserId: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
		},
	})

	signedToken, err := token.SignedString(constants.REFRESH_JWT_SECRET)

	if err != nil {
		return nil, err
	}

	_, err = db.Db.Exec(`INSERT INTO refresh_token(user_id, token) VALUES(?,?)`, userId, signedToken)

	if err != nil {
		fmt.Printf("error while inserting new record to password reset %s", err.Error())
		return nil, err
	}

	return &signedToken, nil
}
