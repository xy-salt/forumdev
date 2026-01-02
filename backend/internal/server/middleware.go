package server

import (
	"fmt"
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("authenicated")
		next.ServeHTTP(w, r)
	})
}

func RequireSameUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("authorized same user")
		next.ServeHTTP(w, r)
	})
}

func RequireModerator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("authorized moderator")
		next.ServeHTTP(w, r)
	})
}

func RequireModeratorOrUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("authorized moderator or OP")
		next.ServeHTTP(w, r)
	})
}
