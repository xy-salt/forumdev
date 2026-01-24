package repository

import (
	"database/sql"
	"errors"

	"github.com/xy-salt/forumdev/backend/internal/model"
)

type PostRepo struct {
	db *sql.DB
}

func NewPostRepo(db *sql.DB) *PostRepo {
	return &PostRepo{db: db}
}

func (repo *PostRepo) Home() ([]model.MainPostResponse, error) {
	rows, err := repo.db.Query(`
		SELECT 
			post_id,
			topic_id,
			creator_id,
			title,
			topic_name,
			username
		FROM All_Active_Main_Posts
		ORDER BY post_id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.MainPostResponse
	for rows.Next() {
		var p model.MainPostResponse
		if err := rows.Scan(
			&p.PostID,
			&p.TopicID,
			&p.CreatorID,
			&p.Title,
			&p.TopicName,
			&p.Username,
		); err != nil {
			return nil, err
		}

		posts = append(posts, p)
	}

	return posts, nil
}

func (repo *PostRepo) InsertPost(post *model.Post) error {
	_, err := repo.db.Exec(`
		INSERT INTO Posts (topic_id, creator_id, title, content)
		VALUES (?, ?, ?, ?)`,
		post.TopicID,
		post.CreatorID,
		post.Title,
		post.Content,
	)

	return err
}

func (repo *PostRepo) InsertComment(comment *model.Post) error {
	_, err := repo.db.Exec(`
		INSERT INTO Posts (topic_id, creator_id, parent_post_id, content)
		VALUES (?, ?, ?, ?)`,
		comment.TopicID,
		comment.CreatorID,
		comment.ParentPostID,
		comment.Content,
	)

	return err
}
func (repo *PostRepo) TopicPosts(topicID uint64) ([]model.MainPostResponse, error) {
	rows, err := repo.db.Query(`
		SELECT 
			post_id, 
			creator_id,
			title,
			username 
		FROM All_Active_Main_Posts
		WHERE topic_id = ?
		ORDER BY post_id DESC
	`, topicID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.MainPostResponse
	for rows.Next() {
		var p model.MainPostResponse
		if err := rows.Scan(
			&p.PostID,
			&p.CreatorID,
			&p.Title,
			&p.Username,
		); err != nil {
			return nil, err
		}

		posts = append(posts, p)
	}

	return posts, nil
}

func (repo *PostRepo) GetPost(topicID uint64, postID uint64) (*model.PostResponse, error) {
	var post model.PostResponse
	err := repo.db.QueryRow(`
		SELECT 
			title, 
			content,
			topic_name,
			user_id,
			username,
			p.is_deleted,
			t.creator_id
		FROM Posts p
		JOIN Users u ON p.creator_id = u.user_id
		JOIN Topics t ON p.topic_id = t.topic_id
		WHERE p.topic_id = ? 
			AND p.post_id = ?`,
		topicID,
		postID,
	).Scan(
		&post.Title,
		&post.Content,
		&post.TopicName,
		&post.UserID,
		&post.Username,
		&post.IsDeleted,
		&post.TopicCreatorID,
	)
	if err != nil {
		return nil, err
	}

	rows, err := repo.db.Query(`
		SELECT 
			post_id,
			topic_id,
			creator_id,
			content,
			username
		FROM Posts p
		JOIN Users u on p.creator_id = u.user_id
		WHERE p.parent_post_id = ?
			AND p.is_deleted = 0
		ORDER BY post_id DESC`,
		postID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []model.CommentResponse
	for rows.Next() {
		var c model.CommentResponse
		if err := rows.Scan(
			&c.CommentID,
			&c.TopicID,
			&c.CreatorID,
			&c.Content,
			&c.Username,
		); err != nil {
			return nil, err
		}

		comments = append(comments, c)
	}
	post.Comments = comments

	return &post, nil
}
func (repo *PostRepo) UpdatePost(post *model.Post, isComment bool) error {
	if isComment {
		result, err := repo.db.Exec(`
			UPDATE Posts
			SET content = ?
			WHERE post_id = ? 
				AND creator_id = ?`,
			post.Content,
			post.PostID,
			post.CreatorID,
		)

		if err != nil {
			return err
		}

		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}

		if affected == 0 {
			return errors.New("unauthorized")
		}

		return nil

	} else {
		result, err := repo.db.Exec(`
			UPDATE Posts
			SET title = ?, content = ?
			WHERE post_id = ? 
				AND creator_id = ?`,
			post.Title,
			post.Content,
			post.PostID,
			post.CreatorID,
		)

		if err != nil {
			return err
		}

		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}

		if affected == 0 {
			return errors.New("unauthorized")
		}

		return nil
	}

}

func (repo *PostRepo) DeletePost(postID uint64, userID uint64) error {
	result, err := repo.db.Exec(`
	 	UPDATE Posts p
		JOIN Topics t ON t.topic_id = p.topic_id
		SET p.is_deleted = 1 
		WHERE p.post_id = ?
			AND (p.creator_id = ? OR t.creator_id = ?)`,
		postID,
		userID,
		userID,
	)

	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	} else if affected == 0 {
		return errors.New("Unauthorized")
	}

	return err
}
