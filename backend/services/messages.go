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

type PaginatedResponse struct {
	Page           int                `json:"page"`
	HasMoreRecords bool               `json:"has_more_records"`
	Data           []MessagesResponse `json:"data"`
}

type MessagesResponse struct {
	Id       int8   `json:"id"`
	Message  string `json:"message"`
	Username string `json:"username"`
	SentAt   string `json:"sent_at"`
}

func ListMessages(page int) (*PaginatedResponse, error) {
	var response PaginatedResponse

	results, err := db.Db.Query(`select chat.id, chat.message, chat.created_at, user.username from chat LEFT JOIN user on chat.user_id=user.id ORDER BY chat.created_at DESC LIMIT ?,?;`, (page * 20), 21)

	if err != nil {
		fmt.Println("Error while querying for messages ", err.Error())
		return nil, err
	}

	defer results.Close()

	var chat MessagesResponse

	var messages []MessagesResponse

	var count int = 0
	var hasMoreRecords bool = false

	for results.Next() {
		if count >= 20 {
			hasMoreRecords = true
			break
		}
		results.Scan(&chat.Id, &chat.Message, &chat.SentAt, &chat.Username)
		messages = append(messages, chat)
		count++
	}

	if messages == nil {
		messages = []MessagesResponse{}
	}

	response = PaginatedResponse{
		Page:           page,
		HasMoreRecords: hasMoreRecords,
		Data:           messages,
	}

	return &response, nil
}
