package config

import (
	"os"
)

type Config struct {
	Port string
}

var Envs = initConfig()

func initConfig() Config {
	return Config{
		Port: getEnv("PORT", "8000"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}
