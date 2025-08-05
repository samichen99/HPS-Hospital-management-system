package repositories

import (
	"database/sql"
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateUser func

func CreateUser(user models.User) error {
	query := `
		INSERT INTO users (username, email, password, role)
		VALUES ($1, $2, $3, $4)
	`

	_, err := config.DB.Exec(query, user.Username, user.Email, user.Password, user.Role)
	if err != nil {
		log.Println("Error inserting user:", err)
		return err
	}

	log.Println("User inserted successfully.")
	return nil
}

// GetUserByID func

func GetUserByID(id int) (models.User, error) {
	var user models.User

	query := `
		SELECT id, username, email, password, role, creation_date
		FROM users
		WHERE id = $1
	`

	err := config.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.CreationDate,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("No user found with that ID.")
			return user, nil
		}
		log.Println("Error retrieving user:", err)
		return user, err
	}

	return user, nil
}

// GetAllUsers func

func GetAllUsers() ([]models.User, error) {
	query := `
		SELECT id, username, email, password, role, creation_date
		FROM users
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching users:", err)
		return nil, err
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Email,
			&user.Password,
			&user.Role,
			&user.CreationDate,
		)

		if err != nil {
			log.Println("Error scanning user:", err)
			continue
		}

		users = append(users, user)
	}

	return users, nil
}

// DeleteUser deletes a user by ID
func DeleteUser(id int) error {
	query := `DELETE FROM users WHERE id = $1`

	_, err := config.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting user:", err)
		return err
	}

	log.Println("User deleted successfully.")
	return nil
}
