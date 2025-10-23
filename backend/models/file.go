package models

import "time"

type File struct {
	ID          int       `gorm:"primaryKey" json:"id"`
	PatientID   int       `gorm:"index;not null" json:"patient_id"`
	DoctorID    int       `gorm:"index;not null" json:"doctor_id"`
	FileName    string    `gorm:"not null" json:"file_name"`
	FileType    string    `gorm:"not null" json:"file_type"`
	FileURL     string    `gorm:"not null" json:"file_url"`
	Description string    `json:"description"`
	UploadDate  time.Time `gorm:"not null" json:"upload_date"`
}
