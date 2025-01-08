package service

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"portfolio/lobby/db"
)

func UpdatePassword(newPassword string, email string, tokenId int8) (bool, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)

	if err != nil {
		fmt.Println("Error while hashing the new password", err.Error())
		return false, fmt.Errorf("error while hashing the new password")
	}

	trx, err := db.Db.Begin()

	if err != nil {
		fmt.Println("Error while beginning a new transaction ", err.Error())
		return false, err
	}

	_, err = trx.Exec(`UPDATE user SET hashed_password=? WHERE email=?`, hashedPassword, email)

	if err != nil {
		fmt.Println("Error while updating user password ", err.Error())
		trx.Rollback()
		return false, err
	}

	_, err = trx.Exec(`UPDATE password_reset SET is_verified=true WHERE id=?`, tokenId)

	if err != nil {
		fmt.Println("Error while updating password reset verified flag ", err.Error())
		trx.Rollback()
		return false, err
	}

	trx.Commit()

	return true, nil
}
