package config

import (
	"crypto/rand"
	"fmt"
	"log"
	"os"
	"strconv"
)

type Config struct {
	JWTSecret              string
	JWTExpirationInSeconds int64
	DBUser                 string
	DBPassword             string
	DBName                 string
}

var Envs = initConfig()

func initConfig() Config {
	return Config{
		JWTSecret:              getEnv("JWT_SECRET", ""),
		DBUser:                 getEnv("MYSQL_USER", ""),
		DBPassword:             getEnv("MYSQL_PASSWORD", ""),
		DBName:                 getEnv("MYSQL_DATABASE", "forumdev"),
		JWTExpirationInSeconds: getEnvAsInt("JWT_EXPIRATION_IN_SECONDS", 60*60*24),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	if key == "JWT_SECRET" {
		bytes := make([]byte, 16)
		rand.Read(bytes)
		log.Printf("%x", bytes)

		return fmt.Sprintf("%x", bytes)
	}

	return fallback
}

func getEnvAsInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return fallback
		}

		return i
	}

	return fallback
}
