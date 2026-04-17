import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">GOBLO</div>
        <h1>Đăng ký</h1>
        <p className="auth-subtitle">
          Tạo tài khoản mới để bắt đầu sử dụng blog.
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
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Nhập email"
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

          <label>
            Confirm Password
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Nhập lại password"
              required
            />
          </label>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>

        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
