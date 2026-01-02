package handler

import (
	"fmt"
	"net/http"
)

func CreateTopic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("created topic")
}

func ListTopics(w http.ResponseWriter, r *http.Request) {
	fmt.Println("listed topics")
}

func TopicDetails(w http.ResponseWriter, r *http.Request) {
	fmt.Println("topic details displayed")
}

func UpdateTopic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("topic updated")
}
