package repositories

import (
	"log"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateInvoice inserts a new invoice record and returns its ID
func CreateInvoice(inv models.Invoice) (int, error) {
	if err := config.GormDB.Create(&inv).Error; err != nil {
		log.Println("Error creating invoice:", err)
		return 0, err
	}
	return inv.ID, nil
}

// GetInvoiceByID retrieves a single invoice by ID
func GetInvoiceByID(id int) (models.Invoice, error) {
	var inv models.Invoice
	if err := config.GormDB.First(&inv, id).Error; err != nil {
		log.Println("Error fetching invoice by ID:", err)
		return inv, err
	}
	return inv, nil
}

// GetAllInvoices retrieves all invoices
func GetAllInvoices() ([]models.Invoice, error) {
	var invoices []models.Invoice
	if err := config.GormDB.Find(&invoices).Error; err != nil {
		log.Println("Error fetching all invoices:", err)
		return nil, err
	}
	return invoices, nil
}

// UpdateInvoice updates an existing invoice
func UpdateInvoice(inv models.Invoice) error {
	if err := config.GormDB.Save(&inv).Error; err != nil {
		log.Println("Error updating invoice:", err)
		return err
	}
	return nil
}

// DeleteInvoice deletes an invoice by ID
func DeleteInvoice(id int) error {
	if err := config.GormDB.Delete(&models.Invoice{}, id).Error; err != nil {
		log.Println("Error deleting invoice:", err)
		return err
	}
	return nil
}

// GetInvoicesByPatientID retrieves all invoices for a given patient
func GetInvoicesByPatientID(patientID int) ([]models.Invoice, error) {
	var invoices []models.Invoice
	if err := config.GormDB.Where("patient_id = ?", patientID).Find(&invoices).Error; err != nil {
		log.Println("Error fetching invoices by patient ID:", err)
		return nil, err
	}
	return invoices, nil
}

// GetInvoicesByStatus retrieves all invoices with a given status
func GetInvoicesByStatus(status string) ([]models.Invoice, error) {
	var invoices []models.Invoice
	if err := config.GormDB.Where("status = ?", status).Find(&invoices).Error; err != nil {
		log.Println("Error fetching invoices by status:", err)
		return nil, err
	}
	return invoices, nil
}

// MarkInvoicePaid marks an invoice as paid and updates the PaidAt field
func MarkInvoicePaid(id int, paidAt time.Time) error {
	if err := config.GormDB.Model(&models.Invoice{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":  "paid",
			"paid_at": paidAt,
		}).Error; err != nil {
		log.Println("Error marking invoice as paid:", err)
		return err
	}
	return nil
}

// FilterInvoicesByDateRange returns invoices within a date range
func FilterInvoicesByDateRange(from, to string) ([]models.Invoice, error) {
	var invoices []models.Invoice
	if err := config.GormDB.Where("creation_date BETWEEN ? AND ?", from, to).Find(&invoices).Error; err != nil {
		log.Println("Error filtering invoices by date range:", err)
		return nil, err
	}
	return invoices, nil
}
