package models

type Patient struct {
	ID              int    `gorm:"primaryKey" json:"id"`
	UserID          int    `gorm:"uniqueIndex;not null" json:"user_id"`
	FullName        string `gorm:"not null" json:"full_name"`
	DateOfBirth     string `gorm:"not null" json:"date_of_birth"`
	Gender          string `gorm:"not null" json:"gender"`
	Phone           string `gorm:"not null" json:"phone"`
	Address         string `gorm:"not null" json:"address"`
	InsuranceNumber string `json:"insurance_number"`
}
