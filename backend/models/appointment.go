package models

import "time"

type Appointment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	PatientID uint      `gorm:"not null;index" json:"patient_id"`
	DoctorID  uint      `gorm:"not null;index" json:"doctor_id"`
	DateTime  time.Time `gorm:"not null" json:"date_time"`
	Status    string    `gorm:"not null" json:"status"`
	Reason    string    `json:"reason"`
	Notes     string    `json:"notes"`
	Duration  int       `gorm:"not null" json:"duration"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
