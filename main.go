package main

import (
	"fmt"
	"hieu/goblog/backend/controllers" // Import cái file Auth lúc nãy
	"hieu/goblog/backend/database"
	"hieu/goblog/backend/models"
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("listening and serving HTTP on: localhost:%s\n", port)
	r.Run(":" + port)
}
