package repositories

import (
	"database/sql"
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateFile inserts a new file record
func CreateFile(file *models.File) error {
	query := `
		INSERT INTO files (patient_id, file_name, file_type, file_url, description, upload_date)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, uploaded_at
	`

	err := config.DB.QueryRow(
		query,
		file.PatientID,
		file.FileName,
		file.FileType,
		file.FileURL,
		file.Description,
	).Scan(&file.ID, &file.UploadDate)

	if err != nil {
		return err
	}

	return nil
}

// GetFileByID fetches a file by its ID
func GetFileByID(id int) (models.File, error) {
	var file models.File
	query := `
		SELECT id, patient_id, doctor_id, file_name, file_type, file_url, upload_date, description
		FROM files WHERE id = $1
	`
	
	row := config.DB.QueryRow(query, id)
	err:= row.Scan(
			&file.ID,
			&file.PatientID,
			&file.DoctorID,
			&file.FileName,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
			&file.Description,
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
		SELECT id, patient_id, doctor_id, file_name, file_type, file_url, upload_date, description
		FROM files ORDER BY upload_date DESC
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
			&file.FileName,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
			&file.Description,
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
		SELECT id, patient_id, doctor_id, file_name, file_type, file_url, upload_date, description
		FROM files WHERE patient_id = $1 ORDER BY upload_date DESC
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
			&file.FileName,
			&file.FileType,
			&file.FileURL,
			&file.UploadDate,
			&file.Description,
			
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

// UpdateFile updates an existing file
func UpdateFile(file models.File) error {
	query := `
		UPDATE files
		SET patient_id = $1,
		    doctor_id = $2,
		    file_name = $3,
		    file_type = $4,
		    file_url = $5,
		    upload_date = $6,
		    description = $7
		WHERE id = $8
	`
	_, err := config.DB.Exec(query,
		file.PatientID,
		file.DoctorID,
		file.FileName,
		file.FileType,
		file.FileURL,
		file.UploadDate,
		file.Description,
		file.ID,
	)
	if err != nil {
		log.Println("Error updating file:", err)
		return err
	}
	log.Println("File updated successfully.")
	return nil
}