# GoBlog Frontend - React

Đây là frontend cho ứng dụng GoBlog sử dụng React, React Router và Vite.

## 📋 Cấu trúc dự án

```
frontend/
├── src/
│   ├── pages/          # Các trang chính
│   │   ├── Home.jsx    # Trang chủ
│   │   ├── Login.jsx   # Trang đăng nhập
│   │   └── Register.jsx # Trang đăng ký
│   ├── data/           # Dữ liệu mẫu cho giao diện
│   ├── services/       # API client dùng chung
│   ├── App.jsx         # Component gốc
│   ├── main.jsx        # Entry point
│   └── styles.css      # Global styles
├── index.html         # HTML chính
├── package.json       # Package dependencies
├── vite.config.js     # Cấu hình Vite
└── .env.example       # Thí dụ biến môi trường
```

## 🚀 Khởi động

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

### 3. Build cho production

```bash
npm run build
```

### 4. Preview build production

```bash
npm run preview
```

## 🔗 API Endpoints

Frontend kết nối với các endpoints sau từ backend:

- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất

## 🔐 Authentication

Token được lưu trữ trong `localStorage` với key là `token`. Khi đăng nhập thành công, token sẽ được lưu tự động và dùng cho nút đăng xuất.

## 📦 Dependencies

- **React** - Framework frontend
- **React Router** - Routing và navigation
- **Axios** - HTTP client cho API calls
- **Vite** - Build tool

## ⚙️ Proxy Configuration

Vite được cấu hình để proxy các request từ `/api` đến backend (`http://localhost:8080`). Bạn có thể thay đổi cấu hình này trong `vite.config.js`.

## 🎨 Styling

Ứng dụng sử dụng CSS tập trung trong `src/styles.css` để giữ giao diện đồng nhất giữa các trang.

## 📝 Ghi chú

- Đảm bảo backend cũng chạy trên cùng một máy trước khi khởi động frontend
- Backend mặc định chạy trên port 8080
- Frontend mặc định chạy trên port 3000
