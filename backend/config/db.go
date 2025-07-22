package config
import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/joho/godotenv"
)

var DB *sql.DB
func InitDb(){

err := godotenv.Load(".env")
if err != nil {
	log.Fatal("error loading .env file")
}
host := os.Getenv("DB_HOST")
port := os.Getenv("DB_PORT")
user := os.Getenv("DB_USER")
password := os.Getenv("DB_PASSWORD")
dbname := os.Getenv("DB_NAME")

psqInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
db, err := sql.Open("postgres", psqInfo)
if err != nil {
	log.Fatal("error connecting to the database:", err)
}
err = db.Ping()
if err != nil {
	log.Fatal("cannot reach the database:", err)
}
DB = db
log.Println("Database connection established successfully")

}