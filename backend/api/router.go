package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/backend/handlers"
)

// NewRouter initializes and returns a new HTTP router
func NewRouter() *mux.Router {
	// Create a new router instance
	router := mux.NewRouter()

	// Group API under /api path
	api := router.PathPrefix("/api").Subrouter()

	// user routes

	api.HandleFunc("/users", handlers.GetAllUsers).Methods("GET")
	api.HandleFunc("/users/{id}", handlers.GetUserByID).Methods("GET")
	api.HandleFunc("/users", handlers.CreateUser).Methods("POST")
	api.HandleFunc("/users/{id}", handlers.UpdateUser).Methods("PUT")
	api.HandleFunc("/users/{id}", handlers.DeleteUser).Methods("DELETE")

	// Health check endpoint

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is up and running"))
	}).Methods("GET")

	return router
}
