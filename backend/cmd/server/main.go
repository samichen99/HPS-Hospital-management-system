package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/rs/cors"
	"github.com/samichen99/HAP-hospital-management-system/api"
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

func main() {
	// init kafka writers
	topics := []string{
		"appointments.created",
		"appointments.updated",
		"appointments.canceled",
	}
	utils.InitKafkaWriters(topics)

	// Init both DBs
	config.InitDB()
	//db := config.GormDB

	// Run GORM migrations
	/*err := db.AutoMigrate(
		&models.User{},
		&models.Patient{},
		&models.Doctor{},
		&models.Appointment{},
		&models.MedicalRecord{},
		&models.File{},
		&models.Invoice{},
		&models.Payment{},
	)
	if err != nil {
		log.Fatalf("Auto migration failed: %v", err)
	}*/
	log.Println("Database connected (SQL + GORM) and migrations applied successfully.")

	// Init Router
	router := api.NewRouter()

	c := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:5173"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Authorization", "Content-Type"},
    AllowCredentials: true,
})

srv := &http.Server{
    Addr:    ":8080",
    Handler: c.Handler(router),
}

	// Start Kafka consumers
	utils.StartAppointmentConsumers(topics, "appointment-consumer-group")

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
	config.CloseDb()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}
