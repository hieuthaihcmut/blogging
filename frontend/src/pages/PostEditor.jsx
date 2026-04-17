import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import SiteHeader from "../components/SiteHeader";

const emptyForm = {
  title: "",
  content: "",
};

function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = useMemo(() => Boolean(id), [id]);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/posts/${id}`);
        const post = response?.data?.data || {};
        setForm({
          title: post.title || post.Title || "",
          content: post.content || post.Content || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.error || "Không thể tải bài viết để chỉnh sửa",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setError("Bạn cần đăng nhập để đăng bài hoặc chỉnh sửa bài viết");
      return;
    }

    if (saving) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
    };

    if (!payload.title || !payload.content) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
        navigate(`/posts/${id}`);
        return;
      }

      const response = await api.post("/posts", payload);
      const newPost = response?.data?.data || {};
      const newID = newPost.id || newPost.ID;
      navigate(newID ? `/posts/${newID}` : "/my-blog");
    } catch (err) {
      setError(err.response?.data?.error || "Không thể lưu bài viết");
    } finally {
      setSaving(false);
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
                <p className="eyebrow">Trình biên tập</p>
                <h2>{isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h2>
                <p>
                  {isEditing
                    ? "Cập nhật lại tiêu đề và nội dung bài viết."
                    : "Nhập thông tin để đăng bài mới lên hệ thống."}
                </p>
              </div>
              <Link to="/my-blog" className="secondary-button post-view-button">
                Quay lại blog cá nhân
              </Link>
            </div>

            {loading ? (
              <div className="empty-state">Đang tải dữ liệu bài viết...</div>
            ) : !isLoggedIn ? (
              <div className="login-prompt">
                <p>
                  Bạn chưa đăng nhập. Đăng nhập để đăng bài và chỉnh sửa bài
                  viết.
                </p>
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
                  Tiêu đề
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="Nhập tiêu đề bài viết"
                    required
                  />
                </label>

                <label>
                  Nội dung
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="12"
                    placeholder="Nhập nội dung bài viết"
                    required
                  />
                </label>

                <div className="form-actions editor-form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/my-blog")}
                    disabled={saving}
                  >
                    Huy
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Đang lưu..."
                      : isEditing
                        ? "Cập nhật bài viết"
                        : "Đăng bài"}
                  </button>
                </div>
              </form>
            )}

            {error ? <p className="error-text mt-12">{error}</p> : null}
          </section>
        </section>

        <aside className="posts-sidebar">
          <section className="card-shell sidebar-card accent-card">
            <h3>Hướng dẫn</h3>
            <ul>
              <li>Tiêu đề nên ngắn gọn, rõ ý chính.</li>
              <li>Nội dung có thể xuống dòng để dễ đọc hơn.</li>
              <li>Sau khi lưu, hệ thống sẽ chuyển đến trang chi tiết.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default PostEditor;
