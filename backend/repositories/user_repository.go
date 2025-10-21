package repositories

import (
	"log"

	"github.com/samichen99/HAP-hospital-management-system/config"
	"github.com/samichen99/HAP-hospital-management-system/models"
)

// CreateUser
func CreateUser(user models.User) error {
	if err := config.GormDB.Create(&user).Error; err != nil {
		log.Println("Error inserting user:", err)
		return err
	}
	log.Println("User inserted successfully.")
	return nil
}

// UpdateUser
func UpdateUser(user models.User) error {
	if err := config.GormDB.Model(&models.User{}).Where("id = ?", user.ID).Updates(user).Error; err != nil {
		log.Println("Error updating user:", err)
		return err
	}
	log.Println("User updated successfully.")
	return nil
}

// GetUserByID
func GetUserByID(id int) (models.User, error) {
	var user models.User
	if err := config.GormDB.First(&user, id).Error; err != nil {
		log.Println("Error retrieving user:", err)
		return user, err
	}
	return user, nil
}

// GetAllUsers
func GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := config.GormDB.Find(&users).Error; err != nil {
		log.Println("Error fetching users:", err)
		return nil, err
	}
	return users, nil
}

// DeleteUser
func DeleteUser(id int) error {
	if err := config.GormDB.Delete(&models.User{}, id).Error; err != nil {
		log.Println("Error deleting user:", err)
		return err
	}
	log.Println("User deleted successfully.")
	return nil
}

// GetUserByEmail
func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	if err := config.GormDB.Where("email = ?", email).First(&user).Error; err != nil {
		log.Println("Error retrieving user by email:", err)
		return user, err
	}
	return user, nil
}
