package types

type User struct {
	Id                int8   `json:"id"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	HashedPassword    string `json:"hashed_password"`
	ConfirmationToken string `json:"confirmation_token"`
	CreatedAt         string `json:"created_at"`
}

type PasswordReset struct {
	Id        int8   `json:"id"`
	UserId    int8   `json:"user_id"`
	Token     string `json:"token"`
	CreatedAt string `json:"created_at"`
}
