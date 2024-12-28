package constants

import (
	"os"
)

var ENV = os.Getenv("ENV")
var TEST = os.Getenv("TEST")
var MYSQL_USER = os.Getenv("MYSQL_USER")
var MYSQL_DATABASE = os.Getenv("MYSQL_DATABASE")
var MYSQL_PASSWORD = os.Getenv("MYSQL_PASSWORD")
var MYSQL_HOST = os.Getenv("MYSQL_HOST")
var MYSQL_PORT = os.Getenv("MYSQL_PORT")

// Email keys
var RESEND_API_KEY = os.Getenv("RESEND_API_KEY")

var CONFIRMATION_JWT_SECRET = []byte(os.Getenv("CONFIRMATION_JWT_SECRET"))
var PASSWORD_RESET_JWT_SECRET = []byte(os.Getenv("PASSWORD_RESET_JWT_SECRET"))
var LOGIN_JWT_SECRET = os.Getenv("LOGIN_JWT_SECRET")

var FROM_EMAIL = os.Getenv("FROM_EMAIL")

// Domain stuff
var FRONTEND_HOST = os.Getenv("FRONTEND_HOST")

var SCHEME = os.Getenv("SCHEME")
