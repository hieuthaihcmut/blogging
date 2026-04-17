import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";
import SiteHeader from "../components/SiteHeader";

const PAGE_SIZE = 5;

function Posts({ personalMode = false }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [currentPage, setCurrentPage] = useState(1);

    const getPostId = (post) => post.id || post.ID;
    const getPostTitle = (post) => post.title || post.Title || "Chưa có tiêu đề";
    const getPostContent = (post) => post.content || post.Content || "";
    const getPostAuthor = (post) => post.author || post.Author || "Unknown";
    const getPostCreatedAt = (post) => post.created_at || post.CreatedAt;
    const isOwnedPost = (post) =>
        Boolean(
            isLoggedIn &&
            currentUsername &&
            String(getPostAuthor(post)).toLowerCase() ===
            currentUsername.toLowerCase(),
        );
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredPosts = posts.filter((post) => {
        const title = (getPostTitle(post) || "").toLowerCase();
        return title.includes(normalizedSearchTerm);
    });
    const personalPosts = personalMode
        ? currentUsername
            ? filteredPosts.filter(
                (post) =>
                    String(getPostAuthor(post)).toLowerCase() ===
                    currentUsername.toLowerCase(),
            )
            : []
        : filteredPosts;

    const totalPages = Math.max(1, Math.ceil(personalPosts.length / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    const paginatedPosts = personalPosts.slice(
        startIndex,
        startIndex + PAGE_SIZE,
    );

    const handleSearchSubmit = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentUsername(localStorage.getItem("username") || "");
    }, []);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const loadPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/posts");
            const fetchedPosts = Array.isArray(response?.data?.data)
                ? response.data.data
                : [];
            const sortedPosts = [...fetchedPosts].sort((a, b) => {
                const dateA = new Date(getPostCreatedAt(a) || 0).getTime();
                const dateB = new Date(getPostCreatedAt(b) || 0).getTime();
                return dateB - dateA;
            });
            setPosts(sortedPosts);
        } catch (err) {
            setError(err.response?.data?.error || "Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDelete = async (post) => {
        const postID = getPostId(post);
        if (!postID) {
            setError("Không thể xóa bài viết vì thiếu ID");
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa bài viết này không?")) {
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.delete(`/posts/${postID}`);
            setSuccess("Đã xóa bài viết thành công");
            await loadPosts();
        } catch (err) {
            setError(err.response?.data?.error || "Không thể xóa bài viết");
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

    const personalTitle = currentUsername
        ? `Blog cá nhân của ${currentUsername}`
        : "Blog cá nhân";
    const emptyMessage = personalMode
        ? currentUsername
            ? "Bạn chưa có bài viết nào."
            : "Hãy đăng nhập để xem blog cá nhân."
        : "Chưa có bài viết nào.";

    return (
        <div className="posts-page">
            <SiteHeader
                searchTerm={searchTerm}
                onSearchChange={(event) => setSearchTerm(event.target.value)}
                onSearchSubmit={handleSearchSubmit}
                isLoggedIn={isLoggedIn}
                currentUsername={currentUsername}
                onLogout={logout}
                isLoggingOut={isLoggingOut}
            />

            <main className="posts-layout">
                <section className="posts-main">
                    <div className="posts-hero card-shell">
                        <div>
                            <p className="eyebrow">Backend postcontroller</p>
                            <h1>{personalMode ? personalTitle : "Quản lý bài viết"}</h1>
                            <p>
                                Danh sách bài viết mới nhất và các thao tác xem, sửa, xóa, tạo
                                mới trên endpoint /api/posts.
                            </p>
                        </div>
                        <div className="posts-hero-stats">
                            <div>
                                <strong>{personalPosts.length}</strong>
                                <span>Bài viết</span>
                            </div>
                            <div>
                                <strong>{isLoggedIn ? "On" : "Off"}</strong>
                                <span>Auth</span>
                            </div>
                        </div>
                    </div>

                    <div className="top-action-row">
                        <Link to="/posts/new" className="btn solid">
                            Tạo bài viết
                        </Link>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={loadPosts}
                            disabled={loading}
                        >
                            {loading ? "Đang tải..." : "Tải lại danh sách"}
                        </button>
                    </div>

                    <section className="card-shell post-list-shell">
                        <div className="section-head">
                            <div>
                                <h2>Danh sách bài viết</h2>
                                {!personalMode ? (
                                    <p>
                                        Dữ liệu lấy trực tiếp từ backend qua GET /api/posts và sắp
                                        xếp bài mới nhất lên trên.
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {loading ? (
                            <div className="empty-state">Đang tải danh sách bài viết...</div>
                        ) : personalPosts.length === 0 ? (
                            <div className="empty-state">
                                {normalizedSearchTerm
                                    ? "Không tìm thấy bài viết phù hợp với tiêu đề đã nhập."
                                    : emptyMessage}
                            </div>
                        ) : (
                            <div className="post-list">
                                {paginatedPosts.map((post) => {
                                    const postID = getPostId(post);
                                    const createdAtText = getPostCreatedAt(post)
                                        ? new Date(getPostCreatedAt(post)).toLocaleString("vi-VN")
                                        : "Mới tạo";

                                    return (
                                        <article
                                            key={postID}
                                            className={`post-item ${personalMode ? "home-post-item" : ""}`}
                                        >
                                            <div className="post-item-main">
                                                <div className="post-item-head">
                                                    <div>
                                                        <p
                                                            className={`meta-line compact ${personalMode ? "home-post-meta" : ""}`}
                                                        >
                                                            <strong>{getPostAuthor(post)}</strong>
                                                            <span>{createdAtText}</span>
                                                        </p>
                                                        <h3>
                                                            <Link
                                                                to={`/posts/${postID}`}
                                                                className="post-link"
                                                            >
                                                                {getPostTitle(post)}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    {!personalMode ? (
                                                        <span className="post-badge">
                                                            #{String(postID).slice(0, 8)}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {!personalMode ? (
                                                    <Link
                                                        to={`/posts/${postID}`}
                                                        className="post-preview post-preview-link"
                                                    >
                                                        {getPostContent(post)}
                                                    </Link>
                                                ) : null}
                                            </div>

                                            <div
                                                className={`post-item-actions ${personalMode ? "personal-post-actions" : ""}`}
                                            >
                                                <Link
                                                    to={`/posts/${postID}`}
                                                    className="secondary-button post-view-button"
                                                >
                                                    Xem
                                                </Link>
                                                {isOwnedPost(post) ? (
                                                    <>
                                                        <Link
                                                            to={`/posts/${postID}/edit`}
                                                            className="secondary-button post-view-button"
                                                        >
                                                            Sửa
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="danger-button"
                                                            onClick={() => handleDelete(post)}
                                                            disabled={saving}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {personalPosts.length > PAGE_SIZE ? (
                            <Pagination
                                currentPage={safeCurrentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        ) : null}
                    </section>

                    {error ? <p className="error-text mt-12">{error}</p> : null}
                    {success ? <p className="success-text mt-12">{success}</p> : null}
                </section>

                {!personalMode ? (
                    <aside className="posts-sidebar">
                        <section className="card-shell sidebar-card">
                            <h3>Hướng dẫn nhanh</h3>
                            <ul>
                                <li>GET /api/posts: lấy tất cả bài viết</li>
                                <li>POST /api/posts: tạo bài viết mới</li>
                                <li>PUT /api/posts/:id: cập nhật bài viết</li>
                                <li>DELETE /api/posts/:id: xóa bài viết</li>
                            </ul>
                        </section>

                        <section className="card-shell sidebar-card accent-card">
                            <h3>Trạng thái auth</h3>
                            <p>
                                {isLoggedIn
                                    ? "Đã đăng nhập. Có thể tạo, sửa, xóa bài viết."
                                    : "Chưa đăng nhập. Hãy đăng nhập để sử dụng đầy đủ chức năng."}
                            </p>
                            <Link
                                to={isLoggedIn ? "/posts/new" : "/login"}
                                className="btn solid block-button"
                            >
                                {isLoggedIn ? "Tạo bài viết mới" : "Đăng nhập ngay"}
                            </Link>
                        </section>
                    </aside>
                ) : null}
            </main>
        </div>
    );
}

export default Posts;
