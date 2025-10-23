package models

import "time"

type Payment struct {
	ID            int       `gorm:"primaryKey" json:"id"`
	InvoiceId     int       `gorm:"not null;index" json:"invoice_id"`
	Amount        float64   `gorm:"not null" json:"amount"`
	PaymentDate   time.Time `gorm:"not null" json:"date"`
	PaymentMethod string    `gorm:"not null" json:"method"`
	Notes         string    `json:"notes"`
}
