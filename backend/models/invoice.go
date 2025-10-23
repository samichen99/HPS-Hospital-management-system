package models

import "time"

type Invoice struct {
	ID            int        `gorm:"primaryKey" json:"id"`
	PatientID     int        `gorm:"not null;index" json:"patient_id"`
	AppointmentID *int       `gorm:"index" json:"appointment_id,omitempty"`
	Amount        float64    `gorm:"not null" json:"amount"`
	Status        string     `gorm:"not null" json:"status"`
	DueDate       time.Time  `gorm:"not null" json:"due_date"`
	IssuedAt      time.Time  `gorm:"not null" json:"issued_at"`
	PaidAt        *time.Time `gorm:"default:null" json:"paid_at,omitempty"`
	Notes         string     `json:"notes"`
}
