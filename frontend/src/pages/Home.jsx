import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";
import SiteHeader from "../components/SiteHeader";

const PAGE_SIZE = 5;

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setCurrentUsername(localStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setPostsError("");
      try {
        const response = await api.get("/posts");
        const apiPosts = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        const sortedPosts = [...apiPosts].sort((a, b) => {
          const dateA = new Date(a.created_at || a.CreatedAt || 0).getTime();
          const dateB = new Date(b.created_at || b.CreatedAt || 0).getTime();
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      } catch (error) {
        setPostsError(
          error.response?.data?.error || "Không thể tải danh sách bài viết",
        );
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestionsLoading(true);
      try {
        const response = await api.get("/questions");
        const apiQuestions = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setQuestions(apiQuestions.slice(0, 3));
      } catch (error) {
        console.error("Không thể tải danh sách hỏi đáp", error);
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "Mới đăng";
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Mới đăng";
    }

    return parsedDate.toLocaleString("vi-VN");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const title = (post.title || post.Title || "").toLowerCase();
    return title.includes(normalizedSearchTerm);
  });
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const logout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
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
    <div className="home-page">
      <SiteHeader
        searchTerm={searchTerm}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        onSearchSubmit={handleSearchSubmit}
        isLoggedIn={isLoggedIn}
        currentUsername={currentUsername}
        onLogout={logout}
        isLoggingOut={isLoggingOut}
      />

      <main className="layout">
        <section className="feed">
          <h3 className="feed-title">Bài viết mới nhất</h3>

          {loadingPosts ? (
            <div className="empty-state">Đang tải bài viết mới nhất...</div>
          ) : postsError ? (
            <div className="empty-state">{postsError}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              {normalizedSearchTerm
                ? "Không tìm thấy bài viết phù hợp với tiêu đề đã nhập."
                : "Chưa có bài viết nào được đăng."}
            </div>
          ) : (
            <>
              {paginatedPosts.map((post) => (
                <article
                  key={post.id || post.ID}
                  className="post-item home-post-item"
                >
                  <div>
                    <p className="meta-line compact home-post-meta">
                      <strong>{post.author || post.Author || "Unknown"}</strong>
                      <span>
                        {formatDate(post.created_at || post.CreatedAt)}
                      </span>
                    </p>
                    <h2>
                      <Link
                        to={`/posts/${post.id || post.ID}`}
                        className="post-link"
                      >
                        {post.title || post.Title}
                      </Link>
                    </h2>
                  </div>
                </article>
              ))}

              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>

        <aside className="sidebar">
          <section className="panel">
            <h3>Tạo bài viết</h3>
            <p className="panel-copy">
              Chia sẻ ý tưởng, hướng dẫn kỹ thuật hoặc một bài viết mới ngay lập
              tức.
            </p>
            <div className="panel-actions">
              <Link
                to={isLoggedIn ? "/posts/new" : "/login"}
                className="btn solid"
              >
                {isLoggedIn ? "Tạo bài viết ngay" : "Đăng nhập để đăng bài"}
              </Link>
              <Link to="/my-blog" className="btn ghost">
                Xem blog cá nhân
              </Link>
            </div>
          </section>

          <section className="panel">
            <h3>Câu hỏi mới nhất</h3>
            {questionsLoading ? (
              <div className="empty-state">Đang tải câu hỏi mới nhất...</div>
            ) : questions.length === 0 ? (
              <div className="empty-state">Chưa có câu hỏi nào được đăng.</div>
            ) : (
              questions.map((item) => (
                <div key={item.id || item.ID} className="question-item">
                  <Link
                    to={`/questions/${item.id || item.ID}`}
                    className="post-link"
                  >
                    <p>{item.title || item.Title}</p>
                  </Link>
                  <small>{item.author || item.Author}</small>
                </div>
              ))
            )}
          </section>
        </aside>
      </main>

      {!isLoggedIn ? (
        <div className="floating-auth">
          <Link to="/login" className="btn ghost">
            Login
          </Link>
          <Link to="/register" className="btn solid">
            Register
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
