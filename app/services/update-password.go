package service

import (
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"portfolio/lobby/db"
)

func UpdatePassword(newPassword string, email string) (bool, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)

	if err != nil {
		fmt.Println("Error while hashing the new password", err.Error())
		return false, fmt.Errorf("error while hashing the new password")
	}

	_, err = db.Db.Exec(`UPDATE user SET hashed_password=? WHERE email=?`, hashedPassword, email)

	if err != nil {
		fmt.Println("Error while updating user password ", err.Error())
		return false, errors.New("error while updating user password")
	}

	return true, nil
}
