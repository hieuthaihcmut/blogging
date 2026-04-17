import React from "react";
import { Link } from "react-router-dom";

function SiteHeader({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  isLoggedIn,
  currentUsername,
  onLogout,
  isLoggingOut = false,
}) {
  const handleSubmit = (event) => {
    if (onSearchSubmit) {
      onSearchSubmit(event);
      return;
    }

    event.preventDefault();
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">GOBLOG</div>

        <nav className="menu">
          <Link to="/">Trang chủ</Link>
          <Link to="/questions">Hỏi đáp</Link>
        </nav>

        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết"
            value={searchTerm}
            onChange={onSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        {!isLoggedIn ? (
          <div className="auth-links">
            <Link to="/login">Đăng nhập</Link>
            <span>/</span>
            <Link to="/register">Đăng ký</Link>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/my-blog">Blog cá nhân</Link>
            <span>Xin chào, {currentUsername || "bạn"}</span>
            <button
              type="button"
              className="logout-link"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Đang xuất..." : "Đăng xuất"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
