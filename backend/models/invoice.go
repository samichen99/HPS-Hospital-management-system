package models

import "time"

type Invoice struct {
	ID            int        `json:"id"`
	PatientID     int        `json:"patient_id"`
	AppointmentID *int       `json:"appointment_id,omitempty"`
	Amount        float64    `json:"amount"`
	Status        string     `json:"status"`
	DueDate       time.Time  `json:"due_date"`
	IssuedAt      time.Time  `json:"issued_at"`
	PaidAt        *time.Time `json:"paid_at,omitempty"`
	Notes         string     `json:"notes"`
}
