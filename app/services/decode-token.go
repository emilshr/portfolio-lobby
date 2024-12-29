package service

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"portfolio/lobby/constants"
	"time"
)

type ConfirmationTokenClaims struct {
	jwt.RegisteredClaims
	UserId string
	Expiry int64
}

type LoginTokenClaims struct {
	jwt.RegisteredClaims
	UserId   int8
	Username string
	Expiry   int64
	IssuedAt int64
}

type PasswordResetClaims struct {
	jwt.RegisteredClaims
	Email    string
	IssuedAt int64
	Expiry   int64
}

type RefreshTokenClaims struct {
	jwt.RegisteredClaims
	userId   int8
	IssuedAt int64
	Expiry   int64
}

func DecodeConfirmationToken(token string) (*ConfirmationTokenClaims, bool) {
	var tokenClaims ConfirmationTokenClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &tokenClaims, func(token *jwt.Token) (interface{}, error) {
		return constants.CONFIRMATION_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Println("Error while parsing token ", err.Error())
		return nil, false
	}

	unixTime := time.Unix(tokenClaims.Expiry, 0)

	if unixTime.Before(time.Now()) {
		fmt.Println("Time are", time.Now().String(), unixTime.String())
		return nil, false
	}

	return &tokenClaims, verifiedToken.Valid
}

func DecodeLoginToken(token string) bool {
	verifiedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return constants.LOGIN_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Println("Error while parsing token ", err.Error())
		return false
	}

	return verifiedToken.Valid
}

func DecodePasswordResetToken(token string) (*PasswordResetClaims, error) {
	var passwordResetTokenClaims PasswordResetClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &passwordResetTokenClaims, func(token *jwt.Token) (interface{}, error) {
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

func DecodeRefreshToken(token string) (*RefreshTokenClaims, error) {
	var refreshTokenClaims RefreshTokenClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &refreshTokenClaims, func(token *jwt.Token) (interface{}, error) {
		return constants.REFRESH_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Printf("Error while decoding password reset token %s\n", err.Error())
		return nil, fmt.Errorf("error while decoding password reset token %s", err.Error())
	}
	if !verifiedToken.Valid {
		return nil, fmt.Errorf("reset password token is invalid")
	}

	return &refreshTokenClaims, nil
}
