package api

import (
	"net/http"
	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/handlers"
)

// NewRouter defining

func NewRouter() *mux.Router {

	// Create a new router

	router := mux.NewRouter()

	// Group API

	api := router.PathPrefix("/api").Subrouter()

	// user routing

	api.HandleFunc("/users", handlers.GetAllUsersHandler).Methods("GET")
	api.HandleFunc("/users/{id}", handlers.GetUserByIDHandler).Methods("GET")
	api.HandleFunc("/users", handlers.CreateUserHandler).Methods("POST")
	api.HandleFunc("/users/{id}", handlers.UpdateUserHandler).Methods("PUT")
	api.HandleFunc("/users/{id}", handlers.DeleteUserHandler).Methods("DELETE")

	// Health check endpoint

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is up and running"))
	}).Methods("GET")

	return router
}
