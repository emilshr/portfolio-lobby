package service

import (
	"fmt"
	"portfolio/lobby/db"
)

func SendMessage(message string, userId int8) (bool, error) {
	_, err := db.Db.Exec(`INSERT INTO chat (message, user_id) VALUES(?,?)`, message, userId)

	if err != nil {
		fmt.Println("Error while inserting message ", err.Error())
		return false, err
	}

	return true, nil
}

type MessagesResponse struct {
	Id       int8   `json:"id"`
	Message  string `json:"message"`
	Username string `json:"username"`
	SentAt   string `json:"sentAt"`
}

func ListMessages() (*[]MessagesResponse, error) {
	var response []MessagesResponse

	results, err := db.Db.Query(`select chat.id, chat.message, chat.created_at, user.username from chat LEFT JOIN user on chat.user_id=user.id`)

	if err != nil {
		fmt.Println("Error while querying for messages ", err.Error())
		return nil, err
	}

	defer results.Close()

	var chat MessagesResponse

	for results.Next() {
		results.Scan(&chat.Id, &chat.Message, &chat.SentAt, &chat.Username)
		response = append(response, chat)
	}

	if response == nil {
		response = []MessagesResponse{}
	}

	return &response, nil
}
