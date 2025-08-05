package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// CreateDoctorHandler handles creating a new doctor
func CreateDoctorHandler(w http.ResponseWriter, r *http.Request) {
	var doctor models.Doctor

	if err := json.NewDecoder(r.Body).Decode(&doctor); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := repositories.CreateDoctor(doctor); err != nil {
		http.Error(w, "Failed to create doctor", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Doctor created successfully"))
}

// GetDoctorByIDHandler retrieves a doctor by ID
func GetDoctorByIDHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	doctor, err := repositories.GetDoctorByID(id)
	if err != nil {
		http.Error(w, "Doctor not found", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doctor)
}

// UpdateDoctorHandler updates an existing doctor
func UpdateDoctorHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	var doctor models.Doctor
	if err := json.NewDecoder(r.Body).Decode(&doctor); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	doctor.ID = id

	if err := repositories.UpdateDoctor(doctor); err != nil {
		http.Error(w, "Failed to update doctor", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Doctor updated successfully"))
}

// GetAllDoctorsHandler returns all doctors
func GetAllDoctorsHandler(w http.ResponseWriter, r *http.Request) {
	doctors, err := repositories.GetAllDoctors()
	if err != nil {
		http.Error(w, "Failed to retrieve doctors", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doctors)
}

// DeleteDoctorHandler deletes a doctor
func DeleteDoctorHandler(w http.ResponseWriter, r *http.Request) {
	idParam := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}

	if err := repositories.DeleteDoctor(id); err != nil {
		http.Error(w, "Failed to delete doctor", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Doctor deleted successfully"))
}
