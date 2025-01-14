package db

import (
	"crypto/tls"
	"crypto/x509"
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

	rootCertPool := x509.NewCertPool()
	tlsOpt := "skip-verify"

	if constants.ENV != "local" {
		globalPerm, err := os.ReadFile("./certs/db.pem")
		if err != nil {
			log.Fatal("No public DB certificates found")
			panic(1)
		}
		if ok := rootCertPool.AppendCertsFromPEM(globalPerm); !ok {
			log.Fatal("Unable to append DB public certificate")
			panic(1)
		}
		mysql.RegisterTLSConfig("custom", &tls.Config{
			RootCAs: rootCertPool,
		})
		tlsOpt = "custom"
	}

	config := mysql.Config{
		User:      constants.MYSQL_USER,
		DBName:    constants.MYSQL_DATABASE,
		Passwd:    constants.MYSQL_PASSWORD,
		Net:       "tcp",
		Addr:      address,
		TLSConfig: tlsOpt,
		ParseTime: true,
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
