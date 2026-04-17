import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import SiteHeader from "../components/SiteHeader";

function QuestionEditor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [currentUsername, setCurrentUsername] = useState(
    localStorage.getItem("username") || "",
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setCurrentUsername(localStorage.getItem("username") || "");
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn || loading) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/questions", form);
      const questionId = response?.data?.data?.id || response?.data?.data?.ID;
      setSuccess("Đã đăng câu hỏi thành công");
      setTimeout(() => {
        navigate(questionId ? `/questions/${questionId}` : "/questions");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể đăng câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setIsLoggedIn(false);
      setCurrentUsername("");
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <div className="posts-page">
      <SiteHeader
        searchTerm={searchTerm}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        isLoggedIn={isLoggedIn}
        currentUsername={currentUsername}
        onLogout={logout}
        isLoggingOut={isLoggingOut}
      />

      <main className="posts-layout single-post-layout">
        <section className="posts-main">
          <section className="card-shell post-editor-page">
            <div className="section-head">
              <div>
                <p className="eyebrow">Hỏi đáp</p>
                <h2>Đặt câu hỏi mới</h2>
                <p>
                  Nhập tiêu đề và nội dung để bắt đầu một chủ đề hỏi đáp mới.
                </p>
              </div>
              <Link
                to="/questions"
                className="secondary-button post-view-button"
              >
                Quay lại danh sách
              </Link>
            </div>

            {!isLoggedIn ? (
              <div className="login-prompt">
                <p>Bạn chưa đăng nhập. Đăng nhập để đặt câu hỏi mới.</p>
                <div className="prompt-actions">
                  <Link to="/login" className="btn ghost">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="btn solid">
                    Đăng ký
                  </Link>
                </div>
              </div>
            ) : (
              <form className="post-form" onSubmit={handleSubmit}>
                <label>
                  Tiêu đề câu hỏi
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="Nhập tiêu đề câu hỏi"
                    required
                  />
                </label>

                <label>
                  Nội dung
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="10"
                    placeholder="Nhập nội dung chi tiết"
                    required
                  />
                </label>

                <div className="form-actions editor-form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/questions")}
                    disabled={loading}
                  >
                    Huy
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Đang đăng..." : "Đăng câu hỏi"}
                  </button>
                </div>
              </form>
            )}

            {error ? <p className="error-text mt-12">{error}</p> : null}
            {success ? <p className="success-text mt-12">{success}</p> : null}
          </section>
        </section>
      </main>
    </div>
  );
}

export default QuestionEditor;
