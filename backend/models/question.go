package models

import (
	"time"

	"github.com/google/uuid"
)

type Question struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Title     string    `json:"title" gorm:"not null"`
	Content   string    `json:"content" gorm:"type:text;not null"`
	Author    string    `json:"author" gorm:"not null"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
