package service

import (
	"errors"
	"fmt"
	"portfolio/lobby/constants"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
	UserId   int8
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

func DecodeLoginToken(token string) (*LoginTokenClaims, bool, error) {
	var loginTokenClaims LoginTokenClaims
	verifiedToken, err := jwt.ParseWithClaims(token, &loginTokenClaims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return constants.LOGIN_JWT_SECRET, nil
	})

	if err != nil {
		println("error here")
		fmt.Println("Error while parsing token ", err.Error())
		return nil, false, errors.New("error while parsing token")
	}

	return &loginTokenClaims, verifiedToken.Valid, nil
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

func DecodeRefreshToken(token string) (*RefreshTokenClaims, bool, error) {
	var refreshTokenClaims RefreshTokenClaims

	verifiedToken, err := jwt.ParseWithClaims(token, &refreshTokenClaims, func(token *jwt.Token) (interface{}, error) {
		return constants.REFRESH_JWT_SECRET, nil
	})

	if err != nil {
		fmt.Printf("Error while decoding password reset token %s\n", err.Error())
		return nil, false, fmt.Errorf("error while decoding password reset token %s", err.Error())
	}

	return &refreshTokenClaims, verifiedToken.Valid, nil
}
