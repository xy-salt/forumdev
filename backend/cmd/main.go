package main

import (
	"fmt"
	"log"

	"github.com/xy-salt/forumdev/backend/internal/config"
	"github.com/xy-salt/forumdev/backend/internal/database"
	"github.com/xy-salt/forumdev/backend/internal/server"
)

func main() {
	if config.Envs.DBName == "" || config.Envs.DBPassword == "" {
		log.Fatal("set db username and password in .env file")
	}
	db := database.DatabaseConn(
		fmt.Sprintf("%s:%s@tcp(db:3306)/%s?parseTime=true",
			config.Envs.DBUser,
			config.Envs.DBPassword,
			config.Envs.DBName,
		),
	)

	defer db.Close()
	server := server.NewServer(":8000", db)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
