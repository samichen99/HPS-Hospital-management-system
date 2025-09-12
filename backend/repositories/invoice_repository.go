package repositories

import (
	"database/sql"
	"log"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// UpdateInvoiceStatusAndPaidAt updates the status and paid_at fields of an invoice
func UpdateInvoiceStatusAndPaidAt(invoiceID int, status string, paidAt *time.Time) error {
	var err error
	if paidAt != nil {
		_, err = config.DB.Exec(`UPDATE invoices SET status = $1, paid_at = $2 WHERE id = $3`, status, *paidAt, invoiceID)
	} else {
		_, err = config.DB.Exec(`UPDATE invoices SET status = $1, paid_at = NULL WHERE id = $2`, status, invoiceID)
	}
	if err != nil {
		log.Println("Error updating invoice status/paid_at:", err)
		return err
	}
	return nil
}

// CreateInvoice inserts a new invoice
func CreateInvoice(inv models.Invoice) (int, error) {
	query := `
		INSERT INTO invoices (
			patient_id, appointment_id, amount, status, due_date, issued_at, paid_at, notes
		) VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_TIMESTAMP), $7, $8)
		RETURNING id
	`
	var id int
	var issuedAt *time.Time
	if !inv.IssuedAt.IsZero() {
		issuedAt = &inv.IssuedAt
	}
	err := config.DB.QueryRow(
		query,
		inv.PatientID,
		sql.NullInt64{Int64: int64(valueOrZero(inv.AppointmentID)), Valid: inv.AppointmentID != nil},
		inv.Amount,
		inv.Status,
		inv.DueDate,
		issuedAt,
		sql.NullTime{Time: valueOrTime(inv.PaidAt), Valid: inv.PaidAt != nil},
		inv.Notes,
	).Scan(&id)
	if err != nil {
		log.Println("Error creating invoice:", err)
		return 0, err
	}
	return id, nil
}

// GetInvoiceByID fetches one invoice
func GetInvoiceByID(id int) (models.Invoice, error) {
	var inv models.Invoice
	var apptID sql.NullInt64
	var paidAt sql.NullTime
	query := `
		SELECT id, patient_id, appointment_id, amount, status, due_date, issued_at, paid_at, notes
		FROM invoices WHERE id = $1
	`
	err := config.DB.QueryRow(query, id).Scan(
		&inv.ID,
		&inv.PatientID,
		&apptID,
		&inv.Amount,
		&inv.Status,
		&inv.DueDate,
		&inv.IssuedAt,
		&paidAt,
		&inv.Notes,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return inv, nil
		}
		return inv, err
	}
	if apptID.Valid {
		v := int(apptID.Int64)
		inv.AppointmentID = &v
	}
	if paidAt.Valid {
		t := paidAt.Time
		inv.PaidAt = &t
	}
	return inv, nil
}

// GetAllInvoices returns all invoices (newest first)
func GetAllInvoices() ([]models.Invoice, error) {
	query := `
		SELECT id, patient_id, appointment_id, amount, status, due_date, issued_at, paid_at, notes
		FROM invoices ORDER BY issued_at DESC, id DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching invoices:", err)
		return nil, err
	}
	defer rows.Close()

	var list []models.Invoice
	for rows.Next() {
		var inv models.Invoice
		var apptID sql.NullInt64
		var paidAt sql.NullTime
		if err := rows.Scan(
			&inv.ID,
			&inv.PatientID,
			&apptID,
			&inv.Amount,
			&inv.Status,
			&inv.DueDate,
			&inv.IssuedAt,
			&paidAt,
			&inv.Notes,
		); err != nil {
			log.Println("Error scanning invoice:", err)
			continue
		}
		if apptID.Valid {
			v := int(apptID.Int64)
			inv.AppointmentID = &v
		}
		if paidAt.Valid {
			t := paidAt.Time
			inv.PaidAt = &t
		}
		list = append(list, inv)
	}
	return list, nil
}

// UpdateInvoice updates an invoice
func UpdateInvoice(inv models.Invoice) error {
	query := `
		UPDATE invoices
		SET patient_id = $1,
		    appointment_id = $2,
		    amount = $3,
		    status = $4,
		    due_date = $5,
		    issued_at = $6,
		    paid_at = $7,
		    notes = $8
		WHERE id = $9
	`
	_, err := config.DB.Exec(
		query,
		inv.PatientID,
		sql.NullInt64{Int64: int64(valueOrZero(inv.AppointmentID)), Valid: inv.AppointmentID != nil},
		inv.Amount,
		inv.Status,
		inv.DueDate,
		inv.IssuedAt,
		sql.NullTime{Time: valueOrTime(inv.PaidAt), Valid: inv.PaidAt != nil},
		inv.Notes,
		inv.ID,
	)
	if err != nil {
		log.Println("Error updating invoice:", err)
		return err
	}
	return nil
}

// UpdateInvoiceStatus updates the status and paid_at fields
func updateInvoiceStatus(id int, status string, paidAt *time.Time) error {
	query := `
		update invoices set status = $1, paid_at = $2 where id = $3`
	_, err := config.DB.Exec(query, status, paidAt, id)
	if err != nil {
		log.Println("Error updating invoice status:", err)
		return err
	}
	return nil
}

// GetInvoiceTotalAndPayments returns invoice amount and current sum of payments
func GetInvoiceTotalAndPayments(invoiceID int) (float64, float64, error) {
	var invoiceAmount float64
	var paymentSum float64

	err := config.DB.QueryRow(`SELECT amount FROM invoices WHERE id = $1`, invoiceID).Scan(&invoiceAmount)
	if err != nil {
		return 0, 0, err
	}

	err = config.DB.QueryRow(`SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = $1`, invoiceID).Scan(&paymentSum)
	if err != nil {
		return 0, 0, err
	}

	return invoiceAmount, paymentSum, nil
}

// DeleteInvoice removes an invoice
func DeleteInvoice(id int) error {
	_, err := config.DB.Exec(`DELETE FROM invoices WHERE id = $1`, id)
	if err != nil {
		log.Println("Error deleting invoice:", err)
		return err
	}
	return nil
}

// Filters

func GetInvoicesByPatientID(patientID int) ([]models.Invoice, error) {
	query := `
		SELECT id, patient_id, appointment_id, amount, status, due_date, issued_at, paid_at, notes
		FROM invoices WHERE patient_id = $1 ORDER BY issued_at DESC, id DESC
	`
	rows, err := config.DB.Query(query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Invoice
	for rows.Next() {
		var inv models.Invoice
		var apptID sql.NullInt64
		var paidAt sql.NullTime
		if err := rows.Scan(
			&inv.ID, &inv.PatientID, &apptID, &inv.Amount, &inv.Status,
			&inv.DueDate, &inv.IssuedAt, &paidAt, &inv.Notes,
		); err != nil {
			continue
		}
		if apptID.Valid {
			v := int(apptID.Int64)
			inv.AppointmentID = &v
		}
		if paidAt.Valid {
			t := paidAt.Time
			inv.PaidAt = &t
		}
		list = append(list, inv)
	}
	return list, nil
}

func GetInvoicesByStatus(status string) ([]models.Invoice, error) {
	query := `
		SELECT id, patient_id, appointment_id, amount, status, due_date, issued_at, paid_at, notes
		FROM invoices WHERE status = $1 ORDER BY issued_at DESC, id DESC
	`
	rows, err := config.DB.Query(query, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Invoice
	for rows.Next() {
		var inv models.Invoice
		var apptID sql.NullInt64
		var paidAt sql.NullTime
		if err := rows.Scan(
			&inv.ID, &inv.PatientID, &apptID, &inv.Amount, &inv.Status,
			&inv.DueDate, &inv.IssuedAt, &paidAt, &inv.Notes,
		); err != nil {
			continue
		}
		if apptID.Valid {
			v := int(apptID.Int64)
			inv.AppointmentID = &v
		}
		if paidAt.Valid {
			t := paidAt.Time
			inv.PaidAt = &t
		}
		list = append(list, inv)
	}
	return list, nil
}

func MarkInvoicePaid(id int, paidAt time.Time) error {
	query := `UPDATE invoices SET status = 'paid', paid_at = $1 WHERE id = $2`
	_, err := config.DB.Exec(query, paidAt, id)
	return err
}

// helpers
func valueOrZero(p *int) int {
	if p == nil {
		return 0
	}
	return *p
}
func valueOrTime(p *time.Time) time.Time {
	if p == nil {
		return time.Time{}
	}
	return *p
}
