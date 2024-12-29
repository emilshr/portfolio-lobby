package service

import (
	"database/sql"
	"fmt"
	"portfolio/lobby/db"
	"portfolio/lobby/types"
)

func GetUserByEmail(email string) (*types.User, error) {
	fmt.Printf("Getting user by email %s\n", email)

	var fetchedUser types.User

	err := db.Db.QueryRow(`SELECT id, username, email, is_verified, created_at from user where email=?`, email).Scan(&fetchedUser.Id, &fetchedUser.Username, &fetchedUser.Email, &fetchedUser.IsVerified, &fetchedUser.CreatedAt)

	if err != nil {
		fmt.Printf("Error while getting user %s\n", err.Error())
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no user with email %s found", email)
		}
		return nil, err
	}
	return &fetchedUser, nil
}
