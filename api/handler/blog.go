package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type PostBlogHandler struct {
}

func NewPostBlogHandler() *PostBlogHandler {
	return &PostBlogHandler{}
}

func (b *PostBlogHandler) PostBlog(ctx *gin.Context) {
	ctx.JSON(http.StatusCreated, gin.H{
		"title":    "My First Blog Post",
		"content":  "This is the content of my first blog post.",
		"category": "Technology",
		"tags":     []string{"Tech", "Programming"},
	})
}
