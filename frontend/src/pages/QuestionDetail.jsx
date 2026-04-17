import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import SiteHeader from "../components/SiteHeader";

function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answerSaving, setAnswerSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [currentUsername, setCurrentUsername] = useState(
    localStorage.getItem("username") || "",
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      setError("");
      try {
        const [questionResponse, answersResponse] = await Promise.all([
          api.get(`/questions/${id}`),
          api.get(`/questions/${id}/answers`),
        ]);

        setQuestion(questionResponse?.data?.data || null);
        setAnswers(
          Array.isArray(answersResponse?.data?.data)
            ? answersResponse.data.data
            : [],
        );
      } catch (err) {
        setError(err.response?.data?.error || "Không thể tải câu hỏi");
      } finally {
        setLoading(false);
        setAnswersLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  const getFormattedDate = (value) => {
    if (!value) {
      return "Mới đăng";
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Mới đăng";
    }

    return parsedDate.toLocaleString("vi-VN");
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

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setAnswerError("Bạn cần đăng nhập để trả lời");
      return;
    }

    const trimmedAnswer = answerText.trim();
    if (!trimmedAnswer) {
      return;
    }

    if (answerSaving) {
      return;
    }

    setAnswerSaving(true);
    setAnswerError("");

    try {
      const response = await api.post(`/questions/${id}/answers`, {
        content: trimmedAnswer,
      });
      const createdAnswer = response?.data?.data;
      if (createdAnswer) {
        setAnswers((currentAnswers) => [createdAnswer, ...currentAnswers]);
      }
      setAnswerText("");
    } catch (err) {
      setAnswerError(err.response?.data?.error || "Không thể trả lời câu hỏi");
    } finally {
      setAnswerSaving(false);
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
          <article className="card-shell post-detail-card">
            {loading ? (
              <div className="empty-state">Đang tải câu hỏi...</div>
            ) : error ? (
              <div className="empty-state">{error}</div>
            ) : question ? (
              <>
                <div className="detail-header">
                  <p className="eyebrow">Hỏi đáp chi tiết</p>
                  <div className="detail-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/questions">Hỏi đáp</Link>
                    <span>/</span>
                    <strong>Chi tiết</strong>
                  </div>
                  <h1 className="post-detail-title">{question.title}</h1>
                  <div className="post-detail-meta">
                    <p className="meta-line compact">
                      <strong>{question.author || "Unknown"}</strong>
                      <span>{getFormattedDate(question.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="detail-divider" />

                <div className="post-detail-content rich-content">
                  <p>{question.content}</p>
                </div>

                <div className="detail-divider" />

                <section className="comments-section">
                  <h2>Câu trả lời</h2>
                  <form className="comment-form" onSubmit={handleSubmitAnswer}>
                    <textarea
                      value={answerText}
                      onChange={(event) => setAnswerText(event.target.value)}
                      placeholder="Viết câu trả lời của bạn..."
                      rows="3"
                      disabled={!isLoggedIn || answerSaving}
                    />
                    <div className="comment-form-actions">
                      <button
                        type="submit"
                        className="btn solid"
                        disabled={!isLoggedIn || answerSaving}
                      >
                        {answerSaving ? "Đang gửi..." : "Thêm câu trả lời"}
                      </button>
                    </div>
                  </form>
                  {!isLoggedIn ? (
                    <p className="auth-subtitle">
                      Đăng nhập để trả lời câu hỏi.
                    </p>
                  ) : null}
                  {answerError ? (
                    <p className="error-text">{answerError}</p>
                  ) : null}
                  {answersLoading ? (
                    <p className="auth-subtitle">Đang tải câu trả lời...</p>
                  ) : answers.length === 0 ? (
                    <p className="auth-subtitle">
                      Chưa có câu trả lời nào cho câu hỏi này.
                    </p>
                  ) : (
                    <div className="comment-list">
                      {answers.map((answer) => (
                        <article key={answer.id} className="comment-item">
                          <div className="comment-head">
                            <strong>{answer.author}</strong>
                            <span>{getFormattedDate(answer.created_at)}</span>
                          </div>
                          <p>{answer.content}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : null}
          </article>
        </section>

        <aside className="posts-sidebar">
          <section className="card-shell sidebar-card accent-card">
            <h3>Hành động nhanh</h3>
            <p>Đặt câu hỏi mới hoặc quay lại danh sách hỏi đáp.</p>
            <div className="sidebar-actions">
              <Link to="/questions" className="btn ghost block-button">
                Danh sách
              </Link>
              <Link
                to={isLoggedIn ? "/questions/new" : "/login"}
                className="btn solid block-button"
              >
                Đặt câu hỏi
              </Link>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default QuestionDetail;
