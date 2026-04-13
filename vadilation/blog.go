package vadilation

type BlogRequest struct {
	Title string `json:"title" binding:"required,min=5,max=100`
}
