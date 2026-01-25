package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-sql-driver/mysql"
	"github.com/xy-salt/forumdev/backend/internal/auth"
	"github.com/xy-salt/forumdev/backend/internal/model"
)

const (
	TOPICPAYLOADLIMIT = 2 << 10
	TOPICBASE         = 10
	TOPICBITSIZE      = 64
)

var (
	ErrEmptyTopic       = errors.New("topic name cannot be empty")
	ErrInvalidTopicName = errors.New("topic name can only contain (A-Z, a-z)")
	topicRegex          = regexp.MustCompile(`^[A-Za-z]+$`)
)

func checkTopicName(name string) error {
	if name == "" {
		return ErrEmptyTopic
	}

	if !topicRegex.MatchString(name) {
		return ErrInvalidTopicName
	}

	return nil
}

type TopicHandler struct {
	Repo model.TopicInterface
}

func NewTopicHandler(repo model.TopicInterface) *TopicHandler {
	return &TopicHandler{Repo: repo}
}

func (h *TopicHandler) RegisterRouters(router *chi.Mux) {
	router.Route("/topics", func(router chi.Router) {
		router.Get("/", h.ListTopics)

		router.Group(func(router chi.Router) {
			router.Use(auth.AuthMiddleware)
			router.Post("/", h.CreateTopic)
		})

		router.Route("/{topic_id}", func(router chi.Router) {
			router.Get("/", h.TopicDetails)
			router.Group(func(router chi.Router) {
				router.Use(auth.AuthMiddleware)
				// router.Use(auth.RequireSameUser)
				router.Put("/", h.UpdateTopic)
			})
		})
	})
}

func (h *TopicHandler) CreateTopic(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, TOPICPAYLOADLIMIT)

	var topicReq model.TopicRequest

	if err := json.NewDecoder(r.Body).Decode(&topicReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	err := checkTopicName(topicReq.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	topic := &model.Topic{
		UserID:      topicReq.UserID,
		Name:        topicReq.Name,
		Description: topicReq.Description,
	}

	err = h.Repo.InsertTopic(topic)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			http.Error(w, fmt.Sprintf("topic name %s already exists", topicReq.Name), http.StatusConflict)
			return
		}
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1406 {
			http.Error(w, "topic name too long", http.StatusBadRequest)
			return
		}
		log.Println("failed to create topic", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	// w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	// if err := json.NewEncoder(w).Encode(map[string]any{
	// 	"topic_id": topicID,
	// }); err != nil {
	// 	log.Println("failed to encode", err)
	// 	return
	// }
}

func (h *TopicHandler) ListTopics(w http.ResponseWriter, r *http.Request) {
	topics, err := h.Repo.Topics()
	if err != nil {
		log.Println("failed to retrieve all topics", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(topics); err != nil {
		log.Println("failed to retrieve all topics", err)
		return
	}
}

func (h *TopicHandler) TopicDetails(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, TOPICBASE, TOPICBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	topic, err := h.Repo.GetTopicByID(topicID)
	if err != nil {
		log.Println("failed to retrieve topic", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(topic); err != nil {
		log.Println("failed to retrieve topic ", err)
		return
	}
}

func (h *TopicHandler) UpdateTopic(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, TOPICPAYLOADLIMIT)
	userID, ok := r.Context().Value(auth.UserKey).(uint64)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	idParam := chi.URLParam(r, "topic_id")
	topicID, err := strconv.ParseUint(idParam, TOPICBASE, TOPICBITSIZE)
	if err != nil {
		http.Error(w, "invalid topic id", http.StatusBadRequest)
		return
	}

	var topicReq model.TopicRequest

	if err := json.NewDecoder(r.Body).Decode(&topicReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	topic := &model.Topic{
		UserID:      userID,
		TopicID:     topicID,
		Description: topicReq.Description,
	}

	err = h.Repo.UpdateTopic(topic)
	if err != nil {
		log.Println("failed to update topic", err)
		if err.Error() == "unauthorized" {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	// w.Header().Set("Content-Type", "application/json")
	// if err := json.NewEncoder(w).Encode(updatedTopic); err != nil {
	// 	log.Println("failed to retreive updated topic", err)
	// 	return
	// }
}
