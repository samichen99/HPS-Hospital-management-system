package repositories

import (
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateFile inserts a new file record
func CreateFile(file *models.File) error {
	if err := config.GormDB.Create(file).Error; err != nil {
		log.Println("Error creating file:", err)
		return err
	}
	return nil
}

// GetFileByID retrieves a file by its ID
func GetFileByID(id int) (models.File, error) {
	var file models.File
	if err := config.GormDB.First(&file, id).Error; err != nil {
		log.Println("Error fetching file by ID:", err)
		return file, err
	}
	return file, nil
}

// GetAllFiles retrieves all files
func GetAllFiles() ([]models.File, error) {
	var files []models.File
	if err := config.GormDB.Find(&files).Error; err != nil {
		log.Println("Error fetching all files:", err)
		return nil, err
	}
	return files, nil
}

// GetFilesByPatientID retrieves files belonging to a specific patient
func GetFilesByPatientID(patientID int) ([]models.File, error) {
	var files []models.File
	if err := config.GormDB.Where("patient_id = ?", patientID).Find(&files).Error; err != nil {
		log.Println("Error fetching files by patient ID:", err)
		return nil, err
	}
	return files, nil
}

// UpdateFile updates an existing file record
func UpdateFile(file models.File) error {
	if err := config.GormDB.Save(&file).Error; err != nil {
		log.Println("Error updating file:", err)
		return err
	}
	return nil
}

// DeleteFile deletes a file record by ID
func DeleteFile(id int) error {
	if err := config.GormDB.Delete(&models.File{}, id).Error; err != nil {
		log.Println("Error deleting file:", err)
		return err
	}
	return nil
}
