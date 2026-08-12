package handlers

import (
	"net/http"
	"testing"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/utils"
)

func TestRequiresAuthForUserCreation(t *testing.T) {
	t.Run("allows first user without auth", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodPost, "/register", nil)
		if requiresAuthForUserCreation(req, 0) {
			t.Fatal("expected first user creation to be allowed without auth")
		}
	})

	t.Run("requires auth when users already exist", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodPost, "/register", nil)
		if !requiresAuthForUserCreation(req, 1) {
			t.Fatal("expected auth to be required once users already exist")
		}
	})

	t.Run("allows authenticated requests after initial setup", func(t *testing.T) {
		token, err := utils.GenerateJWT(1, "admin", time.Hour)
		if err != nil {
			t.Fatalf("expected jwt generation to succeed: %v", err)
		}

		req, _ := http.NewRequest(http.MethodPost, "/register", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		if requiresAuthForUserCreation(req, 1) {
			t.Fatal("expected bearer token to satisfy auth requirement")
		}
	})
}
