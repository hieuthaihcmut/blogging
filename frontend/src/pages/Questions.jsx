import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";
import SiteHeader from "../components/SiteHeader";

const PAGE_SIZE = 5;

function Questions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [currentUsername, setCurrentUsername] = useState(
    localStorage.getItem("username") || "",
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/questions");
        const apiQuestions = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setQuestions(apiQuestions);
      } catch (err) {
        setError(
          err.response?.data?.error || "Không thể tải danh sách hỏi đáp",
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setCurrentUsername(localStorage.getItem("username") || "");
  }, []);

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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredQuestions = questions.filter((item) =>
    (item.title || "").toLowerCase().includes(normalizedSearchTerm),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleQuestions = filteredQuestions.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  return (
    <div className="posts-page">
      <SiteHeader
        searchTerm={searchTerm}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        onSearchSubmit={(event) => event.preventDefault()}
        isLoggedIn={isLoggedIn}
        currentUsername={currentUsername}
        onLogout={logout}
        isLoggingOut={isLoggingOut}
      />

      <main className="posts-layout">
        <section className="posts-main">
          <div className="posts-hero card-shell">
            <div>
              <p className="eyebrow">Hỏi đáp</p>
              <h1>Danh sách câu hỏi</h1>
              <p>
                Nơi tìm câu trả lời, đặt câu hỏi mới và trao đổi nhanh với cộng
                đồng.
              </p>
            </div>
          </div>

          <div className="top-action-row">
            <Link
              to={isLoggedIn ? "/questions/new" : "/login"}
              className="btn solid"
            >
              Đặt câu hỏi
            </Link>
          </div>

          <section className="card-shell post-list-shell">
            {loading ? (
              <div className="empty-state">Đang tải danh sách câu hỏi...</div>
            ) : error ? (
              <div className="empty-state">{error}</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="empty-state">
                {normalizedSearchTerm
                  ? "Không tìm thấy câu hỏi phù hợp."
                  : "Chưa có câu hỏi nào được đăng."}
              </div>
            ) : (
              <div className="post-list">
                {visibleQuestions.map((item) => (
                  <article key={item.id || item.ID} className="post-item">
                    <div className="post-item-main">
                      <p className="meta-line compact">
                        <strong>
                          {item.author || item.Author || "Unknown"}
                        </strong>
                        <span>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString("vi-VN")
                            : "Mới đăng"}
                        </span>
                      </p>
                      <h3>
                        <Link
                          to={`/questions/${item.id || item.ID}`}
                          className="post-link"
                        >
                          {item.title || item.Title}
                        </Link>
                      </h3>
                      <Link
                        to={`/questions/${item.id || item.ID}`}
                        className="post-preview post-preview-link"
                      >
                        {item.content || item.Content}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filteredQuestions.length > PAGE_SIZE ? (
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Questions;
