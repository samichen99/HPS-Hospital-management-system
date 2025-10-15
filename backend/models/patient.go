package models

type Patient struct {
	ID              int    `gorm:"primaryKey" json:"id"`
	UserID          int    `gorm:"user_id" json:"user_id"`
	FullName        string `json:"full_name"`
	DateOfBirth     string `json:"date_of_birth"`
	Gender          string `json:"gender"`
	Phone           string `json:"phone"`
	Address         string `json:"address"`
	InsuranceNumber string `json:"insurance_number"`
}
