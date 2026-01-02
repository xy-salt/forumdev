package server

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/xy-salt/forumdev/backend/internal/handler"
)

// routings:
// 	|-> / homepage
// 		|-> able to view all posts available in the Forum
// 	|-> /users
// 		|-> shows all users
// 		|-> account creation
// 		|-> /{user_id}
// 			|-> shows {user_id}'s profile, consisting of the user's posts
// 			|-> update {user_id}'s username/password (if is user)
// 			|-> delete {user_id}'s account (if is user)
// 	|-> /topics
// 		|-> shows all topics available
// 		|-> topic creation
// 		|-> /{topic_id}
// 			|-> shows topic details
// 			|-> update topic's description
// 			|-> /posts
// 				|-> post creation under topic
// 				|-> shows all posts under topic
// 				|-> /{post_id}
// 					|-> show post and its comments
// 					|-> update post's content (if is op)
// 					|-> delete post (if is op or moderator)
// 					|-> /comment
// 						|-> post(comment) creation under post

func setupRouter() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	router.Get("/", handler.Home)

	router.Route("/users", func(router chi.Router) {
		router.Post("/", handler.CreateUser)
		router.Get("/", handler.ListUsers)
		router.Get("/{user_id}", handler.UserProfile)
		router.Group(func(router chi.Router) {
			router.Use(AuthMiddleware)
			router.Use(RequireSameUser)
			router.Put("/{user_id}", handler.UpdateUser)
			router.Delete("/{user_id}", handler.DeleteUser)
		})
	})

	router.Route("/topics", func(router chi.Router) {
		router.Get("/", handler.ListTopics)
		router.Get("/{topic_id}", handler.TopicDetails)

		router.Group(func(router chi.Router) {
			router.Use(AuthMiddleware)
			router.Post("/", handler.CreateTopic)
			router.With(RequireModerator).Put("/{topic_id}", handler.UpdateTopic)
		})

		router.Route("/{topic_id}/posts", func(router chi.Router) {
			router.Get("/", handler.ListPosts)
			router.Get("/{post_id}", handler.GetPost)

			router.Group(func(router chi.Router) {
				router.Use(AuthMiddleware)
				router.Post("/", handler.CreatePost)
				router.With(RequireSameUser).Put("/{post_id}", handler.UpdatePost)
				router.With(RequireModeratorOrUser).Delete("/{post_id}", handler.DeletePost)

				router.Route("/{post_id}/comments", func(router chi.Router) {
					router.Post("/", handler.CreateComment)
				})
			})
		})
	})

	return router
}
