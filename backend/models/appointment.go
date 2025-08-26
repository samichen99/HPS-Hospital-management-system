package models

import "time"

type Appointment struct {
	ID          int       `json:"id"`
	PatientID   int       `json:"patient_id"`
	DoctorID    int       `json:"doctor_id"`
	DateTime    time.Time `json:"date_time"`
	Status      string    `json:"status"`
	Reason      string    `json:"reason"`
	Notes       string    `json:"notes"`
	Duration    int       `json:"duration"` 
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}