package model

import (
	"time"
)

type User struct {
	UserID   uint64
	Username string
	Password string

	IsDeleted bool

	CreatedAt time.Time
}

type UserResponse struct {
	UserID   uint64 `json:"user_id"`
	Username string `json:"username"`

	Posts []MainPostResponse `json:"posts"`

	CreatedAt time.Time `json:"created_at"`
}

type UserRegisterLoginPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserInterface interface {
	InsertUser(user *User) error
	AllUsers() ([]UserResponse, error)
	GetUserByID(userID uint64) (*UserResponse, error)
	GetUserByName(username string) (*User, error)
	UpdateUser(user *User) error
	DeleteUser(userID uint64) error
}
