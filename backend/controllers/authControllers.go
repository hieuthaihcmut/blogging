package controllers

import (
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// 1. Struct hứng dữ liệu từ client gửi lên khi Đăng Ký / Đăng Nhập
type AuthInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"` // Bỏ binding nếu làm hàm Login chỉ cần Username
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// 2. Hàm Đăng Ký (Register)
func Register(c *gin.Context) {
	var input AuthInput

	// Kiểm tra dữ liệu gửi lên có đúng chuẩn JSON không
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	// Mã hóa (Hash) mật khẩu trước khi lưu vào DB
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi mã hóa mật khẩu"})
		return
	}

	// Tạo object User mới
	user := models.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}

	// Lưu vào Database
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Tên đăng nhập hoặc Email đã tồn tại"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đăng ký thành công!", "user": user.Username})
}

// 3. Hàm Đăng Nhập (Login)
func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// Tìm user trong Database theo Username
	var user models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai tên đăng nhập hoặc mật khẩu"})
		return
	}

	// So sánh mật khẩu người dùng gửi với mật khẩu đã mã hóa trong DB
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai tên đăng nhập hoặc mật khẩu"})
		return
	}

	// Nếu đúng, tạo JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID.String(),                          // ID người dùng (Subject)
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // Hạn sử dụng: 7 ngày
	})

	// Ký token bằng Secret Key
	secretKey := []byte(os.Getenv("JWT_SECRET"))
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tạo Token"})
		return
	}

	// Trả Token về cho Client (có thể lưu ở Cookie hoặc gửi qua JSON)
	// Ở đây mình chọn cách trả về cục JSON và set luôn Cookie cho an toàn
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*7, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng nhập thành công",
		"token":   tokenString, // Gửi về cho Frontend (React/Vue) cất đi
	})
}

// 4. Hàm Đăng Xuất (Logout)
func Logout(c *gin.Context) {
	// Xóa Cookie chứa token
	c.SetCookie("Authorization", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Đăng xuất thành công"})
}
