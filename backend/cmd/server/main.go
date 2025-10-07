package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/samichen99/HAP-hospital-management-system/api"
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

func main() {

	// Init Kafka writers
	topics := []string{
		"appointments.created",
		"appointments.updated",
		"appointments.canceled",
	}
	utils.InitKafkaWriters(topics)

	// Init DB
	config.InitDb()

	// Init Router
	router := api.NewRouter()

	// Create an http.Server instance
	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	// Start consumers (runs in background)
	utils.StartAppointmentConsumers(topics, "appointment-demo-consumer-group")

	// Start HTTP server in goroutine
	go func() {
		log.Println("HTTP server starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %s\n", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutting down server...")

	utils.CloseKafkaWriters()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}
