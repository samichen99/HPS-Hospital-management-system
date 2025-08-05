package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
	"github.com/gorilla/mux"
)

// CreateUserHandler func
func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User

	// Decode JSON
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = repositories.CreateUser(user)
	if err != nil {
		http.Error(w, "Could not create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "User created successfully")
}

// GetUserByIDHandler func
func GetUserByIDHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	user, err := repositories.GetUserByID(id)
	if err != nil {
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return
	}

	// Return user as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GetAllUsersHandler handles GET /users
func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := repositories.GetAllUsers()
	if err != nil {
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// DeleteUserHandler handles DELETE /users/{id}
func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = repositories.DeleteUser(id)
	if err != nil {
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "User deleted successfully")
}
