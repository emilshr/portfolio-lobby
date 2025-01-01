package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"portfolio/lobby/constants"
	"portfolio/lobby/db"
	service "portfolio/lobby/services"
	"portfolio/lobby/types"
	"time"
)

func Refresh(context *gin.Context) {
	refreshToken, err := context.Cookie(constants.REFRESH_TOKEN_COOKIE)

	if err != nil {
		context.Status(http.StatusUnauthorized)
		return
	}

	tokenClaims, _, err := service.DecodeRefreshToken(refreshToken)

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "invalid_refresh_token"})
		return
	}

	if time.Unix(tokenClaims.Expiry, 0).Before(time.Now()) {
		db.Db.Exec(`DELETE FROM refresh_token where token=?`, refreshToken)
		context.JSON(http.StatusUnauthorized, gin.H{"code": "refresh_token_expired"})
		return
	}

	var fetchedToken types.RefreshToken

	err = db.Db.QueryRow(`SELECT id FROM refresh_token WHERE token=?`, refreshToken).Scan(&fetchedToken.Id)

	if err != nil && err == sql.ErrNoRows {
		context.JSON(http.StatusUnauthorized, gin.H{"code": "refresh_token_expired"})
		return
	}

	fetchedUser, err := service.GetUserById(tokenClaims.UserId)

	if err != nil {
		context.Status(http.StatusUnauthorized)
		return
	}

	createdAccessToken, err := service.CreateLoginToken(fetchedUser.Id, fetchedUser.Username)

	if err != nil {
		context.Status(http.StatusUnauthorized)
		return
	}

	context.JSON(http.StatusOK, gin.H{"token": createdAccessToken, "username": fetchedUser.Username})
}
