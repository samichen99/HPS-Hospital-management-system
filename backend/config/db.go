package config

import (
	"database/sql"
	
	"log"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB      *sql.DB   
	GormDB  *gorm.DB  
)

func InitDB() {
	dsn := "host=localhost user=postgres password=admin dbname=hospital_db port=5432 sslmode=disable"

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
	log.Println("Connected to PostgreSQL using GORM")
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
