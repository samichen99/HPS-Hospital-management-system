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

	// appointment routes
	api.HandleFunc("/appointments", handlers.GetAllAppointmentsHandler).Methods("GET")
	api.HandleFunc("/appointments/{id}", handlers.GetAppointmentByIDHandler).Methods("GET")
	api.HandleFunc("/appointments", handlers.CreateAppointmentHandler).Methods("POST")
	api.HandleFunc("/appointments/{id}", handlers.UpdateAppointmentHandler).Methods("PUT")
	api.HandleFunc("/appointments/{id}", handlers.DeleteAppointmentHandler).Methods("DELETE")

	// appointment filtering routes
	api.HandleFunc("/appointments/patient/{patient_id}", handlers.GetAppointmentsByPatientIDHandler).Methods("GET")
	api.HandleFunc("/appointments/doctor/{doctor_id}", handlers.GetAppointmentsByDoctorIDHandler).Methods("GET")
	api.HandleFunc("/appointments/status/{status}", handlers.GetAppointmentsByStatusHandler).Methods("GET")

	// appointment status update route
	api.HandleFunc("/appointments/{id}/status", handlers.UpdateAppointmentStatusHandler).Methods("PATCH")

	// medical record routes
	api.HandleFunc("/medical-records", handlers.GetAllMedicalRecordsHandler).Methods("GET")
	api.HandleFunc("/medical-records/{id}", handlers.GetMedicalRecordByIDHandler).Methods("GET")
	api.HandleFunc("/medical-records", handlers.CreateMedicalRecordHandler).Methods("POST")
	api.HandleFunc("/medical-records/{id}", handlers.UpdateMedicalRecordHandler).Methods("PUT")
	api.HandleFunc("/medical-records/{id}", handlers.DeleteMedicalRecordHandler).Methods("DELETE")

	// medical record filtering routes
	api.HandleFunc("/medical-records/patient/{patient_id}", handlers.GetMedicalRecordsByPatientHandler).Methods("GET")
	api.HandleFunc("/medical-records/doctor/{doctor_id}", handlers.GetMedicalRecordsByDoctorHandler).Methods("GET")

	// file routes
	api.HandleFunc("/files", handlers.GetAllFilesHandler).Methods("GET")
	api.HandleFunc("/files/{id}", handlers.GetFileByIDHandler).Methods("GET")
	api.HandleFunc("/files", handlers.CreateFileHandler).Methods("POST")
	api.HandleFunc("/files/{id}", handlers.DeleteFileHandler).Methods("DELETE")
	api.HandleFunc("/files/{id}", handlers.UpdateFileHandler).Methods("PUT")

	// file filtering routes
	api.HandleFunc("/files/patient/{patient_id}", handlers.GetFilesByPatientIDHandler).Methods("GET")

	// invoice routes
	api.HandleFunc("/invoices", handlers.GetAllInvoicesHandler).Methods("GET")
	api.HandleFunc("/invoices/{id}", handlers.GetInvoiceByIDHandler).Methods("GET")
	api.HandleFunc("/invoices", handlers.CreateInvoiceHandler).Methods("POST")
	api.HandleFunc("/invoices/{id}", handlers.UpdateInvoiceHandler).Methods("PUT")
	api.HandleFunc("/invoices/{id}", handlers.DeleteInvoiceHandler).Methods("DELETE")
	
	// invoice filtering routes
	api.HandleFunc("/invoices/patient/{patient_id}", handlers.GetInvoicesByPatientHandler).Methods("GET")
	api.HandleFunc("/invoices/status/{status}", handlers.GetInvoicesByStatusHandler).Methods("GET")

	// mark invoice as paid
	api.HandleFunc("/invoices/{id}/paid", handlers.MarkInvoicePaidHandler).Methods("PATCH")

	// Payment routes
	api.HandleFunc("/payments", handlers.GetAllPaymentsHandler).Methods("GET")
	api.HandleFunc("/payments/{id}", handlers.GetPaymentByIDHandler).Methods("GET")
	api.HandleFunc("/payments", handlers.CreatePaymentHandler).Methods("POST")
	api.HandleFunc("/payments/{id}", handlers.DeletePaymentHandler).Methods("DELETE")
	api.HandleFunc("/payments/{id}", handlers.UpdatePaymentHandler).Methods("PUT")

	// Payment filtering
	api.HandleFunc("/payments/invoice/{invoice_id}", handlers.GetPaymentsByInvoiceIDHandler).Methods("GET")

	
	// Health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API is up and running"))
	}).Methods("GET")

	return router
}
