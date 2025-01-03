package service

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"portfolio/lobby/constants"
	"time"
)

type ConfirmationTokenClaims struct {
	UserId string `json:"userId"`
	jwt.RegisteredClaims
}

type LoginTokenClaims struct {
	UserId   int8   `json:"userId"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type PasswordResetClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type RefreshTokenClaims struct {
	UserId int8 `json:"userId"`
	jwt.RegisteredClaims
}

func DecodeConfirmationToken(token string) (*ConfirmationTokenClaims, bool) {
	var tokenClaims ConfirmationTokenClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &tokenClaims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method for confirmation token: %v", token.Header["alg"])
		}
		return constants.CONFIRMATION_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Println("Error while parsing token ", err.Error())
		return nil, false
	}

	exp, _ := tokenClaims.GetExpirationTime()

	println("verified token ", exp.Time.String())

	if tokenClaims.ExpiresAt.Time.Before(time.Now()) {
		return nil, false
	}

	return &tokenClaims, verifiedToken.Valid
}

func DecodeLoginToken(token string) (*LoginTokenClaims, bool, error) {
	var loginTokenClaims LoginTokenClaims
	verifiedToken, err := jwt.ParseWithClaims(token, &loginTokenClaims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method for access token: %v", token.Header["alg"])
		}
		return constants.LOGIN_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Println("Error while parsing access token", err.Error())
		return nil, false, errors.New("error while parsing access token")
	}

	return &loginTokenClaims, verifiedToken.Valid, nil
}

func DecodePasswordResetToken(token string) (*PasswordResetClaims, error) {
	var passwordResetTokenClaims PasswordResetClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &passwordResetTokenClaims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method for password reset token: %v", token.Header["alg"])
		}
		return constants.PASSWORD_RESET_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Printf("Error while decoding password reset token %s\n", err.Error())
		return nil, fmt.Errorf("error while decoding password reset token %s", err.Error())
	}
	if !verifiedToken.Valid {
		return nil, fmt.Errorf("reset password token is invalid")
	}

	return &passwordResetTokenClaims, nil
}

func DecodeRefreshToken(token string) (*RefreshTokenClaims, bool, error) {
	var refreshTokenClaims RefreshTokenClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &refreshTokenClaims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method for refresh token: %v", token.Header["alg"])
		}
		return constants.REFRESH_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Printf("Error while decoding Refresh token %s\n", err.Error())
		return nil, false, fmt.Errorf("error while decoding refresh token %s", err.Error())
	}

	return &refreshTokenClaims, verifiedToken.Valid, nil
}
