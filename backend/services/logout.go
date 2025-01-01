package service

import (
	"errors"
	"fmt"
	"portfolio/lobby/db"
)

func Logout(refreshToken string) (bool, error) {
	results, err := db.Db.Exec(`DELETE FROM refresh_token WHERE token=?`, refreshToken)

	if err != nil {
		fmt.Printf("Error while trying to delete refresh token %s\n", err.Error())
		return false, err
	}

	deletedRowCount, err := results.RowsAffected()

	if err != nil {
		fmt.Printf("Error while getting the deleted row count %s\n", err.Error())
		return false, err
	}

	if deletedRowCount == 0 {
		fmt.Printf("Error while getting the deleted row count %s\n", err.Error())
		return false, errors.New("no refresh tokens found")
	}

	return true, nil
}
