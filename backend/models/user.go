package models

import "time"

type User struct {
	ID           int       `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	Password     string    `gorm:"not null" json:"password"`
	Role         string    `gorm:"not null" json:"role"`
	CreationDate time.Time `gorm:"autoCreateTime" json:"creation_date"`
}
