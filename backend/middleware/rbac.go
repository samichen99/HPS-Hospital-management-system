package middleware

import (
	"net/http"

	"github.com/samichen99/HAP-hospital-management-system/utils"
)

// RequireRole ensures that only users with the given role can access a route

func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get claims from context (set by AuthMiddleware)
			claims, ok := r.Context().Value("user").(*utils.Claims)
			if !ok {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			// Compare role
			
			if claims.Role != role {
				http.Error(w, "forbidden: insufficient permissions", http.StatusForbidden)
				return
			}

			// proceed to next handler

			next.ServeHTTP(w, r)
		})
	}
}
