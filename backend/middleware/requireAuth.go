package middleware

import (
	"fmt"
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// 1. Lấy Token từ Cookie (tên là "Authorization" mình đã set ở hàm Login)
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Bạn chưa đăng nhập!"})
		return
	}

	// 2. Giải mã và kiểm tra Token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Kiểm tra thuật toán mã hóa
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Lỗi thuật toán mã hóa")
		}
		// Trả về Secret Key để đối chiếu
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ hoặc đã hết hạn!"})
		return
	}

	// 3. Lấy thông tin từ Token (Claims)
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Kiểm tra hạn sử dụng (exp)
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Phiên đăng nhập đã hết hạn!"})
			return
		}

		// Tìm User trong DB dựa vào ID (sub) lưu trong Token
		var user models.User
		database.DB.First(&user, "id = ?", claims["sub"])

		if user.ID.String() == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Không tìm thấy người dùng!"})
			return
		}

		// 4. Gắn thông tin User vào Request hiện tại để Controller dùng
		c.Set("currentUser", user)

		// Cho phép đi tiếp vào Controller
		c.Next()
	} else {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token bị lỗi cấu trúc!"})
	}
}
