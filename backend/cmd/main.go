package main

import (
	"fmt"

	"github.com/xy-salt/forumdev/backend/internal/config"
	"github.com/xy-salt/forumdev/backend/internal/server"
)

func main() {
	srv := server.NewServer()

	fmt.Printf("Listening on port %s at http://localhost:%s!", config.Envs.Port, config.Envs.Port)

	err := srv.ListenAndServe()
	if err != nil {
		fmt.Println(fmt.Errorf("failed to start server: %w", err))
	}
}
