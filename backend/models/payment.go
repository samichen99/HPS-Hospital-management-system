package models

import "time"

type Payment struct {

	ID 					int         `json:"id"`
	InvoiceId			int 		`json:"invoice_id"`
	Amount 				float64 	`json:"amount"`
	PaymentDate 		time.Time 	`json:"date"`
	PaymentMethod 		string 		`json:"method"`
	Notes 				string 		`json:"notes"`
	
}