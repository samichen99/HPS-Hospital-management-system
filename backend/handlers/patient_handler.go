package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)



// CreatePatient handler :
func CreatePatientHandler(w http.ResponseWriter, r *http.Request) {
	var patient models.Patient

	if err := json.NewDecoder(r.Body).Decode(&patient); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := repositories.CreatePatient(&patient); err != nil {
		http.Error(w, "Failed to create patient", http.StatusInternalServerError)
		return
	}


	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(patient)
}

// GetPatientByID handler :
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

// UpdatePatient handler :
func UpdatePatientHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	var patient models.Patient
	if err := json.NewDecoder(r.Body).Decode(&patient); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	patient.ID = id

	if err := repositories.UpdatePatient(&patient); err != nil {
		http.Error(w, "Failed to update patient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Patient updated successfully"})
}

// GetAllPatients handler :
func GetAllPatientsHandler(w http.ResponseWriter, r *http.Request) {
	patients, err := repositories.GetAllPatients()
	if err != nil {
		http.Error(w, "Failed to fetch patients", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patients)
}

// DeletePatient handler :
func DeletePatientHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	if err := repositories.DeletePatient(id); err != nil {
		http.Error(w, "Failed to delete patient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Patient deleted successfully"})
}

// Search patients by name :
func SearchPatientsHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		http.Error(w, "Missing name query parameter", http.StatusBadRequest)
		return
	}

	patients, err := repositories.SearchPatientsByName(name)
	if err != nil {
		http.Error(w, "Error searching patients", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patients)
}
