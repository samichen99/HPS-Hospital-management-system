package models

import "time"

type File struct {
	ID         int       `json:"id"`
	PatientID  int       `json:"patient_id"`
	DoctorID   int       `json:"doctor_id"`
	FileName  string   	 `json:"file_name"`
	FileType   string    `json:"file_type"`
	FileURL    string    `json:"file_url"`
	UploadDate time.Time `json:"upload_date"`
	Description string   `json:"description"`
}
