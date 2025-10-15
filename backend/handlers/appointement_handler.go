package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

// CreateAppointmentHandler
func CreateAppointmentHandler(w http.ResponseWriter, r *http.Request) {
	var appointment models.Appointment

	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if appointment.Status == "" {
		appointment.Status = "scheduled"
	}

	if appointment.Duration == 0 {
		appointment.Duration = 30
	}

	if err := repositories.CreateAppointment(&appointment); err != nil {
		http.Error(w, "Failed to create appointment", http.StatusInternalServerError)
		return
	}

	// Publish Kafka event
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := utils.PublishAppointmentEvent(ctx, "appointments.created", appointment); err != nil {
		log.Printf("Failed to publish appointment.created: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(appointment)
}

// GetAppointmentByIDHandler
func GetAppointmentByIDHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid appointment ID", http.StatusBadRequest)
		return
	}

	appointment, err := repositories.GetAppointmentByID(id)
	if err != nil {
		http.Error(w, "Appointment not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointment)
}

//update appointment handler

func UpdateAppointmentHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid appointment ID", http.StatusBadRequest)
		return
	}

	var appointment models.Appointment
	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	appointment.ID = uint(id)

	if err := repositories.UpdateAppointment(&appointment); err != nil {
		http.Error(w, "Failed to update appointment", http.StatusInternalServerError)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := utils.PublishAppointmentEvent(ctx, "appointments.updated", appointment); err != nil {
		log.Printf("Failed to publish appointment.updated: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Appointment updated successfully",
	})
}

// UpdateAppointmentStatusHandler
func UpdateAppointmentStatusHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid appointment ID", http.StatusBadRequest)
		return
	}

	var payload struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if payload.Status == "" {
		http.Error(w, "Status is required", http.StatusBadRequest)
		return
	}

	if err := repositories.UpdateAppointmentStatus(id, payload.Status); err != nil {
		http.Error(w, "Failed to update appointment status", http.StatusInternalServerError)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := utils.PublishAppointmentEvent(ctx, "appointments.status_updated", map[string]interface{}{
		"id":     id,
		"status": payload.Status,
	}); err != nil {
		log.Printf("Failed to publish appointments.status_updated: %v", err)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Appointment status updated successfully",
	})
}

// GetAllAppointmentsHandler
func GetAllAppointmentsHandler(w http.ResponseWriter, r *http.Request) {
	appointments, err := repositories.GetAllAppointments()
	if err != nil {
		http.Error(w, "Failed to retrieve appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

// GetAppointmentsByPatientIDHandler
func GetAppointmentsByPatientIDHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["patient_id"]
	patientID, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	appointments, err := repositories.GetAppointmentsByPatientID(patientID)
	if err != nil {
		http.Error(w, "Failed to retrieve appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

// GetAppointmentsByDoctorIDHandler :

func GetAppointmentsByDoctorIDHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["doctor_id"]
	doctorID, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	appointments, err := repositories.GetAppointmentsByDoctorID(doctorID)
	if err != nil {
		http.Error(w, "Failed to retrieve doctor appointments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

// GetAppointmentsByStatusHandler :

func GetAppointmentsByStatusHandler(w http.ResponseWriter, r *http.Request) {
	status := mux.Vars(r)["status"]
	
	// Validate status
	validStatuses := map[string]bool{
		"scheduled": true,
		"completed": true,
		"cancelled": true,
		"no-show":   true,
	}
	
	if !validStatuses[status] {
		http.Error(w, "Invalid status. Valid statuses are: scheduled, completed, cancelled, no-show", http.StatusBadRequest)
		return
	}

	appointments, err := repositories.GetAppointmentsByStatus(status)
	if err != nil {
		http.Error(w, "Failed to retrieve appointments by status", http.StatusInternalServerError)
		return
	}
 
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

// DeleteAppointmentHandler
func DeleteAppointmentHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid appointment ID", http.StatusBadRequest)
		return
	}

	if err := repositories.DeleteAppointment(id); err != nil {
		http.Error(w, "Failed to delete appointment", http.StatusInternalServerError)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := utils.PublishAppointmentEvent(ctx, "appointments.deleted", map[string]int{"id": id}); err != nil {
		log.Printf("Failed to publish appointments.deleted: %v", err)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Appointment deleted successfully"})
}
