package repositories

import (
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreatePatient repo :
func CreatePatient(patient *models.Patient) error {
	if err := config.GormDB.Create(&patient).Error; err != nil {
		log.Println("Error inserting patient:", err)
		return err
	}
	log.Println("Patient inserted successfully. ID:", patient.ID)
	return nil
}

// GetPatientByID repo :
func GetPatientByID(id int) (models.Patient, error) {
	var patient models.Patient
	if err := config.GormDB.First(&patient, id).Error; err != nil {
		log.Println("Error retrieving patient:", err)
		return patient, err
	}
	return patient, nil
}

// UpdatePatient repo :
func UpdatePatient(patient *models.Patient) error {
	if err := config.GormDB.Save(&patient).Error; err != nil {
		log.Println("Error updating patient:", err)
		return err
	}
	log.Println("Patient updated successfully. ID:", patient.ID)
	return nil
}

// GetAllPatients repo :
func GetAllPatients() ([]models.Patient, error) {
	var patients []models.Patient
	if err := config.GormDB.Find(&patients).Error; err != nil {
		log.Println("Error fetching patients:", err)
		return nil, err
	}
	return patients, nil
}

// DeletePatient repo :
func DeletePatient(id int) error {
	if err := config.GormDB.Delete(&models.Patient{}, id).Error; err != nil {
		log.Println("Error deleting patient:", err)
		return err
	}
	log.Println("Patient deleted successfully. ID:", id)
	return nil
}

// SearchPatientsByName repo :
func SearchPatientsByName(name string) ([]models.Patient, error) {
	var patients []models.Patient
	if err := config.GormDB.Where("full_name ILIKE ?", "%"+name+"%").
		Order("full_name").
		Find(&patients).Error; err != nil {
		log.Println("Error searching patients:", err)
		return nil, err
	}
	return patients, nil
}
