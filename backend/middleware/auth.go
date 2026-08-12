package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/samichen99/HAP-hospital-management-system/repositories"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

type contextKey string

const UserClaimsKey contextKey = "userClaims"

func shouldAllowFirstUserCreation(r *http.Request) bool {
	if r.Method != http.MethodPost || r.URL.Path != "/api/users" {
		return false
	}

	users, err := repositories.GetAllUsers()
	if err != nil {
		return false
	}

	return len(users) == 0
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			if shouldAllowFirstUserCreation(r) {
				next.ServeHTTP(w, r)
				return
			}

			auth := r.Header.Get("Authorization")
			if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
				http.Error(w, "missing bearer token", http.StatusUnauthorized)
				return
			}
			token := strings.TrimPrefix(auth, "Bearer ")
			claims, err := utils.ParseJWT(token)
			if err != nil {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			// Store claims in context
			ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
}
