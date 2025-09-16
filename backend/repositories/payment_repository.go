package repositories

import (
	"database/sql"
	"log"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreatePayment inserts a new payment
func CreatePayment(payment models.Payment) error {
	query := `
		INSERT INTO payments (invoice_id, amount, payment_method, notes, payment_date)
		VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
	`
	_, err := config.DB.Exec(query,
		payment.InvoiceId,
		payment.Amount,
		payment.PaymentMethod,
		payment.Notes,
	)
	if err != nil {
		log.Println("Error creating payment:", err)
		return err
	}
	log.Println("Payment created successfully.")

	if err = UpdateInvoiceStatusAfterPayment(payment.InvoiceId); err != nil {
		log.Println("Error updating invoice after payment:", err)
		return err
	}
	return nil
}

// update invoice status based on payments

func UpdateInvoiceStatusAfterPayment(invoiceID int) error {
	invoiceAmount, paymentSum, err := GetInvoiceTotalAndPayments(invoiceID)
	if err != nil {
		return err
	}
	var status string
	var paidAt *time.Time
	switch {
	case paymentSum >= invoiceAmount:
		status = "paid"
		now := time.Now()
		paidAt = &now
	case paymentSum > 0 && paymentSum < invoiceAmount:
		status = "partiallypaid"
		paidAt = nil
	default:
		status = "unpaid"
		paidAt = nil
	}
	return UpdateInvoiceStatusAndPaidAt(invoiceID, status, paidAt)
}

// GetPaymentByID fetches a payment by ID
func GetPaymentByID(id int) (models.Payment, error) {
	var payment models.Payment
	query := `
		SELECT id, invoice_id, amount, payment_date, payment_method, notes
		FROM payments WHERE id = $1
	`
	err := config.DB.QueryRow(query, id).Scan(
		&payment.ID,
		&payment.InvoiceId,
		&payment.Amount,
		&payment.PaymentDate,
		&payment.PaymentMethod,
		&payment.Notes,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No payment found with that ID.")
			return payment, nil
		}
		log.Println("Error retrieving payment:", err)
		return payment, err
	}
	return payment, nil
}

// GetAllPayments fetches all payments
func GetAllPayments() ([]models.Payment, error) {
	query := `
		SELECT id, invoice_id, amount, payment_date, payment_method, notes
		FROM payments ORDER BY payment_date DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching payments:", err)
		return nil, err
	}
	defer rows.Close()

	var payments []models.Payment
	for rows.Next() {
		var payment models.Payment
		err := rows.Scan(
			&payment.ID,
			&payment.InvoiceId,
			&payment.Amount,
			&payment.PaymentDate,
			&payment.PaymentMethod,
			&payment.Notes,
		)
		if err != nil {
			log.Println("Error scanning payment:", err)
			continue
		}
		payments = append(payments, payment)
	}
	return payments, nil
}

// GetPaymentsByInvoiceID fetches all payments for a specific invoice
func GetPaymentsByInvoiceID(invoiceID int) ([]models.Payment, error) {
	query := `
		SELECT id, invoice_id, amount, payment_date, payment_method, notes
		FROM payments WHERE invoice_id = $1 ORDER BY payment_date DESC
	`
	rows, err := config.DB.Query(query, invoiceID)
	if err != nil {
		log.Println("Error fetching invoice payments:", err)
		return nil, err
	}
	defer rows.Close()

	var payments []models.Payment
	for rows.Next() {
		var payment models.Payment
		err := rows.Scan(
			&payment.ID,
			&payment.InvoiceId,
			&payment.Amount,
			&payment.PaymentDate,
			&payment.PaymentMethod,
			&payment.Notes,
		)
		if err != nil {
			log.Println("Error scanning payment:", err)
			continue
		}
		payments = append(payments, payment)
	}
	return payments, nil
}

	// UpdatePayment updates an existing payment by ID
func UpdatePayment(payment models.Payment) error {
	query := `
		UPDATE payments
		SET amount = $1,
		    payment_method = $2,
		    notes = $3,
		    payment_date = $4
		WHERE id = $5
	`
	_, err := config.DB.Exec(query,
		payment.Amount,
		payment.PaymentMethod,
		payment.Notes,
		payment.PaymentDate,
		payment.ID,
	)
	if err != nil {
		log.Println("Error updating payment:", err)
		return err
	}

	// Recalculate invoice status after updating payment
	if err = UpdateInvoiceStatusAfterPayment(payment.InvoiceId); err != nil {
		log.Println("Error updating invoice after payment update:", err)
		return err
	}

	log.Println("Payment updated successfully.")
	return nil
}

// DeletePayment deletes a payment by ID
func DeletePayment(id int) error {
	query := `DELETE FROM payments WHERE id = $1`
	_, err := config.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting payment:", err)
		return err
	}
	log.Println("Payment deleted successfully.")
	return nil
}
