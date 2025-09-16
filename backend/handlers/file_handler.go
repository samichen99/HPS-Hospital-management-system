package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// CreateFileHandler
func CreateFileHandler(w http.ResponseWriter, r *http.Request) {
	var file models.File
	if err := json.NewDecoder(r.Body).Decode(&file); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if err := repositories.CreateFile(file); err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "File created successfully"})
}

// GetFileByIDHandler
func GetFileByIDHandler(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid file ID", http.StatusBadRequest)
		return
	}

	file, err := repositories.GetFileByID(id)
	if err != nil {
		http.Error(w, "Error fetching file", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(file)
}

// GetAllFilesHandler
func GetAllFilesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := repositories.GetAllFiles()
	if err != nil {
		http.Error(w, "Error fetching files", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(files)
}

// GetFilesByPatientIDHandler
func GetFilesByPatientIDHandler(w http.ResponseWriter, r *http.Request) {
	patientIDStr := mux.Vars(r)["patient_id"]
	patientID, err := strconv.Atoi(patientIDStr)
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	files, err := repositories.GetFilesByPatientID(patientID)
	if err != nil {
		http.Error(w, "Error fetching patient files", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(files)
}

// DeleteFileHandler
func DeleteFileHandler(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid file ID", http.StatusBadRequest)
		return
	}

	if err := repositories.DeleteFile(id); err != nil {
		http.Error(w, "Failed to delete file", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "File deleted successfully"})
}

// UpdateFileHandler handles updating an existing file
func UpdateFileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid file ID", http.StatusBadRequest)
		return
	}

	var file models.File
	if err := json.NewDecoder(r.Body).Decode(&file); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	file.ID = id // ensure we’re updating the correct file

	if err := repositories.UpdateFile(file); err != nil {
		http.Error(w, "Failed to update file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "File updated successfully"})
}
