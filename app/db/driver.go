package db

import (
	"database/sql"
	"fmt"
	"github.com/go-sql-driver/mysql"
	"log"
	"os"
	"portfolio/lobby/constants"
	"strings"
)

var Db *sql.DB

func GetDatabaseConfig() string {
	address := strings.Join([]string{constants.MYSQL_HOST, constants.MYSQL_PORT}, ":")

	config := mysql.Config{
		User:   constants.MYSQL_USER,
		DBName: constants.MYSQL_DATABASE,
		Passwd: constants.MYSQL_PASSWORD,
		Net:    "tcp",
		Addr:   address,
	}

	return config.FormatDSN()
}

func InitializeAndTestDatabaseConnection() {
	db, err := sql.Open("mysql", GetDatabaseConfig())

	Db = db

	if err != nil {
		log.Fatal("Error while connecting to mysql database ", err.Error())
	}

	fmt.Println("Connected to the database")

	fmt.Println("Performing a PING operation")

	err = db.Ping()

	if err != nil {
		log.Fatal("PING operation to the database has failed", err.Error())
	}

	fmt.Println("Connection validated successfully")
}

func CreateSchemas() {
	var schemaCreationScript string

	query, err := os.ReadFile("./sql/init.sql")

	if err != nil {
		log.Fatal("Failed to read file", err.Error())
	}

	schemaCreationScript = string(query)

	trx, err := Db.Begin()

	if err != nil {
		log.Fatal("Failed to create schemas", err.Error())
	}

	commands := strings.Split(schemaCreationScript, ";")

	for _, command := range commands {
		parsedCommand := strings.TrimSpace(command)

		if parsedCommand != "" {
			_, err := trx.Exec(parsedCommand)

			if err != nil {
				log.Fatal("Error while executing script", err.Error())
			}
		}
	}

	trx.Commit()

	fmt.Println("Completed creating schemas")
}
