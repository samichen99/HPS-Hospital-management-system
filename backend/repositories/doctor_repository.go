package repositories

import (
	"database/sql"
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateDoctor repo
func CreateDoctor(doctor models.Doctor) error {
	query := `
		INSERT INTO doctors (user_id, full_name, speciality, phone, status)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := config.DB.Exec(query, doctor.UserID, doctor.FullName, doctor.Speciality, doctor.Phone, doctor.Status)
	if err != nil {
		log.Println("Error creating doctor:", err)
		return err
	}
	log.Println("Doctor created successfully.")
	return nil
}

// GetDoctorByID repo
func GetDoctorByID(id int) (models.Doctor, error) {
	var doctor models.Doctor

	query := `
		SELECT id, user_id, full_name, speciality, phone, status
		FROM doctors
		WHERE id = $1
	`

	err := config.DB.QueryRow(query, id).Scan(
		&doctor.ID,
		&doctor.UserID,
		&doctor.FullName,
		&doctor.Speciality,
		&doctor.Phone,
		&doctor.Status,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No doctor found with that ID.")
			return doctor, nil
		}
		log.Println("Error fetching doctor:", err)
		return doctor, err
	}

	return doctor, nil
}

// UpdateDoctor repo
func UpdateDoctor(doctor models.Doctor) error {
	query := `
		UPDATE doctors
		SET full_name = $1, speciality = $2, phone = $3, status = $4
		WHERE id = $5
	`

	_, err := config.DB.Exec(query, doctor.FullName, doctor.Speciality, doctor.Phone, doctor.Status, doctor.ID)
	if err != nil {
		log.Println("Error updating doctor:", err)
		return err
	}

	log.Println("Doctor updated successfully.")
	return nil
}

// GetAllDoctors repo
func GetAllDoctors() ([]models.Doctor, error) {
	query := `
		SELECT id, user_id, full_name, speciality, phone, status
		FROM doctors
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching doctors:", err)
		return nil, err
	}
	defer rows.Close()

	var doctors []models.Doctor

	for rows.Next() {
		var doctor models.Doctor
		err := rows.Scan(
			&doctor.ID,
			&doctor.UserID,
			&doctor.FullName,
			&doctor.Speciality,
			&doctor.Phone,
			&doctor.Status,
		)
		if err != nil {
			log.Println("Error scanning doctor:", err)
			continue
		}
		doctors = append(doctors, doctor)
	}

	return doctors, nil
}

// DeleteDoctor repo
func DeleteDoctor(id int) error {
	query := `DELETE FROM doctors WHERE id = $1`

	_, err := config.DB.Exec(query, id) // FIXED: removed the * that was causing syntax error
	if err != nil {
		log.Println("Error deleting doctor:", err)
		return err
	}

	log.Println("Doctor deleted successfully.")
	return nil
}


// search doctors by name or speciality

func SearchDoctors(queryStr string) ([]models.Doctor, error) {
	query := `
		SELECT id, user_id, full_name, speciality, phone, status
		FROM doctors
		WHERE full_name ILIKE '%' || $1 || '%' OR speciality ILIKE '%' || $1 || '%'
	`
	rows, err := config.DB.Query(query, queryStr)
	if err != nil {
		log.Println("Error searching doctors:", err)
		return nil, err
	}

	defer rows.Close()

	var doctors []models.Doctor
	for rows.Next() {
		var doctor models.Doctor
		err := rows.Scan(
			&doctor.ID,
			&doctor.UserID,
			&doctor.FullName,
			&doctor.Speciality,
			&doctor.Phone,
			&doctor.Status,
		)
		if err != nil {
			log.Println("Error scanning doctor:", err)
			continue
		}
		doctors = append(doctors, doctor)
	}
	return doctors, nil
}