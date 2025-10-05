package main

import (
	"log"
	"net/http"

	"github.com/samichen99/HAP-hospital-management-system/api"
	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/utils"
)

func main() {
	utils.InitKafkaProducer()
	config.InitDb()
	router := api.NewRouter()
	go utils.StartAppointmentConsumer()


	log.Println("server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
