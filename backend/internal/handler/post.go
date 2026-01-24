package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/xy-salt/forumdev/backend/internal/auth"
	"github.com/xy-salt/forumdev/backend/internal/model"
)

const (
	POSTPAYLOADLIMIT = 50 << 10
	POSTBASE         = 10
	POSTBITSIZE      = 64
)

type PostHandler struct {
	Repo model.PostInterface
}

func NewPostHandler(repo model.PostInterface) *PostHandler {
	return &PostHandler{Repo: repo}
}

func (h *PostHandler) RegisterRouters(router *chi.Mux) {
	router.Get("/", h.Home)

	router.Route("/topics/{topic_id}/posts", func(router chi.Router) {
		router.Get("/", h.ListPosts)

		router.Group(func(router chi.Router) {
			router.Use(auth.AuthMiddleware)
			router.Post("/", h.CreatePost)
		})

		router.Route("/{post_id}", func(router chi.Router) {
			router.Get("/", h.GetPost)

			router.Group(func(router chi.Router) {
				router.Use(auth.AuthMiddleware)
				// router.Use(auth.RequireSameUser)
				router.Put("/", h.UpdatePost)
				router.Delete("/", h.DeletePost)

			})

			router.Route("/comments", func(router chi.Router) {
				router.Use(auth.AuthMiddleware)
				router.Post("/", h.CreateComment)
			})
		})
	})
}

var (
	ErrEmptyPostTitle   = errors.New("No title found")
	ErrInvalidPostTitle = errors.New("invalid characters in post title")
	ErrEmptyPostContent = errors.New("no content found")
	postTitleRegex      = regexp.MustCompile(`^[\x20-\x7E]+$`)
)

func checkPostTitle(title string) (string, error) {
	title = strings.TrimSpace(title)

	if title == "" {
		return "", ErrEmptyPostTitle
	}

	if !postTitleRegex.MatchString(title) {
		return "", ErrInvalidPostTitle
	}
	return title, nil
}

func checkPostContent(content string) (string, error) {
	content = strings.TrimSpace(content)

	if content == "" {
		return "", ErrEmptyPostContent
	}

	return content, nil
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, POSTPAYLOADLIMIT)

	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	var postReq model.PostRequest

	if err := json.NewDecoder(r.Body).Decode(&postReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	title, err := checkPostTitle(postReq.Title)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	content, err := checkPostContent(postReq.Content)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	post := &model.Post{
		TopicID:   topicID,
		CreatorID: postReq.UserID,
		Title:     title,
		Content:   content,
	}

	err = h.Repo.InsertPost(post)
	if err != nil {
		log.Println("failed to create post", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	//w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	// if err := json.NewEncoder(w).Encode(map[string]any{
	// 	"post_id": postID,
	// }); err != nil {
	// 	log.Println("failed to encode")
	// 	return
	// }
}

func (h *PostHandler) Home(w http.ResponseWriter, r *http.Request) {
	posts, err := h.Repo.Home()
	if err != nil {
		log.Println("failed to retrieve all posts", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		log.Println("failed to retrieve all posts", err)
		return
	}
}

func (h *PostHandler) ListPosts(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	posts, err := h.Repo.TopicPosts(topicID)
	if err != nil {
		log.Println("failed to retrieve all posts in topic", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		log.Println("failed to retrieve all posts in topic", err)
		return
	}
}

func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	idParam = chi.URLParam(r, "post_id")
	postID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	post, err := h.Repo.GetPost(topicID, postID)
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "invalid topic id or post id", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("failed to retrieve post", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(post); err != nil {
		log.Println("failed to retrieve post", err)
		return
	}
}

func (h *PostHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, POSTPAYLOADLIMIT)
	userID, ok := r.Context().Value(auth.UserKey).(uint64)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
	}

	idParam := chi.URLParam(r, "post_id")
	postID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	var postChangeReq model.PostRequest

	if err := json.NewDecoder(r.Body).Decode(&postChangeReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	isComment := false

	title, err := checkPostTitle(postChangeReq.Title)
	if errors.Is(err, ErrEmptyPostTitle) {
		isComment = true
	} else if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	content, err := checkPostContent(postChangeReq.Content)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	post := &model.Post{
		PostID:    postID,
		CreatorID: userID,
		Title:     title,
		Content:   content,
	}

	err = h.Repo.UpdatePost(post, isComment)
	if err != nil {
		log.Println("failed to update post", err)
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	// w.Header().Set("Content-Type", "application/json")
	// if err := json.NewEncoder(w).Encode(newpost); err != nil {
	// 	log.Println("failed to retrieve updated post", err)
	// 	return
	// }
}

func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserKey).(uint64)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	idParam := chi.URLParam(r, "post_id")
	postID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	err = h.Repo.DeletePost(postID, userID)
	if err != nil {
		log.Println("failed to delete post", err)
		if err.Error() == "Unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *PostHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, POSTPAYLOADLIMIT)

	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	idParam = chi.URLParam(r, "post_id")
	parentPostID, err := strconv.ParseUint(idParam, POSTBASE, POSTBITSIZE)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	var commentReq model.CommentRequest

	if err := json.NewDecoder(r.Body).Decode(&commentReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	comment, err := checkPostContent(commentReq.Comment)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	post := &model.Post{
		TopicID:      topicID,
		CreatorID:    commentReq.UserID,
		ParentPostID: parentPostID,
		Content:      comment,
	}

	err = h.Repo.InsertComment(post)
	if err != nil {
		log.Println("failed to create comment", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	// w.Header().Set("Content-Type", "application/json")
	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(map[string]any{
	// 	"parent_post_id": parentPostID,
	// 	"comment_id":     postID,
	// })
}
