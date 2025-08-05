package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// CreatePatientHandler handles the creation of a patient
func CreatePatientHandler(w http.ResponseWriter, r *http.Request) {
	var patient models.Patient

	err := json.NewDecoder(r.Body).Decode(&patient)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = repositories.CreatePatient(patient)
	if err != nil {
		http.Error(w, "Failed to create patient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Patient created successfully"))
}

// GetPatientByIDHandler retrieves a patient by ID
func GetPatientByIDHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	patient, err := repositories.GetPatientByID(id)
	if err != nil {
		http.Error(w, "Failed to retrieve patient", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patient)
}

// UpdatePatientHandler updates an existing patient
func UpdatePatientHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	var patient models.Patient
	err = json.NewDecoder(r.Body).Decode(&patient)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	patient.ID = id

	err = repositories.UpdatePatient(patient)
	if err != nil {
		http.Error(w, "Failed to update patient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Patient updated successfully"))
}

// GetAllPatientsHandler retrieves all patients
func GetAllPatientsHandler(w http.ResponseWriter, r *http.Request) {
	patients, err := repositories.GetAllPatients()
	if err != nil {
		http.Error(w, "Failed to fetch patients", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patients)
}

// DeletePatientHandler deletes a patient by ID
func DeletePatientHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	err = repositories.DeletePatient(id)
	if err != nil {
		http.Error(w, "Failed to delete patient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Patient deleted successfully"))
}
