package handler

import (
	"fmt"
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Home page with all posts displayed")
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("created post")
}

func ListPosts(w http.ResponseWriter, r *http.Request) {
	fmt.Println("listed posts under topic")
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("post displayed")
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("updated post")
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("deleted post")
}

func CreateComment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("created comment")
}
