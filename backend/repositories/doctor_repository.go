package repositories

import (
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateDoctor repo
func CreateDoctor(doctor models.Doctor) error {
	if err := config.GormDB.Create(&doctor).Error; err != nil {
		log.Println("Error creating doctor:", err)
		return err
	}
	log.Println("Doctor created successfully.")
	return nil
}

// GetDoctorByID repo
func GetDoctorByID(id int) (models.Doctor, error) {
	var doctor models.Doctor
	if err := config.GormDB.First(&doctor, id).Error; err != nil {
		log.Println("Error fetching doctor:", err)
		return doctor, err
	}
	return doctor, nil
}

// UpdateDoctor repo
func UpdateDoctor(doctor models.Doctor) error {
	if err := config.GormDB.Save(&doctor).Error; err != nil {
		log.Println("Error updating doctor:", err)
		return err
	}
	log.Println("Doctor updated successfully.")
	return nil
}

// GetAllDoctors repo
func GetAllDoctors() ([]models.Doctor, error) {
	var doctors []models.Doctor
	if err := config.GormDB.Find(&doctors).Error; err != nil {
		log.Println("Error fetching doctors:", err)
		return nil, err
	}
	return doctors, nil
}

// DeleteDoctor repo
func DeleteDoctor(id int) error {
	if err := config.GormDB.Delete(&models.Doctor{}, id).Error; err != nil {
		log.Println("Error deleting doctor:", err)
		return err
	}
	log.Println("Doctor deleted successfully.")
	return nil
}

// Search doctors by name or speciality
func SearchDoctors(queryStr string) ([]models.Doctor, error) {
	var doctors []models.Doctor
	if err := config.GormDB.Where("full_name ILIKE ? OR speciality ILIKE ?", "%"+queryStr+"%", "%"+queryStr+"%").Find(&doctors).Error; err != nil {
		log.Println("Error searching doctors:", err)
		return nil, err
	}
	return doctors, nil
}
