import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import SiteHeader from "../components/SiteHeader";

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [latestPosts, setLatestPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token")),
    );
    const [currentUsername, setCurrentUsername] = useState(
        localStorage.getItem("username") || "",
    );
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentSaving, setCommentSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");
            try {
                const [postResponse, postsResponse] = await Promise.all([
                    api.get(`/posts/${id}`),
                    api.get("/posts"),
                ]);

                const currentPost = postResponse?.data?.data || null;
                const allPosts = Array.isArray(postsResponse?.data?.data)
                    ? postsResponse.data.data
                    : [];
                const normalizedId = String(currentPost?.id || currentPost?.ID || "");
                const sortedLatest = [...allPosts]
                    .filter((item) => String(item.id || item.ID || "") !== normalizedId)
                    .sort((a, b) => {
                        const dateA = new Date(a.created_at || a.CreatedAt || 0).getTime();
                        const dateB = new Date(b.created_at || b.CreatedAt || 0).getTime();
                        return dateB - dateA;
                    })
                    .slice(0, 5);

                setPost(currentPost);
                setLatestPosts(sortedLatest);
            } catch (err) {
                setError(err.response?.data?.error || "Không thể tải bài viết");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    useEffect(() => {
        const loadComments = async () => {
            setCommentsLoading(true);
            setCommentError("");
            try {
                const response = await api.get(`/posts/${id}/comments`);
                const apiComments = Array.isArray(response?.data?.data)
                    ? response.data.data
                    : [];
                setComments(apiComments);
            } catch (err) {
                setCommentError(err.response?.data?.error || "Không thể tải bình luận");
                setComments([]);
            } finally {
                setCommentsLoading(false);
            }
        };

        loadComments();
    }, [id]);

    const getPostValue = (item, key) =>
        item?.[key] || item?.[key.charAt(0).toUpperCase() + key.slice(1)];

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

    const getReadingMinutes = (value) => {
        const text = (value || "").trim();
        if (!text) {
            return 1;
        }

        return Math.max(1, Math.ceil(text.split(/\s+/).length / 220));
    };

    const parseImageMarkdown = (line) => {
        const trimmedLine = String(line || "").trim();
        const match = trimmedLine.match(/^!\[(.*)\]\((https?:\/\/[^\s)]+)\)$/i);
        if (!match) {
            return null;
        }

        return {
            alt: match[1] || "Hình minh họa",
            src: match[2],
        };
    };

    const renderInlineText = (text, keyPrefix) => {
        const parts = String(text || "")
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .filter((part) => part.length > 0);

        return parts.map((part, index) => {
            if (/^\*\*[^*]+\*\*$/.test(part)) {
                return <strong key={`${keyPrefix}-b-${index}`}>{part.slice(2, -2)}</strong>;
            }

            if (/^\*[^*]+\*$/.test(part)) {
                return <em key={`${keyPrefix}-m-${index}`}>{part.slice(1, -1)}</em>;
            }

            return <span key={`${keyPrefix}-t-${index}`}>{part}</span>;
        });
    };

    const renderRichContent = (content) => {
        const lines = String(content || "").split("\n");
        const nodes = [];
        let listItems = [];

        const flushList = () => {
            if (listItems.length === 0) {
                return;
            }

            nodes.push(
                <ul key={`list-${nodes.length}`}>
                    {listItems.map((item, index) => (
                        <li key={`item-${index}`}>{renderInlineText(item, `li-${nodes.length}-${index}`)}</li>
                    ))}
                </ul>,
            );
            listItems = [];
        };

        lines.forEach((rawLine, index) => {
            const line = rawLine.trim();

            if (!line) {
                flushList();
                return;
            }

            const imageData = parseImageMarkdown(line);
            if (imageData) {
                flushList();
                nodes.push(
                    <figure key={`img-${index}`} className="post-content-image-wrap">
                        <img
                            src={imageData.src}
                            alt={imageData.alt}
                            className="post-content-image"
                            loading="lazy"
                        />
                    </figure>,
                );
                return;
            }

            if (line === "---") {
                flushList();
                nodes.push(<div key={`hr-${index}`} className="rich-divider" />);
                return;
            }

            if (line.startsWith("### ")) {
                flushList();
                nodes.push(
                    <h3 key={`h3-${index}`}>{renderInlineText(line.slice(4), `h3-${index}`)}</h3>,
                );
                return;
            }

            if (line.startsWith("## ")) {
                flushList();
                nodes.push(
                    <h2 key={`h2-${index}`}>{renderInlineText(line.slice(3), `h2-${index}`)}</h2>,
                );
                return;
            }

            if (line.startsWith("# ")) {
                flushList();
                nodes.push(
                    <h1 key={`h1-${index}`}>{renderInlineText(line.slice(2), `h1-${index}`)}</h1>,
                );
                return;
            }

            if (line.startsWith("> ")) {
                flushList();
                nodes.push(
                    <p key={`note-${index}`} className="rich-note">
                        {renderInlineText(line.slice(2), `note-${index}`)}
                    </p>,
                );
                return;
            }

            if (line.startsWith("~ ")) {
                flushList();
                nodes.push(
                    <p key={`small-${index}`} className="rich-small">
                        {renderInlineText(line.slice(2), `small-${index}`)}
                    </p>,
                );
                return;
            }

            if (line.startsWith("- ")) {
                listItems.push(line.slice(2));
                return;
            }

            flushList();
            nodes.push(<p key={`p-${index}`}>{renderInlineText(line, `p-${index}`)}</p>);
        });

        flushList();
        return nodes;
    };

    const handleAddComment = (event) => {
        event.preventDefault();

        if (!isLoggedIn) {
            setCommentError("Bạn cần đăng nhập để thêm bình luận");
            return;
        }

        const trimmedComment = commentText.trim();
        if (!trimmedComment) {
            return;
        }

        if (commentSaving) {
            return;
        }

        setCommentSaving(true);
        setCommentError("");

        api
            .post(`/posts/${id}/comments`, { content: trimmedComment })
            .then((response) => {
                const createdComment = response?.data?.data;
                if (createdComment) {
                    setComments((currentComments) => [
                        createdComment,
                        ...currentComments,
                    ]);
                }
                setCommentText("");
            })
            .catch((err) => {
                setCommentError(
                    err.response?.data?.error || "Không thể thêm bình luận",
                );
            })
            .finally(() => {
                setCommentSaving(false);
            });
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
                    <article className="card-shell post-detail-card" id="content">
                        {loading ? (
                            <div className="empty-state">Đang tải bài viết...</div>
                        ) : error ? (
                            <div className="empty-state">{error}</div>
                        ) : post ? (
                            <>
                                <div className="detail-header">
                                    <p className="eyebrow">Bài viết chi tiết</p>
                                    <div className="detail-breadcrumb">
                                        <Link to="/">Trang chủ</Link>
                                        <span>/</span>
                                        <Link to="/my-blog">Blog cá nhân</Link>
                                        <span>/</span>
                                        <strong>Chi tiết</strong>
                                    </div>
                                    <h1 className="post-detail-title">
                                        {getPostValue(post, "title")}
                                    </h1>
                                    <div className="post-detail-meta">
                                        <p className="meta-line compact">
                                            <strong>
                                                {getPostValue(post, "author") || "Unknown"}
                                            </strong>
                                            <span>
                                                {getFormattedDate(getPostValue(post, "created_at"))}
                                            </span>
                                            <span>
                                                {getReadingMinutes(getPostValue(post, "content"))} phút
                                                đọc
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="detail-divider" />
                                <div className="post-detail-content rich-content">
                                    {renderRichContent(getPostValue(post, "content"))}
                                </div>

                                <div className="detail-divider" />

                                <section className="comments-section">
                                    <h2>Bình luận</h2>
                                    <form className="comment-form" onSubmit={handleAddComment}>
                                        <textarea
                                            value={commentText}
                                            onChange={(event) => setCommentText(event.target.value)}
                                            placeholder="Viết bình luận của bạn..."
                                            rows="3"
                                            disabled={!isLoggedIn || commentSaving}
                                        />
                                        <div className="comment-form-actions">
                                            <button
                                                type="submit"
                                                className="btn solid"
                                                disabled={!isLoggedIn || commentSaving}
                                            >
                                                {commentSaving ? "Đang gửi..." : "Thêm bình luận"}
                                            </button>
                                        </div>
                                    </form>
                                    {!isLoggedIn ? (
                                        <p className="auth-subtitle">
                                            Đăng nhập để thêm bình luận.
                                        </p>
                                    ) : null}
                                    {commentError ? (
                                        <p className="error-text">{commentError}</p>
                                    ) : null}
                                    {commentsLoading ? (
                                        <p className="auth-subtitle">Đang tải bình luận...</p>
                                    ) : comments.length === 0 ? (
                                        <p className="auth-subtitle">
                                            Chưa có bình luận nào cho bài viết này.
                                        </p>
                                    ) : (
                                        <div className="comment-list">
                                            {comments.map((comment) => (
                                                <article key={comment.id} className="comment-item">
                                                    <div className="comment-head">
                                                        <strong>{comment.author}</strong>
                                                        <span>{getFormattedDate(comment.created_at)}</span>
                                                    </div>
                                                    <p>{comment.content}</p>
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
                        <p>Quay lại danh sách hoặc mở trang tạo bài viết mới.</p>
                        <div className="sidebar-actions">
                            <Link to="/my-blog" className="btn ghost block-button">
                                Blog cá nhân
                            </Link>
                            <Link to="/posts/new" className="btn solid block-button">
                                Tạo bài viết
                            </Link>
                        </div>
                    </section>

                    <section className="card-shell sidebar-card">
                        <h3>Bài viết mới</h3>
                        {latestPosts.length === 0 ? (
                            <p className="auth-subtitle">Chưa có bài viết để gợi ý.</p>
                        ) : (
                            <div className="related-list">
                                {latestPosts.map((item) => (
                                    <article key={item.id || item.ID} className="related-item">
                                        <Link
                                            to={`/posts/${item.id || item.ID}`}
                                            className="post-link"
                                        >
                                            {getPostValue(item, "title")}
                                        </Link>
                                        <small>
                                            {getFormattedDate(getPostValue(item, "created_at"))}
                                        </small>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </main>
        </div>
    );
}

export default PostDetail;
