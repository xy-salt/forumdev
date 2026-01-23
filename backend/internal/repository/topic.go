package repository

import (
	"database/sql"

	"github.com/xy-salt/forumdev/backend/internal/model"
)

type TopicRepo struct {
	db *sql.DB
}

func NewTopicRepo(db *sql.DB) *TopicRepo {
	return &TopicRepo{db: db}
}

func (repo *TopicRepo) InsertTopic(topic *model.Topic) error {
	_, err := repo.db.Exec(`
		INSERT INTO Topics (creator_id, topic_name, description)
		VALUES (?, ?, ?)`,
		topic.UserID,
		topic.Name,
		topic.Description,
	)
	if err != nil {
		return err
	}

	return nil
}

func (repo *TopicRepo) Topics() ([]model.TopicResponse, error) {
	rows, err := repo.db.Query(`
		SELECT 
			t.topic_id,
			t.creator_id,
			t.topic_name,
			u.username
		FROM Topics t
		JOIN Users u ON t.creator_id = u.user_id`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var topics []model.TopicResponse
	for rows.Next() {
		var t model.TopicResponse
		if err := rows.Scan(
			&t.TopicID,
			&t.UserID,
			&t.TopicName,
			&t.Username,
		); err != nil {
			return nil, err
		}

		topics = append(topics, t)
	}

	return topics, nil
}

func (repo *TopicRepo) GetTopicByID(topicID uint64) (*model.TopicResponse, error) {
	var topic model.TopicResponse
	err := repo.db.QueryRow(`
		SELECT 
			t.creator_id,
			t.topic_name,
			t.description,
			u.username,
			t.created_at
		FROM Topics t
		JOIN Users u ON t.creator_id = u.user_id
		WHERE topic_id = ?`,
		topicID,
	).Scan(
		&topic.UserID,
		&topic.TopicName,
		&topic.Description,
		&topic.Username,
		&topic.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	topic.TopicID = topicID

	return &topic, nil
}

func (repo *TopicRepo) UpdateTopic(topic *model.Topic) error {
	_, err := repo.db.Exec(`
		UPDATE Topics
		SET description = ?
		WHERE topic_id = ?`,
		topic.Description,
		topic.TopicID,
	)
	return err
}
