package utils

import (
	"context"
	"encoding/json"
	"log"
	"time"

	kafka "github.com/segmentio/kafka-go"
)

// kafka writer
var kafkaWriter *kafka.Writer

// init kafka writer
func InitKafkaProducer() {
	kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP("kafka:9092"),
		Balancer: &kafka.LeastBytes{},
	}
}

func PublishToKafka(topic, key string, value interface{}) error {
	jsonBytes, err := json.Marshal(value)
	if err != nil {
		return err
	}

	err = kafkaWriter.WriteMessages(context.Background(), kafka.Message{
		Topic: topic,
		Key:   []byte(key),
		Value: jsonBytes,
	})

	if err != nil {
		log.Println("Failed to publish Kafka message:", err)
		return err
	}

	log.Printf("Kafka Event Published | Topic=%s | Key=%s", topic, key)
	return nil
}

// wrapper for appointments
func PublishAppointmentEvent(eventType string, data interface{}) error {
	return PublishToKafka("appointments", eventType, map[string]interface{}{
		"event_type": eventType,
		"timestamp":  time.Now().UTC(),
		"data":       data,
	})
}
