package auth

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserKey contextKey = "userID"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "you must login to perform this action", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "invalid authorization header", http.StatusUnauthorized)
			return
		}

		token, err := ValidateJWT(parts[1])
		if err != nil {
			http.Error(w, "invalid or expired token", http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		uid, ok := claims["userID"].(float64)
		if !ok {
			http.Error(w, "invalid token claims", http.StatusUnauthorized)
			return
		}
		userID := uint64(uid)

		ctx := context.WithValue(r.Context(), UserKey, userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// only handles user update and delete
// does not handle post updates
// does not handler topic updates
func RequireSameUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authUserID, ok := r.Context().Value(UserKey).(uint64)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		idParam := chi.URLParam(r, "user_id")
		if idParam != "" {
			targetUserID, err := strconv.ParseUint(idParam, 10, 64)
			if err != nil {
				http.Error(w, "invalid user id", http.StatusBadRequest)
				return
			}

			if authUserID != targetUserID {
				http.Error(w, "forbidden", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
			return
		}

		// idParam = chi.URLParam(r, "topic_id")
		// if idParam != "" {
		// 	topicID, err := strconv.ParseUint(idParam, 10, 64)
		// 	if err != nil {
		// 		http.Error(w, "invalid topic id", http.StatusBadRequest)
		// 		return
		// 	}

		// 	creatorID, err :=
		// }

	})
}

// func RequireModerator(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		fmt.Println("authorized moderator")
// 		next.ServeHTTP(w, r)
// 	})
// }

// func RequireModeratorOrUser(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		fmt.Println("authorized moderator or OP")
// 		next.ServeHTTP(w, r)
// 	})
// }
