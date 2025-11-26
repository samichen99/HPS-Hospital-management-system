package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/repositories"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}


func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	user, err := repositories.GetUserByEmail(req.Email)
	if err != nil || user.ID == 0 {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	// Use bcrypt to check password
	if !utils.CheckPassword(req.Password, user.Password) {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := utils.GenerateJWT(user.ID, user.Role, time.Hour)
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{Token: token})
}
