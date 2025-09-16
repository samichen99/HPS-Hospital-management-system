package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// CreatePaymentHandler
func CreatePaymentHandler(w http.ResponseWriter, r *http.Request) {
	var payment models.Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if err := repositories.CreatePayment(payment); err != nil {
		http.Error(w, "Failed to create payment", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Payment created successfully"})
}

// GetPaymentByIDHandler
func GetPaymentByIDHandler(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}
	payment, err := repositories.GetPaymentByID(id)
	if err != nil {
		http.Error(w, "Error fetching payment", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(payment)
}

// GetAllPaymentsHandler
func GetAllPaymentsHandler(w http.ResponseWriter, r *http.Request) {
	payments, err := repositories.GetAllPayments()
	if err != nil {
		http.Error(w, "Error fetching payments", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(payments)
}

// GetPaymentsByInvoiceIDHandler
func GetPaymentsByInvoiceIDHandler(w http.ResponseWriter, r *http.Request) {
	invoiceIDStr := mux.Vars(r)["invoice_id"]
	invoiceID, err := strconv.Atoi(invoiceIDStr)
	if err != nil {
		http.Error(w, "Invalid invoice ID", http.StatusBadRequest)
		return
	}
	payments, err := repositories.GetPaymentsByInvoiceID(invoiceID)
	if err != nil {
		http.Error(w, "Error fetching invoice payments", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(payments)
}

// DeletePaymentHandler
func DeletePaymentHandler(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}
	if err := repositories.DeletePayment(id); err != nil {
		http.Error(w, "Failed to delete payment", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "Payment deleted successfully"})
}

// UpdatePaymentHandler handles updating an existing payment
func UpdatePaymentHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}

	var payment models.Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	payment.ID = id 

	if err := repositories.UpdatePayment(payment); err != nil {
		http.Error(w, "Failed to update payment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Payment updated successfully"})
}
