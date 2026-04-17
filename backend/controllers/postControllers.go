package controllers

import (
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Cấu trúc dữ liệu client gửi lên khi tạo/sửa bài
type PostInput struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Desc    string `json:"desc"`
}

func getCurrentUserFromContext(c *gin.Context) (models.User, bool) {
	user, exists := c.Get("currentUser")
	if !exists {
		return models.User{}, false
	}

	loggedInUser, ok := user.(models.User)
	if !ok {
		return models.User{}, false
	}

	return loggedInUser, true
}

func canManagePost(c *gin.Context, post models.Post) bool {
	loggedInUser, ok := getCurrentUserFromContext(c)
	if !ok {
		return false
	}

	return strings.EqualFold(post.Author, loggedInUser.Username) || post.UserID == loggedInUser.ID
}

// 1. Lấy danh sách TẤT CẢ bài viết
func GetAllPosts(c *gin.Context) {
	var posts []models.Post
	// Lấy tất cả bài viết, sắp xếp theo thời gian mới nhất
	if err := database.DB.Order("created_at desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách bài viết"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// 2. Lấy chi tiết 1 bài viết (Theo ID)
func GetPostByID(c *gin.Context) {
	var post models.Post
	// Tìm bài viết có ID khớp với đường dẫn URL
	if err := database.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy bài viết!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": post})
}

// 3. Tạo bài viết mới
func CreatePost(c *gin.Context) {
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	content := input.Content
	if content == "" {
		content = input.Desc
	}
	if input.Title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// LẤY THÔNG TIN NGƯỜI DÙNG TỪ MIDDLEWARE
	// (c.MustGet sẽ lấy cái "currentUser" mà ta vừa Set ở file requireAuth.go)
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

	post := models.Post{
		Title:   input.Title,
		Content: content,
		Author:  loggedInUser.Username,
		UserID:  loggedInUser.ID,
	}

	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo bài viết"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đăng bài thành công!", "data": post})
}

// 4. Cập nhật (Sửa) bài viết
func UpdatePost(c *gin.Context) {
	var post models.Post
	// Kiểm tra xem bài viết có tồn tại không trước khi sửa
	if err := database.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy bài viết!"})
		return
	}

	if !canManagePost(c, post) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Bạn chỉ có thể sửa bài viết của chính mình"})
		return
	}

	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	content := input.Content
	if content == "" {
		content = input.Desc
	}
	if input.Title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// Cập nhật dữ liệu
	if err := database.DB.Model(&post).Updates(models.Post{
		Title:   input.Title,
		Content: content,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật bài viết"})
		return
	}

	if err := database.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tải lại dữ liệu bài viết"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": post})
}

// 5. Xóa bài viết
func DeletePost(c *gin.Context) {
	var post models.Post
	// Kiểm tra xem bài viết có tồn tại không trước khi xóa
	if err := database.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy bài viết!"})
		return
	}

	if !canManagePost(c, post) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Bạn chỉ có thể xóa bài viết của chính mình"})
		return
	}

	if err := database.DB.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xóa bài viết"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đã xóa bài viết thành công!"})
}
