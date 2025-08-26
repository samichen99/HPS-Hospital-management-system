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

	// user routes

	api.HandleFunc("/users", handlers.GetAllUsersHandler).Methods("GET")
	api.HandleFunc("/users/{id}", handlers.GetUserByIDHandler).Methods("GET")
	api.HandleFunc("/users", handlers.CreateUserHandler).Methods("POST")
	api.HandleFunc("/users/{id}", handlers.UpdateUserHandler).Methods("PUT")
	api.HandleFunc("/users/{id}", handlers.DeleteUserHandler).Methods("DELETE")

	// patient routes

	api.HandleFunc("/patients", handlers.GetAllPatientsHandler).Methods("GET")
	api.HandleFunc("/patients/{id}", handlers.GetPatientByIDHandler).Methods("GET")
	api.HandleFunc("/patients", handlers.CreatePatientHandler).Methods("POST")
	api.HandleFunc("/patients/{id}", handlers.UpdatePatientHandler).Methods("PUT")
	api.HandleFunc("/patients/{id}", handlers.DeletePatientHandler).Methods("DELETE")
	
	// doctor routes

	api.HandleFunc("/doctors", handlers.GetAllDoctorsHandler).Methods("GET")
	api.HandleFunc("/doctors/{id}", handlers.CreateDoctorHandler).Methods("GET")
	api.HandleFunc("/doctors", handlers.CreateDoctorHandler).Methods("POST")
	api.HandleFunc("/doctors/{id}", handlers.UpdateDoctorHandler).Methods("PUT")
	api.HandleFunc("/doctors/{id}", handlers.DeleteDoctorHandler).Methods("DELETE")


	// Health check endpoint

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is up and running"))
	}).Methods("GET")

	return router
}
