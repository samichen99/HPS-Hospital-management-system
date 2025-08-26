package main

import (
	"log"
	"net/http"

	"github.com/samichen99/HAP-hospital-management-system/api"
	"github.com/samichen99/HAP-hospital-management-system/config"
)

func main() {
	config.InitDb()
	router := api.NewRouter()

	log.Println("server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
