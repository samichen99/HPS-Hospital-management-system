package repositories

import (
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// Get medical records by patient ID
func GetMedicalRecordsByPatientID(patientID int) ([]models.MedicalRecord, error) {
	rows, err := config.DB.Query(`SELECT id, patient_id, doctor_id, diagnosis, prescription, creation_date FROM medical_records WHERE patient_id=$1`, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []models.MedicalRecord
	for rows.Next() {
		var record models.MedicalRecord
		err := rows.Scan(&record.ID, &record.PatientID, &record.DoctorID, &record.Diagnosis, &record.Prescription, &record.CreationDate)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	return records, nil
}

// Get medical records by doctor ID
func GetMedicalRecordsByDoctorID(doctorID int) ([]models.MedicalRecord, error) {
	rows, err := config.DB.Query(`SELECT id, patient_id, doctor_id, diagnosis, prescription, creation_date FROM medical_records WHERE doctor_id=$1`, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []models.MedicalRecord
	for rows.Next() {
		var record models.MedicalRecord
		err := rows.Scan(&record.ID, &record.PatientID, &record.DoctorID, &record.Diagnosis, &record.Prescription, &record.CreationDate)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	return records, nil
}

// Create a new medical record
func CreateMedicalRecord(record models.MedicalRecord) error {
	query := `
        INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription, creation_date)
        VALUES ($1, $2, $3, $4, $5)`
	_, err := config.DB.Exec(query, record.PatientID, record.DoctorID, record.Diagnosis, record.Prescription, record.CreationDate)
	return err
}

// Get medical record by ID
func GetMedicalRecordByID(id int) (models.MedicalRecord, error) {
	var record models.MedicalRecord
	query := `SELECT id, patient_id, doctor_id, diagnosis, prescription, creation_date FROM medical_records WHERE id=$1`
	err := config.DB.QueryRow(query, id).Scan(
		&record.ID, &record.PatientID, &record.DoctorID, &record.Diagnosis, &record.Prescription, &record.CreationDate,
	)
	return record, err
}

// Get all medical records
func GetAllMedicalRecords() ([]models.MedicalRecord, error) {
	rows, err := config.DB.Query(`SELECT id, patient_id, doctor_id, diagnosis, prescription, creation_date FROM medical_records`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []models.MedicalRecord
	for rows.Next() {
		var record models.MedicalRecord
		err := rows.Scan(&record.ID, &record.PatientID, &record.DoctorID, &record.Diagnosis, &record.Prescription, &record.CreationDate)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	return records, nil
}

// Update a medical record
func UpdateMedicalRecord(record models.MedicalRecord) error {
	query := `
        UPDATE medical_records 
        SET patient_id=$1, doctor_id=$2, diagnosis=$3, prescription=$4, creation_date=$5 
        WHERE id=$6`
	_, err := config.DB.Exec(query, record.PatientID, record.DoctorID, record.Diagnosis, record.Prescription, record.CreationDate, record.ID)
	return err
}

// Delete a medical record
func DeleteMedicalRecord(id int) error {
	_, err := config.DB.Exec(`DELETE FROM medical_records WHERE id=$1`, id)
	return err
}
