package service

import (
	"database/sql"
	"fmt"
	"portfolio/lobby/db"
)

func CheckUserStatus(userId string) (bool, error) {
	var isVerified bool
	err := db.Db.QueryRow(`SELECT is_verified FROM user WHERE id=?`, userId).Scan(&isVerified)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, fmt.Errorf("user with ID %s not found", userId)
		}
		return false, fmt.Errorf("error while fetching is_verified status of user %s %s", userId, err.Error())
	}
	return isVerified, nil
}
