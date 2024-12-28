package types

type User struct {
	Id             int8   `json:"id"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	HashedPassword string `json:"hashed_password"`
	IsVerified     string `json:"is_verified"`
	CreatedAt      string `json:"created_at"`
}

type PasswordReset struct {
	Id        int8   `json:"id"`
	UserId    int8   `json:"user_id"`
	Token     string `json:"token"`
	CreatedAt string `json:"created_at"`
}

type Token struct {
	Id     string `json:"id"`
	Token  string `json:"token"`
	Expiry string `json:"expiry"`
}

type ConfirmationToken struct {
	Id         string `json:"id"`
	Token      string `json:"token"`
	Expiry     string `json:"expiry"`
	UserId     string `json:"userId"`
	IssuedOn   string `json:"issuedOn"`
	VerifiedOn string `json:"verifiedOn"`
}
