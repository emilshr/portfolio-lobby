package service

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"portfolio/lobby/constants"
)

func VerifyConfirmationToken(token string) (jwt.Claims, bool) {
	verifiedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return constants.CONFIRMATION_JWT_SECRET, nil
	})

	fmt.Println("verified token ", verifiedToken.Claims)

	if err != nil {
		fmt.Println("Error while parsing token ", err.Error())
		return nil, false
	}

	return verifiedToken.Claims, verifiedToken.Valid
}
