package service

import (
	"fmt"
	"log"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	"time"
)

func ConfirmUser(userId string) bool {
	fmt.Println("Attempting to confirm user account with id ", userId)

	trx, err := db.Db.Begin()

	if err != nil {
		log.Fatal("Error while starting a transaction ", err.Error())
	}

	results, err := trx.Exec(`UPDATE confirmation_token SET verified_on=? WHERE user_id=?`, time.Now().Format(constants.TIME_FORMAT), userId)

	if err != nil {
		log.Fatal("Error while attempting to update confirmation token of user ", userId, err.Error())
		trx.Rollback()
	}

	affectedRows, err := results.RowsAffected()

	if err != nil {
		log.Fatal("Error while getting the number of updated rows ", err.Error())
		trx.Rollback()
	}

	println("Affected delete count ", affectedRows)

	if affectedRows == 0 {
		log.Fatal("No confirmation token found for user ", userId)
		trx.Rollback()
	}

	results, err = trx.Exec(`UPDATE user SET is_verified=? WHERE id=?`, true, userId)

	if err != nil {
		log.Fatal("Error while updating user account confirmation status ", err.Error())
		trx.Rollback()
	}

	affectedRows, err = results.RowsAffected()

	if err != nil {
		log.Fatal("Error while getting the number of updated records ", err.Error())
		trx.Rollback()
	}

	if affectedRows != 0 {
		err = trx.Commit()
		if err != nil {
			log.Fatal("Error while committing transaction ", err.Error())
			return false
		}
		return true
	}
	return false
}
