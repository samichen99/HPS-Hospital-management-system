package repositories

import (
	"database/sql"
	"log"
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

func CreateAppointment(appointment models.Appointment) error {
	query := `
		INSERT INTO appointments (patient_id, doctor_id, date_time, status, reason, notes, duration)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := config.DB.Exec(query, 
		appointment.PatientID, 
		appointment.DoctorID, 
		appointment.DateTime, 
		appointment.Status, 
		appointment.Reason, 
		appointment.Notes, 
		appointment.Duration,
	)
	if err != nil {
		log.Println("Error creating appointment:", err)
		return err
	}
	log.Println("Appointment created successfully.")
	return nil
}

func GetAppointmentByID(id int) (models.Appointment, error) {
	var appointment models.Appointment
	query := `
		SELECT id, patient_id, doctor_id, date_time, status, reason, notes, duration, created_at, updated_at
		FROM appointments
		WHERE id = $1
	`
	err := config.DB.QueryRow(query, id).Scan(
		&appointment.ID,
		&appointment.PatientID,
		&appointment.DoctorID,
		&appointment.DateTime,
		&appointment.Status,
		&appointment.Reason,
		&appointment.Notes,
		&appointment.Duration,
		&appointment.CreatedAt,
		&appointment.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No appointment found with that ID.")
			return appointment, nil
		}
		log.Println("Error retrieving appointment:", err)
		return appointment, err
	}
	return appointment, nil
}

func UpdateAppointment(appointment models.Appointment) error {
	query := `
		UPDATE appointments
		SET patient_id = $1, doctor_id = $2, date_time = $3, status = $4, reason = $5, notes = $6, duration = $7, updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
	`
	_, err := config.DB.Exec(query,
		appointment.PatientID,
		appointment.DoctorID,
		appointment.DateTime,
		appointment.Status,
		appointment.Reason,
		appointment.Notes,
		appointment.Duration,
		appointment.ID,
	)
	if err != nil {
		log.Println("Error updating appointment:", err)
		return err
	}
	log.Println("Appointment updated successfully.")
	return nil
}

func GetAllAppointments() ([]models.Appointment, error) {
	query := `
		SELECT id, patient_id, doctor_id, date_time, status, reason, notes, duration, created_at, updated_at
		FROM appointments
		ORDER BY date_time DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching appointments:", err)
		return nil, err
	}
	defer rows.Close()

	var appointments []models.Appointment
	for rows.Next() {
		var appointment models.Appointment
		err := rows.Scan(
			&appointment.ID,
			&appointment.PatientID,
			&appointment.DoctorID,
			&appointment.DateTime,
			&appointment.Status,
			&appointment.Reason,
			&appointment.Notes,
			&appointment.Duration,
			&appointment.CreatedAt,
			&appointment.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning appointment:", err)
			continue
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}

func GetAppointmentsByPatientID(patientID int) ([]models.Appointment, error) {
	query := `
		SELECT id, patient_id, doctor_id, date_time, status, reason, notes, duration, created_at, updated_at
		FROM appointments
		WHERE patient_id = $1
		ORDER BY date_time DESC
	`
	rows, err := config.DB.Query(query, patientID)
	if err != nil {
		log.Println("Error fetching patient appointments:", err)
		return nil, err
	}
	defer rows.Close()

	var appointments []models.Appointment
	for rows.Next() {
		var appointment models.Appointment
		err := rows.Scan(
			&appointment.ID,
			&appointment.PatientID,
			&appointment.DoctorID,
			&appointment.DateTime,
			&appointment.Status,
			&appointment.Reason,
			&appointment.Notes,
			&appointment.Duration,
			&appointment.CreatedAt,
			&appointment.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning appointment:", err)
			continue
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}

func GetAppointmentsByDoctorID(doctorID int) ([]models.Appointment, error) {
	query := `
		SELECT id, patient_id, doctor_id, date_time, status, reason, notes, duration, created_at, updated_at
		FROM appointments
		WHERE doctor_id = $1
		ORDER BY date_time DESC
	`
	rows, err := config.DB.Query(query, doctorID)
	if err != nil {
		log.Println("Error fetching doctor appointments:", err)
		return nil, err
	}
	defer rows.Close()

	var appointments []models.Appointment
	for rows.Next() {
		var appointment models.Appointment
		err := rows.Scan(
			&appointment.ID,
			&appointment.PatientID,
			&appointment.DoctorID,
			&appointment.DateTime,
			&appointment.Status,
			&appointment.Reason,
			&appointment.Notes,
			&appointment.Duration,
			&appointment.CreatedAt,
			&appointment.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning appointment:", err)
			continue
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}

func GetAppointmentsByStatus(status string) ([]models.Appointment, error) {
	query := `
		SELECT id, patient_id, doctor_id, date_time, status, reason, notes, duration, created_at, updated_at
		FROM appointments
		WHERE status = $1
		ORDER BY date_time ASC
	`
	rows, err := config.DB.Query(query, status)
	if err != nil {
		log.Println("Error fetching appointments by status:", err)
		return nil, err
	}
	defer rows.Close()

	var appointments []models.Appointment
	for rows.Next() {
		var appointment models.Appointment
		err := rows.Scan(
			&appointment.ID,
			&appointment.PatientID,
			&appointment.DoctorID,
			&appointment.DateTime,
			&appointment.Status,
			&appointment.Reason,
			&appointment.Notes,
			&appointment.Duration,
			&appointment.CreatedAt,
			&appointment.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning appointment:", err)
			continue
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}

func DeleteAppointment(id int) error {
	query := `DELETE FROM appointments WHERE id = $1`
	_, err := config.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting appointment:", err)
		return err
	}
	log.Println("Appointment deleted successfully.")
	return nil
}