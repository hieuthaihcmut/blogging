package main

import (
	"hieu/blogging/api/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	Postblog := handler.NewPostBlogHandler()
	r.POST("/posts", Postblog.PostBlog)
	r.Run(":8080")
}
