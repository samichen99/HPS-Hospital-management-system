package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/samichen99/HAP-hospital-management-system/models"
	"github.com/samichen99/HAP-hospital-management-system/repositories"
)

// CreateInvoiceHandler
func CreateInvoiceHandler(w http.ResponseWriter, r *http.Request) {
	var inv models.Invoice
	if err := json.NewDecoder(r.Body).Decode(&inv); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// basic validations
	if inv.PatientID == 0 {
		http.Error(w, "patient_id is required", http.StatusBadRequest)
		return
	}
	if inv.Amount <= 0 {
		http.Error(w, "amount must be > 0", http.StatusBadRequest)
		return
	}
	if inv.Status == "" {
		inv.Status = "unpaid"
	}
	if inv.DueDate.IsZero() {
		// default due date +14 days
		inv.DueDate = time.Now().AddDate(0, 0, 14)
	}

	id, err := repositories.CreateInvoice(inv)
	if err != nil {
		http.Error(w, "Failed to create invoice", http.StatusInternalServerError)
		return
	}
	inv.ID = id

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(inv)
}

// GetInvoiceByIDHandler
func GetInvoiceByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid invoice ID", http.StatusBadRequest)
		return
	}
	inv, err := repositories.GetInvoiceByID(id)
	if err != nil {
		http.Error(w, "Error fetching invoice", http.StatusInternalServerError)
		return
	}
	if inv.ID == 0 {
		http.Error(w, "Invoice not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(inv)
}

// GetAllInvoicesHandler
func GetAllInvoicesHandler(w http.ResponseWriter, r *http.Request) {
	list, err := repositories.GetAllInvoices()
	if err != nil {
		http.Error(w, "Error fetching invoices", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(list)
}

// UpdateInvoiceHandler
func UpdateInvoiceHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid invoice ID", http.StatusBadRequest)
		return
	}
	var inv models.Invoice
	if err := json.NewDecoder(r.Body).Decode(&inv); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	inv.ID = id

	if inv.Amount <= 0 {
		http.Error(w, "amount must be > 0", http.StatusBadRequest)
		return
	}
	if inv.Status == "" {
		http.Error(w, "status is required", http.StatusBadRequest)
		return
	}

	if err := repositories.UpdateInvoice(inv); err != nil {
		http.Error(w, "Failed to update invoice", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(inv)
}

// DeleteInvoiceHandler
func DeleteInvoiceHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid invoice ID", http.StatusBadRequest)
		return
	}
	if err := repositories.DeleteInvoice(id); err != nil {
		http.Error(w, "Failed to delete invoice", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Filters

// GetInvoicesByPatientHandler
func GetInvoicesByPatientHandler(w http.ResponseWriter, r *http.Request) {
	patientID, err := strconv.Atoi(mux.Vars(r)["patient_id"])
	if err != nil {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}
	list, err := repositories.GetInvoicesByPatientID(patientID)
	if err != nil {
		http.Error(w, "Failed to fetch invoices", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(list)
}

// GetInvoicesByStatusHandler
func GetInvoicesByStatusHandler(w http.ResponseWriter, r *http.Request) {
	status := mux.Vars(r)["status"]
	if status == "" {
		http.Error(w, "status is required", http.StatusBadRequest)
		return
	}
	list, err := repositories.GetInvoicesByStatus(status)
	if err != nil {
		http.Error(w, "Failed to fetch invoices", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(list)
}

// MarkInvoicePaidHandler (PATCH /invoices/{id}/paid)
func MarkInvoicePaidHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid invoice ID", http.StatusBadRequest)
		return
	}
	var body struct {
		PaidAt *time.Time `json:"paid_at,omitempty"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)
	paidAt := time.Now()
	if body.PaidAt != nil && !body.PaidAt.IsZero() {
		paidAt = *body.PaidAt
	}
	if err := repositories.MarkInvoicePaid(id, paidAt); err != nil {
		http.Error(w, "Failed to mark invoice paid", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("Invoice marked as paid"))
}

// filter invoices by date range

func FilterInvoiceHandler(w http.ResponseWriter, r *http.Request) {
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	if from == "" || to == "" {
		http.Error(w, "from and to query parameters are required", http.StatusBadRequest)
		return
	}

	invoices, err := repositories.FilterInvoicesByDateRange(from, to)
	if err != nil {
		http.Error(w, "Failed to fetch invoices: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(invoices)
}