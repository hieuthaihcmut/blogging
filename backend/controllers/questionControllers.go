package controllers

import (
	"hieu/goblog/database"
	"hieu/goblog/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type QuestionInput struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Desc    string `json:"desc"`
}

type AnswerInput struct {
	Content string `json:"content"`
}

func GetAllQuestions(c *gin.Context) {
	var questions []models.Question
	if err := database.DB.Order("created_at desc").Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách hỏi đáp"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": questions})
}

func GetQuestionByID(c *gin.Context) {
	var question models.Question
	if err := database.DB.Where("id = ?", c.Param("id")).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy câu hỏi!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": question})
}

func CreateQuestion(c *gin.Context) {
	var input QuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	content := strings.TrimSpace(input.Content)
	if content == "" {
		content = strings.TrimSpace(input.Desc)
	}
	title := strings.TrimSpace(input.Title)
	if title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
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

	question := models.Question{
		Title:   title,
		Content: content,
		Author:  loggedInUser.Username,
		UserID:  loggedInUser.ID,
	}

	if err := database.DB.Create(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo câu hỏi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đã đăng câu hỏi", "data": question})
}

func GetAnswersByQuestionID(c *gin.Context) {
	questionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID câu hỏi không hợp lệ"})
		return
	}

	var answers []models.Answer
	if err := database.DB.Where("question_id = ?", questionID).Order("created_at asc").Find(&answers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách câu trả lời"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": answers})
}

func CreateAnswer(c *gin.Context) {
	questionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID câu hỏi không hợp lệ"})
		return
	}

	var question models.Question
	if err := database.DB.Where("id = ?", questionID).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy câu hỏi!"})
		return
	}

	var input AnswerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	content := strings.TrimSpace(input.Content)
	if content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nội dung trả lời không được để trống"})
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

	answer := models.Answer{
		QuestionID: questionID,
		UserID:     loggedInUser.ID,
		Author:     loggedInUser.Username,
		Content:    content,
	}

	if err := database.DB.Create(&answer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo câu trả lời"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đã thêm câu trả lời", "data": answer})
}
