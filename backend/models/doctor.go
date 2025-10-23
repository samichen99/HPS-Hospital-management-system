package models

type Doctor struct {
	ID         int    `gorm:"primaryKey" json:"id"`
	UserID     int    `gorm:"uniqueIndex;not null" json:"user_id"`
	FullName   string `gorm:"not null" json:"full_name"`
	Speciality string `gorm:"not null" json:"speciality"`
	Phone      string `gorm:"not null" json:"phone"`
	Status     bool   `gorm:"not null;default:true" json:"status"`
}
