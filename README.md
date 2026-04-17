# GoBlog - Fullstack Blog & Q&A Platform

GoBlog là một ứng dụng web fullstack cho phép người dùng:
- đăng ký, đăng nhập, đăng xuất
- quản lý blog cá nhân (tạo, sửa, xóa bài viết)
- đọc bài viết chi tiết và bình luận
- đặt câu hỏi backend và trả lời theo mô hình Q&A

Dự án được xây dựng để mô phỏng một luồng sản phẩm thực tế: frontend hiện đại, backend API rõ ràng, dữ liệu lưu trữ trong PostgreSQL, và xác thực người dùng bằng JWT.

## Technical Stack

### Frontend
- React 18
- React Router
- Axios
- Vite
- CSS thuần (custom UI)

### Backend
- Go
- Gin (HTTP framework)
- GORM (ORM)
- PostgreSQL
- JWT Authentication (cookie + bearer token)

### DevOps / Runtime
- Docker Compose (chạy PostgreSQL)
- Makefile (một số lệnh tiện ích)

## Kiến trúc tổng quan

```text
[React + Vite Frontend]  -->  [/api/*]  -->  [Gin REST API]
                                      \--> [Auth Middleware (JWT)]
                                      \--> [GORM]
                                      \--> [PostgreSQL]
```

## Tính năng nổi bật

- Trang chủ tổng hợp bài viết mới nhất + câu hỏi mới nhất
- Blog cá nhân với phân quyền tác giả (owner-only edit/delete)
- Chi tiết bài viết có bình luận theo thời gian thực API
- Khu vực Hỏi đáp backend (questions/answers)
- Tìm kiếm bài viết theo tiêu đề + phân trang
- Seed dữ liệu mẫu cho bài viết và câu hỏi

## Cấu trúc thư mục

```text
blogging/
├─ backend/
│  ├─ bootstrap/           # seed dữ liệu mẫu
│  ├─ controllers/         # handlers cho auth/posts/comments/questions
│  ├─ database/            # kết nối DB
│  ├─ middleware/          # RequireAuth
│  ├─ models/              # User, Post, Comment, Question, Answer
│  └─ main.go              # entrypoint backend
├─ frontend/
│  ├─ src/
│  │  ├─ components/       # SiteHeader, Pagination
│  │  ├─ pages/            # Home, My Blog, Questions, Detail, Auth...
│  │  ├─ services/         # axios api client
│  │  └─ styles.css
│  └─ vite.config.js
├─ example_image/          # ảnh demo giao diện
├─ docker-compose.yml
└─ goblog.sql
```

## Hướng dẫn chạy nhanh

### 1) Chạy PostgreSQL

```bash
docker compose up -d
```

### 2) Chạy backend (Go + Gin)

```bash
cd backend
go mod tidy
go run main.go
```

Backend mặc định: http://localhost:8080

### 3) Chạy frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định: http://localhost:3000

## API chính

### Auth
- POST /api/register
- POST /api/login
- POST /api/logout

### Posts & Comments
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
- GET /api/posts/:id/comments
- POST /api/posts/:id/comments

### Questions & Answers
- GET /api/questions
- GET /api/questions/:id
- POST /api/questions
- GET /api/questions/:id/answers
- POST /api/questions/:id/answers

## Demo giao diện (example_image)

### Trang đăng nhập
![Login](example_image/Screenshot%202026-04-17%20160635.png)

### Trang chủ
![Home](example_image/Screenshot%202026-04-17%20213558.png)

### Chi tiết bài viết (rich content + ảnh)
![Post Detail](example_image/Screenshot%202026-04-17%20213738.png)

### Khu vực hỏi đáp backend
![Questions](example_image/Screenshot%202026-04-17%20213835.png)

### Blog cá nhân
![My Blog](example_image/Screenshot%202026-04-17%20213853.png)

## Ghi chú phát triển

- Frontend đã cấu hình proxy /api về backend trong vite.config.js
- API client chung đặt tại frontend/src/services/api.js
- Seed dữ liệu được gọi lúc backend khởi động (bootstrap.SeedAll)
- Muốn thấy dữ liệu seed mới nhất: restart backend

## Định hướng mở rộng

- Thêm role nâng cao (admin/moderator)
- Thêm upload ảnh nội bộ thay vì dùng URL ngoài
- Thêm test tự động cho controller/service
- Đóng gói triển khai production với CI/CD
