module github.com/samichen99/HAP-hospital-management-system

go 1.24.3

require (
	github.com/joho/godotenv v1.5.1
	github.com/lib/pq v1.10.9
)

require github.com/golang-jwt/jwt/v5 v5.2.1

require (
	github.com/klauspost/compress v1.15.9 // indirect
	github.com/pierrec/lz4/v4 v4.1.15 // indirect
	github.com/segmentio/kafka-go v0.4.49 // indirect
	gopkg.in/confluentinc/confluent-kafka-go.v1 v1.8.2 // indirect
)

require github.com/confluentinc/confluent-kafka-go v1.9.2 // direct

require golang.org/x/crypto v0.42.0 // direct

require github.com/gorilla/mux v1.8.1 // direct
