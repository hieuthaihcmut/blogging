package middleware

import (
	"fmt"
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// Ưu tiên token trong cookie, fallback sang Bearer token từ header.
	tokenString, err := c.Cookie("Authorization")
	if err != nil || strings.TrimSpace(tokenString) == "" {
		authHeader := c.GetHeader("Authorization")
		if strings.HasPrefix(strings.ToLower(authHeader), "bearer ") {
			tokenString = strings.TrimSpace(authHeader[7:])
		}
	}

	if strings.TrimSpace(tokenString) == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "JWT secret is not configured",
		})
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "unauthenticated",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
		return
	}

	sub, ok := claims["sub"]
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token subject"})
		return
	}
	userID := fmt.Sprintf("%v", sub)

	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	c.Set("currentUser", user)
	c.Next()
}
