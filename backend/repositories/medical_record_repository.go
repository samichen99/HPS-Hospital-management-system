package repositories

import (
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateMedicalRecord creates a new medical record
func CreateMedicalRecord(record models.MedicalRecord) error {
	return config.GormDB.Create(&record).Error
}

// GetMedicalRecordByID retrieves a medical record by its ID
func GetMedicalRecordByID(id int) (models.MedicalRecord, error) {
	var record models.MedicalRecord
	err := config.GormDB.First(&record, id).Error
	return record, err
}

// GetAllMedicalRecords retrieves all medical records
func GetAllMedicalRecords() ([]models.MedicalRecord, error) {
	var records []models.MedicalRecord
	err := config.GormDB.Find(&records).Error
	return records, err
}

// GetMedicalRecordsByPatientID retrieves medical records for a specific patient
func GetMedicalRecordsByPatientID(patientID int) ([]models.MedicalRecord, error) {
	var records []models.MedicalRecord
	err := config.GormDB.Where("patient_id = ?", patientID).Find(&records).Error
	return records, err
}

// GetMedicalRecordsByDoctorID retrieves medical records for a specific doctor
func GetMedicalRecordsByDoctorID(doctorID int) ([]models.MedicalRecord, error) {
	var records []models.MedicalRecord
	err := config.GormDB.Where("doctor_id = ?", doctorID).Find(&records).Error
	return records, err
}

// UpdateMedicalRecord updates an existing medical record
func UpdateMedicalRecord(record models.MedicalRecord) error {
	return config.GormDB.Save(&record).Error
}

// DeleteMedicalRecord deletes a medical record by ID
func DeleteMedicalRecord(id int) error {
	return config.GormDB.Delete(&models.MedicalRecord{}, id).Error
}
