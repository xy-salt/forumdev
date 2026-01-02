package server

import (
	"net/http"

	"github.com/xy-salt/forumdev/backend/internal/config"
)

func NewServer() *http.Server {
	router := setupRouter()
	return &http.Server{
		Addr:    ":" + config.Envs.Port,
		Handler: router,
	}
}
