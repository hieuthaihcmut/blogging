package models

import (
	"time"

	"github.com/google/uuid"
)

type Answer struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	QuestionID uuid.UUID `json:"question_id" gorm:"type:uuid;not null;index"`
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	Author     string    `json:"author" gorm:"not null"`
	Content    string    `json:"content" gorm:"type:text;not null"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
