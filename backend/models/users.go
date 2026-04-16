package models

import (
	"time"

	"github.com/google/uuid"
)

// User đại diện cho bảng 'users' trong database
type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Username     string    `gorm:"unique;not null"`
	Email        string    `gorm:"unique;not null"`
	PasswordHash string    `gorm:"not null"`
	FirstName    string
	LastName     string
	Role         string `gorm:"default:user"`
	IsActive     bool   `gorm:"default:true"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
