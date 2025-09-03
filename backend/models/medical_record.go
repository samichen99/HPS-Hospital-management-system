package models

import "time"

type MedicalRecord struct {
	ID           int       `json:"id"`
	PatientID    int       `json:"patient_id"`
	DoctorID     int       `json:"doctor_id"`
	Diagnosis    string    `json:"diagnosis"`
	Prescription string    `json:"prescription"`
	CreationDate time.Time `json:"creation_date"`
}
