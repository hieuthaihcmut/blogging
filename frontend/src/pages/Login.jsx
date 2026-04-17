import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/login", form);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "username",
          response.data.username || form.username,
        );
        setSuccess(response.data.message || "Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">GOBLO</div>
        <h1>Đăng nhập</h1>
        <p className="auth-subtitle">
          Kết nối backend để quản lý tài khoản của bạn.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="Nhập username"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Nhập password"
              required
            />
          </label>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
