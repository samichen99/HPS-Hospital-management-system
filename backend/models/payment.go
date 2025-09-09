package models

import "time"

type Payment struct {

	ID 					int         `json:"id"`
	InvoiceId			int 		`json:"invoice_id"`
	Amount 				float64 	`json:"amount"`
	Payment_Date 		time.Time 	`json:"date"`
	Payment_method 		string 		`json:"method"`
	Notes 				string 		`json:"notes"`
	
}