package service

import (
	"errors"
	"fmt"
	"portfolio/lobby/db"
)

type CommentsResponse struct {
	Id        int8   `json:"id"`
	Comment   string `json:"comment"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

func FetchComments(postSlug string) (*[]CommentsResponse, error) {
	var comments []CommentsResponse = make([]CommentsResponse, 0)

	results, err := db.Db.Query(`SELECT comment.id, comment.comment, comment.created_at, user.username from comment LEFT JOIN user on comment.user_id=user.id WHERE comment.post_slug=? ORDER BY comment.created_at DESC`, postSlug)

	if err != nil {
		fmt.Println("Error while querying for comments", err.Error())
		return nil, err
	}

	defer results.Close()

	var comment CommentsResponse

	for results.Next() {
		results.Scan(&comment.Id, &comment.Comment, &comment.CreatedAt, &comment.Username)
		comments = append(comments, comment)
	}

	return &comments, nil
}

type AddCommentResponse struct {
	Id       int8   `json:"id"`
	Comment  string `json:"comment"`
	PostSlug string `json:"post_slug"`
}

func AddComment(comment string, postSlug string, userId int8) (*AddCommentResponse, error) {
	result, err := db.Db.Exec(`INSERT INTO comment (comment, post_slug, user_id) VALUES(?,?,?)`, comment, postSlug, userId)

	if err != nil {
		fmt.Println("Error while inserting comments ", err.Error())
		return nil, err
	}

	insertedRecordId, err := result.LastInsertId()

	if err != nil {
		fmt.Println("Error while getting last inserted id ", err.Error())
		return nil, err
	}

	commentsResponse := AddCommentResponse{Id: int8(insertedRecordId), Comment: comment, PostSlug: postSlug}

	return &commentsResponse, nil
}

func DeleteComment(commentId int8, userId int8) (bool, error) {
	result, err := db.Db.Exec(`DELETE FROM comment where id=? AND user_id=?`, commentId, userId)

	if err != nil {
		fmt.Println("Error while deleting comments ", err.Error())
		return false, err
	}

	affectedRowCount, err := result.RowsAffected()

	if err != nil {
		fmt.Println("Error while getting deleted row count ", err.Error())
		return false, err
	}

	if affectedRowCount == 0 {
		return false, errors.New("you have to be the author to delete the comment")
	}

	return true, nil
}
