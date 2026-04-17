package controllers

import (
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CommentInput struct {
	Content string `json:"content"`
}

func GetCommentsByPostID(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID bài viết không hợp lệ"})
		return
	}

	var comments []models.Comment
	if err := database.DB.Where("post_id = ?", postID).Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách bình luận"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comments})
}

func CreateComment(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID bài viết không hợp lệ"})
		return
	}

	var post models.Post
	if err := database.DB.Where("id = ?", postID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy bài viết!"})
		return
	}

	var input CommentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	content := strings.TrimSpace(input.Content)
	if content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nội dung bình luận không được để trống"})
		return
	}

	user, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Bạn chưa đăng nhập!"})
		return
	}

	loggedInUser, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Không thể xác thực người dùng!"})
		return
	}

	comment := models.Comment{
		PostID:  postID,
		UserID:  loggedInUser.ID,
		Author:  loggedInUser.Username,
		Content: content,
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo bình luận"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đã thêm bình luận", "data": comment})
}
