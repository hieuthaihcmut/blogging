package models

import (
	"time"

	"github.com/google/uuid"
)

// Post đại diện cho bảng 'posts' trong database
type Post struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Title     string    `gorm:"not null"` // Tiêu đề bài viết
	Content   string    `gorm:"not null"` // Nội dung bài viết
	Author    string    // Tên tác giả (Tạm thời lưu dạng chuỗi đơn giản)
	CreatedAt time.Time
	UpdatedAt time.Time
}
