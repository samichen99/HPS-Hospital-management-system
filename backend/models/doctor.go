package models

type Doctor struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	FullName   string `json:"full_name"`
	Speciality string `json:"speciality"`
	Phone      string `json:"phone"`
	Status     bool   `json:"status"`
}
