package utils

import (
	"context"
	"log"

	kafka "github.com/segmentio/kafka-go"
)

func StartAppointmentConsumer() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		Topic:   "appointments",
		GroupID: "appointment-consumers",
	})

	log.Println("[appointment consumer started")

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Printf("error reading message: %v", err)
			continue
		}

		log.Printf("[Kafka] Received Event | Key=%s | Value=%s", string(msg.Key), string(msg.Value))
	}
}
