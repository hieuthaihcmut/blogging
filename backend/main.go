package main

import (
	"fmt"
	"hieu/goblog/controllers"
	"hieu/goblog/database"
	"hieu/goblog/models"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{})

	r := gin.Default()

	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)
	r.POST("/api/logout", controllers.Logout)

	r.GET("/api/posts", controllers.GetAllPosts)       // Xem tất cả
	r.GET("/api/posts/:id", controllers.GetPostByID)   // Xem chi tiết 1 bài
	r.POST("/api/posts", controllers.CreatePost)       // Tạo bài mới
	r.PUT("/api/posts/:id", controllers.UpdatePost)    // Sửa bài (dùng PUT)
	r.DELETE("/api/posts/:id", controllers.DeletePost) // Xóa bài

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("listening and serving HTTP on: localhost:%s\n", port)
	r.Run(":" + port)
}
