package repositories

import (
	"database/sql"
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreatePatient repo
func CreatePatient(patient models.Patient) error {
	query := `
		INSERT INTO patients (user_id, full_name, date_of_birth, gender, phone, address, insurance_number)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := config.DB.Exec(query,
		patient.UserID,
		patient.FullName,
		patient.DateOfBirth,
		patient.Gender,
		patient.Phone,
		patient.Address,
		patient.InsuranceNumber,
	)

	if err != nil {
		log.Println("Error inserting patient:", err)
		return err
	}

	log.Println("Patient inserted successfully.")
	return nil
}

// GetPatientByID repo
func GetPatientByID(id int) (models.Patient, error) {
	var patient models.Patient

	query := `
		SELECT id, user_id, full_name, date_of_birth, gender, phone, address, insurance_number
		FROM patients
		WHERE id = $1
	`
	err := config.DB.QueryRow(query, id).Scan(
		&patient.ID,
		&patient.UserID,
		&patient.FullName,
		&patient.DateOfBirth,
		&patient.Gender,
		&patient.Phone,
		&patient.Address,
		&patient.InsuranceNumber,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No patient found with that ID.")
			return patient, nil
		}
		log.Println("Error retrieving patient:", err)
		return patient, err
	}

	return patient, nil
}

// UpdatePatient repo
func UpdatePatient(patient models.Patient) error {
	query := `
		UPDATE patients
		SET full_name = $1, date_of_birth = $2, gender = $3, phone = $4, address = $5, insurance_number = $6
		WHERE id = $7
	`
	_, err := config.DB.Exec(query,
		patient.FullName,
		patient.DateOfBirth,
		patient.Gender,
		patient.Phone,
		patient.Address,
		patient.InsuranceNumber,
		patient.ID,
	)

	if err != nil {
		log.Println("Error updating patient:", err)
		return err
	}

	log.Println("Patient updated successfully.")
	return nil
}

// GetAllPatients repo
func GetAllPatients() ([]models.Patient, error) {
	query := `
		SELECT id, user_id, full_name, date_of_birth, gender, phone, address, insurance_number
		FROM patients
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching patients:", err)
		return nil, err
	}
	defer rows.Close()

	var patients []models.Patient

	for rows.Next() {
		var patient models.Patient
		err := rows.Scan(
			&patient.ID,
			&patient.UserID,
			&patient.FullName,
			&patient.DateOfBirth,
			&patient.Gender,
			&patient.Phone,
			&patient.Address,
			&patient.InsuranceNumber,
		)

		if err != nil {
			log.Println("Error scanning patient:", err)
			continue
		}

		patients = append(patients, patient)
	}

	return patients, nil
}

// DeletePatient repo
func DeletePatient(id int) error {
	query := `DELETE FROM patients WHERE id = $1`
	_, err := config.DB.Exec(query, id)

	if err != nil {
		log.Println("Error deleting patient:", err)
		return err
	}

	log.Println("Patient deleted successfully.")
	return nil
}
