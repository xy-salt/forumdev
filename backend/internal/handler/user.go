package handler

import (
	"fmt"
	"net/http"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("created user")
}

func ListUsers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("listed users")
}

func UserProfile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("user profile displayed")
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("updated user")
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("deleted user")
}
