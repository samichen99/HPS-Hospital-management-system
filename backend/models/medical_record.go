package models

import "time"

type MedicalRecord struct {
	ID           int       `gorm:"primaryKey" json:"id"`
	PatientID    int       `gorm:"not null;index" json:"patient_id"`
	DoctorID     int       `gorm:"not null;index" json:"doctor_id"`
	Diagnosis    string    `gorm:"not null" json:"diagnosis"`
	Prescription string    `json:"prescription"`
	CreationDate time.Time `gorm:"autoCreateTime;not null" json:"creation_date"`
}
