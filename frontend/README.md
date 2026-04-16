# GoBlog Frontend - Vue.js

Đây là frontend cho ứng dụng GoBlog sử dụng Vue.js 3 và Vite.

## 📋 Cấu trúc dự án

```
frontend/
├── src/
│   ├── views/          # Các trang chính
│   │   ├── Home.vue   # Trang chủ
│   │   ├── Login.vue  # Trang đăng nhập
│   │   └── Register.vue  # Trang đăng ký
│   ├── router/         # Vue Router
│   │   └── index.js    # Cấu hình routing
│   ├── App.vue        # Component gốc
│   └── main.js        # Entry point
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

Token được lưu trữ trong `localStorage` với key là `token`. Khi đăng nhập thành công, token sẽ được lưu tự động.

## 📦 Dependencies

- **Vue 3** - Framework frontend
- **Vue Router** - Routing và navigation
- **Axios** - HTTP client cho API calls
- **Vite** - Build tool

## ⚙️ Proxy Configuration

Vite được cấu hình để proxy các request từ `/api` đến backend (`http://localhost:8080`). Bạn có thể thay đổi cấu hình này trong `vite.config.js`.

## 🎨 Styling

Ứng dụng sử dụng CSS được viết trực tiếp trong các `.vue` files với `<style scoped>` để tách biệt styles cho từng component.

## 📝 Ghi chú

- Đảm bảo backend cũng chạy trên cùng một máy trước khi khởi động frontend
- Backend mặc định chạy trên port 8080
- Frontend mặc định chạy trên port 3000
