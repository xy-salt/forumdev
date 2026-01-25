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
	"github.com/xy-salt/forumdev/backend/internal/config"
	"github.com/xy-salt/forumdev/backend/internal/model"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	Repo model.UserInterface
}

func NewUserHandler(repo model.UserInterface) *UserHandler {
	return &UserHandler{Repo: repo}
}

func (h *UserHandler) RegisterRouters(router *chi.Mux) {
	router.Route("/register", func(router chi.Router) {
		router.Post("/", h.RegisterUser)
	})
	router.Route("/login", func(router chi.Router) {
		router.Post("/", h.LoginUser)
	})

	router.Route("/users", func(router chi.Router) {
		router.Get("/", h.ListUsers)
		router.Route("/{user_id}", func(router chi.Router) {
			router.Get("/", h.UserProfile)
			router.Group(func(router chi.Router) {
				router.Use(auth.AuthMiddleware)
				// router.Use(auth.RequireSameUser)
				router.Put("/", h.UpdateUser)
				router.Delete("/", h.DeleteUser)
			})
		})
	})
}

const (
	USERPAYLOADLIMIT = 2 << 10
	USERBASE         = 10
	USERBITSIZE      = 64
)

var usernameRegex = regexp.MustCompile(`^[A-Za-z][A-Za-z0-9_]*$`)
var (
	ErrUsernameTooShort = errors.New("username must have at least 3 characters")
	ErrUsernameTooLong  = errors.New("username cannot be longer than 64 characters")
	ErrInvalidUsername  = errors.New("username may contain only letters (A-Z, a-z) and underscore, and must start with a letter")
)

func checkUsername(username string) error {
	if len(username) < 3 {
		return ErrUsernameTooShort
	}

	if len(username) > 64 {
		return ErrUsernameTooLong
	}

	if !usernameRegex.MatchString(username) {
		return ErrInvalidUsername
	}

	return nil
}

var passwordRegex = regexp.MustCompile(`^[\x20-\x7E]+$`)
var (
	ErrPasswordTooShort = errors.New("password must have at least 8 characters")
	ErrPasswordTooLong  = errors.New("password cannot be longer than 72 characters")
	ErrInvalidPassword  = errors.New("password contains invalid character")
)

func checkPassword(password string) error {
	if len(password) < 8 {
		return ErrPasswordTooShort
	}

	if len(password) > 72 {
		return ErrPasswordTooLong
	}

	if !passwordRegex.MatchString(password) {
		return ErrInvalidPassword
	}

	return nil
}

func (h *UserHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, USERPAYLOADLIMIT)

	var req model.UserRegisterLoginPayload

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	err := checkUsername(req.Username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = checkPassword(req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	passwordhash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("failed to hash password", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
	}

	user := &model.User{
		Username: req.Username,
		Password: string(passwordhash),
	}

	err = h.Repo.InsertUser(user)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			http.Error(w, fmt.Sprintf("username %s already exists", req.Username), http.StatusConflict)
			return
		}

		log.Println("failed to create user", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func comparePassword(input string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(input))
	return err == nil
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var user model.UserRegisterLoginPayload
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	u, err := h.Repo.GetUserByName(user.Username)
	if err != nil {
		http.Error(w, "invalid username or password", http.StatusUnauthorized)
		return
	}

	if !comparePassword(user.Password, u.Password) {
		http.Error(w, "invalid username or password", http.StatusUnauthorized)
		return
	}

	secret := []byte(config.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, u.UserID)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "failed to login", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	}); err != nil {
		log.Println("failed to encode", err)
		return
	}
}

func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.Repo.AllUsers()
	if err != nil {
		log.Println("failed to list all users", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		log.Println("failed to encode", err)
		return
	}
}

func (h *UserHandler) UserProfile(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "user_id")
	userID, err := strconv.ParseUint(idParam, USERBASE, USERBITSIZE)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	user, err := h.Repo.GetUserByID(userID)
	if err != nil {
		log.Println("failed to get user", err)
		if err.Error() == "user not found" {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, "intenal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		log.Println("failed to encode", err)
		return
	}
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, USERPAYLOADLIMIT)
	authUserID := r.Context().Value(auth.UserKey).(uint64)

	idParam := chi.URLParam(r, "user_id")
	userID, err := strconv.ParseUint(idParam, USERBASE, USERBITSIZE)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	if userID != authUserID {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var userChangeReq model.UserRegisterLoginPayload

	if err := json.NewDecoder(r.Body).Decode(&userChangeReq); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user := &model.User{
		UserID: authUserID,
	}

	if userChangeReq.Username != "" {
		err = checkUsername(userChangeReq.Username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		user.Username = userChangeReq.Username
	}

	if userChangeReq.Password != "" {
		err = checkPassword(userChangeReq.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		passwordhash, err := bcrypt.GenerateFromPassword(
			[]byte(userChangeReq.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			log.Println("failed to hash password", err)
			http.Error(w, "internal error", http.StatusInternalServerError)
		}

		user.Password = string(passwordhash)
	}

	err = h.Repo.UpdateUser(user)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			http.Error(w, fmt.Sprintf("username %s already exists", user.Username), http.StatusConflict)
			return
		}

		log.Println("failed to create user", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	authUserID := r.Context().Value(auth.UserKey).(uint64)
	idParam := chi.URLParam(r, "user_id")
	userID, err := strconv.ParseUint(idParam, USERBASE, USERBITSIZE)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	if authUserID != userID {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	err = h.Repo.DeleteUser(userID)
	if err != nil {
		log.Println("failed to soft delete user", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
