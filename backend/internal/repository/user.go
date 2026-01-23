package repository

import (
	"database/sql"

	"github.com/xy-salt/forumdev/backend/internal/model"
)

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (repo *UserRepo) InsertUser(user *model.User) error {
	_, err := repo.db.Exec(`
		INSERT INTO Users (username, password)
		VALUES (?, ?)`,
		user.Username,
		user.Password,
	)
	return err
}

func (repo *UserRepo) AllUsers() ([]model.UserResponse, error) {
	rows, err := repo.db.Query(`
		SELECT 
			user_id,
			username
		FROM Users`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []model.UserResponse
	for rows.Next() {
		var u model.UserResponse
		if err := rows.Scan(
			&u.UserID,
			&u.Username,
		); err != nil {
			return nil, err
		}

		users = append(users, u)
	}

	return users, err
}

func (repo *UserRepo) GetUserByID(userID uint64) (*model.UserResponse, error) {
	var user model.UserResponse
	err := repo.db.QueryRow(`
		SELECT username, created_at
		FROM Users
		WHERE user_id = ?`,
		userID,
	).Scan(&user.Username, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	rows, err := repo.db.Query(`
		SELECT 
			post_id,
			topic_id, 
			title, 
			topic_name
		FROM All_Active_Main_Posts
		WHERE creator_id = ?`,
		userID,
	)
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
			&p.Title,
			&p.TopicName,
		); err != nil {
			return nil, err
		}

		posts = append(posts, p)
	}
	user.Posts = posts

	return &user, nil
}

func (repo *UserRepo) GetUserByName(username string) (*model.User, error) {
	var user model.User
	err := repo.db.QueryRow(`
		SELECT 
			user_id,
			password,
			is_deleted
		FROM Users
		WHERE username = ?`,
		username,
	).Scan(
		&user.UserID,
		&user.Password,
		&user.IsDeleted,
	)
	if err != nil {
		return nil, err
	}

	if user.IsDeleted {
		return nil, err
	}

	return &user, nil
}

func (repo *UserRepo) UpdateUser(user *model.User) error {
	_, err := repo.db.Exec(`
		UPDATE Users
		SET username = 
				CASE 
					WHEN ? = "" THEN username
					ELSE ?
				END,
			password = 
				CASE
					WHEN ? = "" THEN password
					ELSE ?
				END
		WHERE user_id = ?`,
		user.Username,
		user.Username,
		user.Password,
		user.Password,
		user.UserID,
	)

	return err
}

func (repo *UserRepo) DeleteUser(userID uint64) error {
	_, err := repo.db.Exec(`
		UPDATE Users
		SET is_deleted = 1
		WHERE user_id = ?`,
		userID,
	)

	return err
}
