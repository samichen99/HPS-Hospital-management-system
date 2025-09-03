package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// GetMedicalRecordsByPatientHandler retrieves medical records for a specific patient
func GetMedicalRecordsByPatientHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	patientID, err := strconv.Atoi(params["patient_id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}
	records, err := repositories.GetMedicalRecordsByPatientID(patientID)
	if err != nil {
		http.Error(w, "Failed to fetch medical records: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}

// GetMedicalRecordsByDoctorHandler retrieves medical records for a specific doctor
func GetMedicalRecordsByDoctorHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	doctorID, err := strconv.Atoi(params["doctor_id"])
	if err != nil {
		http.Error(w, "Invalid doctor ID", http.StatusBadRequest)
		return
	}
	records, err := repositories.GetMedicalRecordsByDoctorID(doctorID)
	if err != nil {
		http.Error(w, "Failed to fetch medical records: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}

// CreateMedicalRecordHandler handles creating a new medical record
func CreateMedicalRecordHandler(w http.ResponseWriter, r *http.Request) {
	var record models.MedicalRecord
	err := json.NewDecoder(r.Body).Decode(&record)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := repositories.CreateMedicalRecord(record); err != nil {
		http.Error(w, "Failed to create medical record: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)
}

// GetMedicalRecordByIDHandler retrieves a medical record by its ID
func GetMedicalRecordByIDHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	record, err := repositories.GetMedicalRecordByID(id)
	if err != nil {
		http.Error(w, "Medical record not found: "+err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)
}

// GetAllMedicalRecordsHandler retrieves all medical records
func GetAllMedicalRecordsHandler(w http.ResponseWriter, r *http.Request) {
	records, err := repositories.GetAllMedicalRecords()
	if err != nil {
		http.Error(w, "Failed to fetch medical records: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}

// UpdateMedicalRecordHandler updates an existing medical record
func UpdateMedicalRecordHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var record models.MedicalRecord
	err = json.NewDecoder(r.Body).Decode(&record)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	record.ID = id
	if err := repositories.UpdateMedicalRecord(record); err != nil {
		http.Error(w, "Failed to update medical record: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)
}

// DeleteMedicalRecordHandler deletes a medical record by its ID
func DeleteMedicalRecordHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = repositories.DeleteMedicalRecord(id)
	if err != nil {
		http.Error(w, "Failed to delete medical record: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
