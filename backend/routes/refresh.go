package routes

import (
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	service "portfolio/lobby/services"
	"portfolio/lobby/types"
	"time"
)

func Refresh(context *gin.Context) (*string, error) {
	refreshToken, err := context.Cookie(constants.REFRESH_TOKEN_COOKIE)

	if err != nil {
		return nil, errors.New("No cookie found")
	}

	tokenClaims, err := service.DecodeRefreshToken(refreshToken)

	if err != nil {
		return nil, errors.New("error while decoding refresh token")
	}

	if time.Now().After(time.Unix(tokenClaims.Expiry, 0)) {
		return nil, errors.New("refresh token has expired, logging out user")
	}

	var fetchedToken types.RefreshToken

	err = db.Db.QueryRow(`SELECT id FROM refresh_token WHERE token=?`, refreshToken).Scan(&fetchedToken.Id)

	if err != nil && err == sql.ErrNoRows {
		return nil, errors.New("invalid token, does not match")
	}

	fetchedUser, err := service.GetUserById(tokenClaims.UserId)

	if err != nil {
		return nil, errors.New("no user found")
	}

	createdAccessToken := service.CreateLoginToken(fetchedUser.Id, fetchedUser.Username)

	return &createdAccessToken, nil
}
