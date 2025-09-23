package handlers

import (
	
	"encoding/json"
	"net/http"
	"strconv"
	"time"
	"fmt"
	"os"
	"io"

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
	if err := repositories.CreateFile(&file); err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(file)
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

// file upload handler

func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	

	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}
	defer file.Close()

	//create uploads directory

	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		os.Mkdir("./uploads", os.ModePerm)
	}

	//save file to uploads directory

	filePath := fmt.Sprintf("./uploads/%s", handler.Filename)
	dst, err := os.Create(filePath)

	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	defer dst.Close()
	io.Copy(dst, file)

	var patient models.Patient
	var doctor models.Doctor

	patient.ID, _ = strconv.Atoi(r.FormValue("patient_id"))
	doctor.ID, _ = strconv.Atoi(r.FormValue("doctor_id"))
	description := r.FormValue("description")

	//save file record to db

	newFile := models.File{
		PatientID: patient.ID,
		DoctorID:  doctor.ID,
		FileName: handler.Filename,
		FileType: handler.Header.Get("Content-Type"),
		FileURL: filePath,
		UploadDate: time.Now(),
		Description: description,
	}

	if err := repositories.CreateFile(newFile); err != nil {
		http.Error(w, "Error saving file record", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "File uploaded successfully"})
}

//file download handler

func DownloadFileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _:= strconv.Atoi(vars["id"])
	file, err := repositories.GetFileByID(id)
	if err != nil {
		http.Error(w, "Error fetching file", http.StatusInternalServerError)
		return
	}
	http.ServeFile(w, r, file.FileURL)
}