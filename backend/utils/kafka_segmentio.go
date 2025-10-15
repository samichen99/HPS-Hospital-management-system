package utils

import (
	"context"
	"encoding/json"
	"log"
	"time"

	kafka "github.com/segmentio/kafka-go"
)

var (
	brokers = []string{"localhost:9092"} // docker kafka as localhost
	
	kafkaWriters = map[string]*kafka.Writer{}
)

// InitKafkaWriters initializes kafka writers

func InitKafkaWriters(topics []string) {
	for _, t := range topics {
		// create writer per topic
		w := kafka.NewWriter(kafka.WriterConfig{
			Brokers:  brokers,
			Topic:    t,
			Balancer: &kafka.LeastBytes{},
		})
		kafkaWriters[t] = w
		log.Printf("[kafka] writer initialized for topic=%s", t)
	}
}

// CloseKafkaWriters closes all writers
func CloseKafkaWriters() {
	for t, w := range kafkaWriters {
		if w != nil {
			_ = w.Close()
			log.Printf("[kafka] writer closed for topic=%s", t)
		}
	}
}

// PublishToTopic marshals value to JSON and writes a message

func PublishToTopic(ctx context.Context, topic, key string, value interface{}) error {
	w, ok := kafkaWriters[topic]
	if !ok || w == nil {
		return &TopicNotInitializedError{Topic: topic}
	}

	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	msg := kafka.Message{
		Key:   []byte(key),
		Value: b,
		Time:  time.Now(),
	}

	
	if err := w.WriteMessages(ctx, msg); err != nil {
		log.Printf("[kafka] failed write topic=%s key=%s err=%v", topic, key, err)
		return err
	}
	log.Printf("[kafka] published topic=%s key=%s len=%d", topic, key, len(b))
	return nil
}

// PublishAppointmentEvent helper
func PublishAppointmentEvent(ctx context.Context, eventTopic string, data interface{}) error {
	
	payload := map[string]interface{}{
		"event":     eventTopic,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"data":      data,
	}
	return PublishToTopic(ctx, eventTopic, eventTopic, payload)
}

// StartAppointmentConsumers starts a simple consumer 

func StartAppointmentConsumers(topics []string, groupID string) {
	for _, topic := range topics {
		go startReaderForTopic(topic, groupID)
	}
}

// startReaderForTopic runs a single reader loop (blocking inside goroutine).
func startReaderForTopic(topic, groupID string) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   brokers,
		Topic:     topic,
		GroupID:   groupID,
		MaxWait:   500 * time.Millisecond,
	})
	log.Printf("[kafka-consumer] started reader topic=%s group=%s", topic, groupID)

	defer func() {
		if err := r.Close(); err != nil {
			log.Printf("[kafka-consumer] error closing reader topic=%s : %v", topic, err)
		}
	}()

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			
			log.Printf("[kafka-consumer] read error topic=%s : %v", topic, err)
			
			time.Sleep(500 * time.Millisecond)
			continue
		}
		log.Printf("[kafka-consumer] topic=%s partition=%d offset=%d key=%s value=%s",
			topic, m.Partition, m.Offset, string(m.Key), string(m.Value))
	}
}

// TopicNotInitializedError indicates writer for the topic wasn't init'd
type TopicNotInitializedError struct {
	Topic string
}

func (e *TopicNotInitializedError) Error() string {
	return "kafka topic not initialized: " + e.Topic
}
