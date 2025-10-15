package models

import "time"

type Appointment struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    PatientID uint      `json:"patient_id"`
    DoctorID  uint      `json:"doctor_id"`
    DateTime  time.Time `json:"date_time"`
    Status    string    `json:"status"`
    Reason    string    `json:"reason"`
    Notes     string    `json:"notes"`
    Duration  int       `json:"duration"`
    CreatedAt time.Time
    UpdatedAt time.Time
}
