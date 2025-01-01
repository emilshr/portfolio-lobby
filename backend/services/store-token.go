package service

import (
	"fmt"
	"portfolio/lobby/db"
)

func StoreRefreshToken(refreshToken string) (bool, error) {
	decodedToken, _, err := DecodeRefreshToken(refreshToken)

	if err != nil {
		fmt.Println("Error while decoding refresh token", err.Error())
		return false, nil
	}

	_, err = db.Db.Exec(`INSERT INTO refresh_token(token, user_id) VALUES(?,?)`, refreshToken, decodedToken.UserId)

	if err != nil {
		fmt.Println("Failed to insert refresh token", err.Error())
		return false, err
	}

	return true, nil
}
