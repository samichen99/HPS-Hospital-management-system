package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/handlers"
	"github.com/samichen99/HAP-hospital-management-system/middleware"
)

func NewRouter() *mux.Router {

	router := mux.NewRouter()

	// Public auth route
	router.HandleFunc("/auth/login", handlers.LoginHandler).Methods("POST")

	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.AuthMiddleware)

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
	api.HandleFunc("/doctors/{id}", handlers.GetDoctorByIDHandler).Methods("GET")
	api.HandleFunc("/doctors", handlers.CreateDoctorHandler).Methods("POST")
	api.HandleFunc("/doctors/{id}", handlers.UpdateDoctorHandler).Methods("PUT")
	api.HandleFunc("/doctors/{id}", handlers.DeleteDoctorHandler).Methods("DELETE")

	// Appointment routes

	api.HandleFunc("/appointments", handlers.GetAllAppointmentsHandler).Methods("GET")
	api.HandleFunc("/appointments/{id}", handlers.GetAppointmentByIDHandler).Methods("GET")
	api.HandleFunc("/appointments", handlers.CreateAppointmentHandler).Methods("POST")
	api.HandleFunc("/appointments/{id}", handlers.UpdateAppointmentHandler).Methods("PUT")
	api.HandleFunc("/appointments/{id}", handlers.DeleteAppointmentHandler).Methods("DELETE")

	// Appointment filtering routes

	api.HandleFunc("/appointments/patient/{patient_id}", handlers.GetAppointmentsByPatientIDHandler).Methods("GET")
	api.HandleFunc("/appointments/doctor/{doctor_id}", handlers.GetAppointmentsByDoctorIDHandler).Methods("GET")
	api.HandleFunc("/appointments/status/{status}", handlers.GetAppointmentsByStatusHandler).Methods("GET")

	// Appointment status update route
	api.HandleFunc("/appointments/{id}/status", handlers.UpdateAppointmentStatusHandler).Methods("PATCH")

	// Health check endpoint

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is up and running"))
	}).Methods("GET")

	return router
}
