package config

import (
	"database/sql"
	"fmt"
	"os"

	"log"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB     *sql.DB
	GormDB *gorm.DB
)

func InitDB() {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "admin"
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "hospital_db"
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)

	maskedDsn := fmt.Sprintf("host=%s user=%s password=*** dbname=%s port=%s sslmode=disable", host, user, dbname, port)
	log.Printf("Database connection string: %s", maskedDsn)

	var err error

	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to raw DB: %v", err)
	}
	if err = DB.Ping(); err != nil {
		log.Fatalf("Failed to ping raw DB: %v", err)
	}
	log.Println("Connected to PostgreSQL using database/sql")

	GormDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to GORM DB: %v", err)
	}

	// to erify which database we're actually connected to
	var currentDb string
	if err := GormDB.Raw("SELECT current_database()").Scan(&currentDb).Error; err == nil {
		log.Printf("Connected to PostgreSQL using GORM - Database: %s", currentDb)
	} else {
		log.Println("Connected to PostgreSQL using GORM")
	}
}

func CloseDb() {
	if DB != nil {
		DB.Close()
		log.Println("database/sql connection closed.")
	}

	if GormDB != nil {
		sqlDB, err := GormDB.DB()
		if err == nil {
			sqlDB.Close()
			log.Println("GORM connection closed.")
		}
	}
}
