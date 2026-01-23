DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Topics (
    topic_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    creator_id BIGINT UNSIGNED NOT NULL,
    topic_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_topics_creator
        FOREIGN KEY (creator_id)
        REFERENCES Users(user_id)
);

CREATE TABLE Posts (
    post_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topic_id BIGINT UNSIGNED NOT NULL,
    creator_id BIGINT UNSIGNED NOT NULL,
    parent_post_id BIGINT UNSIGNED,
    title VARCHAR(255) NOT NULL DEFAULT '',
    content TEXT,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_creator
        FOREIGN KEY (creator_id)
        REFERENCES Users(user_id),

    CONSTRAINT fk_posts_topic
        FOREIGN KEY (topic_id)
        REFERENCES Topics(topic_id),

    CONSTRAINT fk_posts_parent
        FOREIGN KEY (parent_post_id)
        REFERENCES Posts(post_id)
);

CREATE INDEX idx_users_active ON Users(is_deleted);
CREATE INDEX idx_topics_creator ON Topics(creator_id);
CREATE INDEX idx_posts_creator ON Posts(creator_id);
CREATE INDEX idx_posts_topic ON Posts(topic_id);
CREATE INDEX idx_posts_parent ON Posts(parent_post_id);
CREATE INDEX idx_posts_active ON Posts(is_deleted);

CREATE VIEW All_Active_Main_Posts AS 
SELECT 
    p.post_id, 
    p.topic_id, 
    p.creator_id, 
    p.title, 
    t.topic_name, 
    u.username
FROM Posts p
JOIN Users u ON p.creator_id = u.user_id
JOIN Topics t ON p.topic_id = t.topic_id
WHERE p.is_deleted = 0
    AND p.parent_post_id IS NULL
