package repositories

import (
	"errors"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreatePayment inserts a new payment record
func CreatePayment(payment models.Payment) error {
	result := config.GormDB.Create(&payment)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// GetPaymentByID fetches a single payment by ID
func GetPaymentByID(id int) (*models.Payment, error) {
	var payment models.Payment
	result := config.GormDB.First(&payment, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &payment, nil
}

// GetAllPayments retrieves all payment records
func GetAllPayments() ([]models.Payment, error) {
	var payments []models.Payment
	result := config.GormDB.Find(&payments)
	if result.Error != nil {
		return nil, result.Error
	}
	return payments, nil
}

// GetPaymentsByInvoiceID retrieves payments related to a specific invoice
func GetPaymentsByInvoiceID(invoiceID int) ([]models.Payment, error) {
	var payments []models.Payment
	result := config.GormDB.Where("invoice_id = ?", invoiceID).Find(&payments)
	if result.Error != nil {
		return nil, result.Error
	}
	return payments, nil
}

// UpdatePayment updates an existing payment record
func UpdatePayment(payment models.Payment) error {
	result := config.GormDB.Model(&models.Payment{}).Where("id = ?", payment.ID).Updates(payment)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no payment found with the given ID")
	}
	return nil
}

// DeletePayment removes a payment record by ID
func DeletePayment(id int) error {
	result := config.GormDB.Delete(&models.Payment{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no payment found with the given ID")
	}
	return nil
}
