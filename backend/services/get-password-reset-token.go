package service

import (
	"database/sql"
	"errors"
	"fmt"
	"portfolio/lobby/db"
	"portfolio/lobby/types"
	"time"
)

func IsPasswordResetTokenValid(token string) (*types.PasswordReset, *PasswordResetClaims, error) {
	var passResetToken types.PasswordReset
	query := db.Db.QueryRow(`SELECT * from password_reset WHERE token=?`, token)
	err := query.Err()
	query.Scan(&passResetToken)

	if err != nil {
		fmt.Println("Error while querying for password reset tokens ", err.Error())
		if err == sql.ErrNoRows {
			return nil, nil, errors.New("Invalid password reset URL")
		}
		return nil, nil, errors.New("Unknown error occurred")
	}

	if passResetToken.IsVerified {
		return nil, nil, errors.New("This URL has already been used")
	}

	decodedToken, err := DecodePasswordResetToken(token)

	if decodedToken.ExpiresAt.Time.Before(time.Now()) {
		return nil, nil, errors.New("Password reset URL has expired")
	}

	return &passResetToken, decodedToken, nil
}
