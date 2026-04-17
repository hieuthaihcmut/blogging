package main

import (
	"fmt"
	"hieu/goblog/bootstrap"
	"hieu/goblog/controllers"
	"hieu/goblog/database"
	"hieu/goblog/middleware"
	"hieu/goblog/models"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.Question{}, &models.Answer{})
	bootstrap.SeedAll()

	r := gin.Default()

	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)
	r.POST("/api/logout", controllers.Logout)

	r.GET("/api/posts", controllers.GetAllPosts)
	r.GET("/api/posts/:id", controllers.GetPostByID)
	r.GET("/api/posts/:id/comments", controllers.GetCommentsByPostID)
	r.POST("/api/posts/:id/comments", middleware.RequireAuth, controllers.CreateComment)
	r.POST("/api/posts", middleware.RequireAuth, controllers.CreatePost)
	r.PUT("/api/posts/:id", middleware.RequireAuth, controllers.UpdatePost)
	r.DELETE("/api/posts/:id", middleware.RequireAuth, controllers.DeletePost)
	r.GET("/api/questions", controllers.GetAllQuestions)
	r.GET("/api/questions/:id", controllers.GetQuestionByID)
	r.GET("/api/questions/:id/answers", controllers.GetAnswersByQuestionID)
	r.POST("/api/questions", middleware.RequireAuth, controllers.CreateQuestion)
	r.POST("/api/questions/:id/answers", middleware.RequireAuth, controllers.CreateAnswer)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("listening and serving HTTP on: localhost:%s\n", port)
	r.Run(":" + port)
}
