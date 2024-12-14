package types

type User struct {
	id                 int8
	username           string
	email              string
	hashed_password    string `json:"hashedPassword"`
	confirmation_token string `json:"confirmationToken"`
	created_at         string `json:"createdAt"`
}

type PasswordReset struct {
	id         int8
	user_id    int8 `json:"userId"`
	token      string
	created_at string `json:"createdAt"`
}
