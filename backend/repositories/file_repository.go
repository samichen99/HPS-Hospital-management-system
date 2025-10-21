package repositories

import (
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateFile inserts a new file record
func CreateFile(file *models.File) error {
	return config.GormDB.Create(file).Error
}

// GetFileByID retrieves a file by ID
func GetFileByID(id int) (models.File, error) {
	var file models.File
	err := config.GormDB.First(&file, id).Error
	return file, err
}

// GetAllFiles retrieves all files
func GetAllFiles() ([]models.File, error) {
	var files []models.File
	err := config.GormDB.Find(&files).Error
	return files, err
}

// GetFilesByPatientID retrieves all files for a specific patient
func GetFilesByPatientID(patientID int) ([]models.File, error) {
	var files []models.File
	err := config.GormDB.Where("patient_id = ?", patientID).Find(&files).Error
	return files, err
}

// UpdateFile updates an existing file
func UpdateFile(file models.File) error {
	return config.GormDB.Save(&file).Error
}

// DeleteFile deletes a file by ID
func DeleteFile(id int) error {
	return config.GormDB.Delete(&models.File{}, id).Error
}
