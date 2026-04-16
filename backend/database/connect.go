package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Khai báo biến DB toàn cục với kiểu *gorm.DB thay vì *sql.DB
var DB *gorm.DB

func ConnectDB() {
	// 1. Đọc file .env
	err := godotenv.Load()
	if err != nil {
		log.Println("Cảnh báo: Không tìm thấy file .env, hệ thống sẽ dùng biến môi trường mặc định.")
	}

	// 2. Lấy thông tin từ .env
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	// 3. Tạo chuỗi kết nối (DSN)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbname, port, sslmode)

	// 4. Khởi tạo kết nối qua GORM
	// gorm.Open tự động kiểm tra (ping) kết nối ở bên dưới luôn nên ta không cần gọi DB.Ping() nữa
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Lỗi kết nối GORM: %v", err)
	}

	fmt.Println("🚀 Kết nối Database bằng GORM thành công!")
}
