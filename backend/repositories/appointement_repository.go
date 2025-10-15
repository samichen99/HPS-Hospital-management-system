package repositories

import (
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// inserts a new appointment
func CreateAppointment(appointment *models.Appointment) error {
	if err := config.GormDB.Create(appointment).Error; err != nil {
		log.Printf("[CreateAppointment] GORM Error: %v", err)
		log.Printf("[CreateAppointment] Input: %+v", appointment)
		return err
	}
	log.Println("Appointment created successfully. ID:", appointment.ID)
	return nil
}

// retrieves an appointment by id
func GetAppointmentByID(id int) (models.Appointment, error) {
	var appointment models.Appointment
	if err := config.GormDB.First(&appointment, id).Error; err != nil {
		log.Printf("Error retrieving appointment with ID %d: %v", id, err)
		return appointment, err
	}
	return appointment, nil
}

// updates an existing appointment
func UpdateAppointment(appointment *models.Appointment) error {
	if err := config.GormDB.Save(appointment).Error; err != nil {
		log.Printf("Error updating appointment ID %d: %v", appointment.ID, err)
		return err
	}
	log.Println("Appointment updated successfully. ID:", appointment.ID)
	return nil
}

// returns all appointments ordered by date_time DESC
func GetAllAppointments() ([]models.Appointment, error) {
	var appointments []models.Appointment
	if err := config.GormDB.Order("date_time DESC").Find(&appointments).Error; err != nil {
		log.Println("Error fetching appointments:", err)
		return nil, err
	}
	return appointments, nil
}

// returns all appointments for a patient
func GetAppointmentsByPatientID(patientID int) ([]models.Appointment, error) {
	var appointments []models.Appointment
	if err := config.GormDB.Where("patient_id = ?", patientID).
		Order("date_time DESC").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments for patient %d: %v", patientID, err)
		return nil, err
	}
	return appointments, nil
}

// returns all appointments for a doctor
func GetAppointmentsByDoctorID(doctorID int) ([]models.Appointment, error) {
	var appointments []models.Appointment
	if err := config.GormDB.Where("doctor_id = ?", doctorID).
		Order("date_time DESC").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments for doctor %d: %v", doctorID, err)
		return nil, err
	}
	return appointments, nil
}

// returns appointments filtered by status
func GetAppointmentsByStatus(status string) ([]models.Appointment, error) {
	var appointments []models.Appointment
	if err := config.GormDB.Where("status = ?", status).
		Order("date_time ASC").
		Find(&appointments).Error; err != nil {
		log.Printf("Error fetching appointments with status '%s': %v", status, err)
		return nil, err
	}
	return appointments, nil
}

// deletes an appointment by ID
func DeleteAppointment(id int) error {
	if err := config.GormDB.Delete(&models.Appointment{}, id).Error; err != nil {
		log.Printf("Error deleting appointment ID %d: %v", id, err)
		return err
	}
	log.Println("Appointment deleted successfully. ID:", id)
	return nil
}

// updates only the status of an appointment
func UpdateAppointmentStatus(id int, status string) error {
	if err := config.GormDB.Model(&models.Appointment{}).
		Where("id = ?", id).
		Update("status", status).Error; err != nil {
		log.Printf("Error updating appointment status ID %d: %v", id, err)
		return err
	}
	log.Println("Appointment status updated successfully. ID:", id)
	return nil
}
