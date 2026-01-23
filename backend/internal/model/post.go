package model

import (
	"time"
)

type Post struct {
	PostID    uint64
	TopicID   uint64
	CreatorID uint64

	ParentPostID uint64

	Title   string
	Content string

	IsDeleted bool

	CreatedAt time.Time
	UpdatedAt time.Time
}

type PostInterface interface {
	Home() ([]MainPostResponse, error)
	InsertPost(post *Post) error
	InsertComment(comment *Post) error
	TopicPosts(topicID uint64) ([]MainPostResponse, error)
	GetPost(topicID uint64, postID uint64) (*PostResponse, error)
	UpdatePost(post *Post, isComment bool) error
	DeletePost(postID uint64) error
}

type PostRequest struct {
	UserID  uint64 `json:"user_id"`
	Title   string `json:"title,omitempty"`
	Content string `json:"content"`
}

type CommentRequest struct {
	UserID  uint64 `json:"user_id"`
	Comment string `json:"comment"`
}

type CommentResponse struct {
	CommentID uint64 `json:"comment_id"`
	TopicID   uint64 `json:"topic_id"`
	CreatorID uint64 `json:"creator_id"`
	Content   string `json:"content"`
	Username  string `json:"username"`
}

type MainPostResponse struct {
	PostID    uint64 `json:"post_id"`
	TopicID   uint64 `json:"topic_id"`
	CreatorID uint64 `json:"creator_id"`
	Title     string `json:"title"`
	TopicName string `json:"topic_name"`
	Username  string `json:"username"`
}

type PostResponse struct {
	Title     string            `json:"title"`
	Content   string            `json:"content"`
	TopicName string            `json:"topic_name"`
	UserID    uint64            `json:"user_id"`
	Username  string            `json:"username"`
	IsDeleted bool              `json:"is_deleted"`
	Comments  []CommentResponse `json:"comments"`
}
