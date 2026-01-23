package model

import (
	"time"
)

type Topic struct {
	TopicID uint64
	UserID  uint64

	Name        string
	Description string

	CreatedAt time.Time
	UpdatedAt time.Time
}

type TopicInterface interface {
	InsertTopic(topic *Topic) error
	Topics() ([]TopicResponse, error)
	GetTopicByID(topicID uint64) (*TopicResponse, error)
	UpdateTopic(topic *Topic) error
}

type TopicRequest struct {
	UserID      uint64 `json:"user_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TopicResponse struct {
	TopicID     uint64    `json:"topic_id"`
	UserID      uint64    `json:"user_id"`
	TopicName   string    `json:"topic_name"`
	Description string    `json:"description"`
	Username    string    `json:"username"`
	CreatedAt   time.Time `json:"created_at"`
}
