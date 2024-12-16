package service

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"portfolio/lobby/db"
)

type Response struct {
	Message string
	Status  bool
}

func Login(email string, password string) Response {
	fmt.Printf("Login request from email: %s\n", email)

	results, err := db.Db.Query(`SELECT hashed_password from user WHERE email=?`, email)

	if err != nil {
		log.Fatal("Error while querying for users", err.Error())
	}

	var hashedPassword string

	for results.Next() {
		err = results.Scan(&hashedPassword)
		if err != nil {
			log.Fatal("Error while querying for users", err.Error())
		}
	}
	results.Close()

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return Response{Message: "Invalid credentials", Status: false}
	}

	return Response{Message: "Ok", Status: true}
}
