package repositories

import (
	"database/sql"
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateFile inserts a new file record
func CreateFile(file models.File) error {
	query := `
		INSERT INTO files (patient_id, file_name, file_type, file_path, uploaded_at, description)
		VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
	`
	_, err := config.DB.Exec(query,
		file.PatientID,
		file.FileType,
		file.FileURL,
		
	)
	if err != nil {
		log.Println("Error creating file:", err)
		return err
	}
	log.Println("File created successfully.")
	return nil
}

// GetFileByID fetches a file by its ID
func GetFileByID(id int) (models.File, error) {
	var file models.File
	query := `
		SELECT id, patient_id, file_name, file_type, file_path, uploaded_at, description
		FROM files WHERE id = $1
	`
	err := config.DB.QueryRow(query, id).Scan(
			&file.ID,
			&file.PatientID,
			&file.DoctorID,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No file found with that ID.")
			return file, nil
		}
		log.Println("Error retrieving file:", err)
		return file, err
	}
	return file, nil
}

// GetAllFiles fetches all files
func GetAllFiles() ([]models.File, error) {
	query := `
		SELECT id, patient_id, file_name, file_type, file_path, uploaded_at, description
		FROM files ORDER BY uploaded_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching files:", err)
		return nil, err
	}
	defer rows.Close()

	var files []models.File
	for rows.Next() {
		var file models.File
		err := rows.Scan(
			&file.ID,
			&file.PatientID,
			&file.DoctorID,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
		)
		if err != nil {
			log.Println("Error scanning file:", err)
			continue
		}
		files = append(files, file)
	}
	return files, nil
}

// GetFilesByPatientID fetches all files for a specific patient
func GetFilesByPatientID(patientID int) ([]models.File, error) {
	query := `
		SELECT id, patient_id, file_name, file_type, file_path, uploaded_at, description
		FROM files WHERE patient_id = $1 ORDER BY uploaded_at DESC
	`
	rows, err := config.DB.Query(query, patientID)
	if err != nil {
		log.Println("Error fetching patient files:", err)
		return nil, err
	}
	defer rows.Close()

	var files []models.File
	for rows.Next() {
		var file models.File
		err := rows.Scan(
			&file.ID,
			&file.PatientID,
			&file.DoctorID,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
			
		)
		if err != nil {
			log.Println("Error scanning file:", err)
			continue
		}
		files = append(files, file)
	}
	return files, nil
}

// DeleteFile removes a file by ID
func DeleteFile(id int) error {
	query := `DELETE FROM files WHERE id = $1`
	_, err := config.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting file:", err)
		return err
	}
	log.Println("File deleted successfully.")
	return nil
}
