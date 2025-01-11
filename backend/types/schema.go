package types

type User struct {
	Id             int8   `json:"id"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	HashedPassword string `json:"hashed_password"`
	IsVerified     bool   `json:"is_verified"`
	CreatedAt      string `json:"created_at"`
}

type PasswordReset struct {
	Id         int8   `json:"id"`
	UserId     int8   `json:"user_id"`
	Token      string `json:"token"`
	IsVerified bool   `json:"is_verified"`
	CreatedAt  string `json:"created_at"`
}

type Token struct {
	Id     int8   `json:"id"`
	Token  string `json:"token"`
	Expiry string `json:"expiry"`
}

type ConfirmationToken struct {
	Id         int8   `json:"id"`
	Token      string `json:"token"`
	Expiry     string `json:"expiry"`
	UserId     int8   `json:"userId"`
	IssuedOn   string `json:"issued_on"`
	VerifiedOn string `json:"verified_on"`
}

type RefreshToken struct {
	Id        int8   `json:"id"`
	Token     string `json:"token"`
	UserId    int8   `json:"user_id"`
	CreatedAt string `json:"created_at"`
}

type Chat struct {
	Id        int8   `json:"id"`
	Message   string `json:"message"`
	UserId    int8   `json:"user_id"`
	CreatedAt string `json:"created_at"`
}

type Comment struct {
	Id        int8   `json:"id"`
	Comment   string `json:"comment"`
	PostSlug  string `json:"post_slug"`
	UserId    int8   `json:"user_id"`
	CreatedAt string `json:"created_at"`
}
