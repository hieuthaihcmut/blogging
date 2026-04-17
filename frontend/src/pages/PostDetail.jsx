import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function PostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [latestPosts, setLatestPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError('')
            try {
                const [postResponse, postsResponse] = await Promise.all([
                    api.get(`/posts/${id}`),
                    api.get('/posts')
                ])

                const currentPost = postResponse?.data?.data || null
                const allPosts = Array.isArray(postsResponse?.data?.data) ? postsResponse.data.data : []
                const normalizedId = String(currentPost?.id || currentPost?.ID || '')
                const sortedLatest = [...allPosts]
                    .filter((item) => String(item.id || item.ID || '') !== normalizedId)
                    .sort((a, b) => {
                        const dateA = new Date(a.created_at || a.CreatedAt || 0).getTime()
                        const dateB = new Date(b.created_at || b.CreatedAt || 0).getTime()
                        return dateB - dateA
                    })
                    .slice(0, 5)

                setPost(currentPost)
                setLatestPosts(sortedLatest)
            } catch (err) {
                setError(err.response?.data?.error || 'Khong the tai bai viet')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [id])

    const getPostValue = (item, key) => item?.[key] || item?.[key.charAt(0).toUpperCase() + key.slice(1)]

    const getFormattedDate = (value) => {
        if (!value) {
            return 'Moi dang'
        }

        const parsedDate = new Date(value)
        if (Number.isNaN(parsedDate.getTime())) {
            return 'Moi dang'
        }

        return parsedDate.toLocaleString('vi-VN')
    }

    const getReadingMinutes = (value) => {
        const text = (value || '').trim()
        if (!text) {
            return 1
        }

        return Math.max(1, Math.ceil(text.split(/\s+/).length / 220))
    }

    const logout = async () => {
        if (isLoggingOut) {
            return
        }

        setIsLoggingOut(true)
        try {
            await api.post('/logout')
        } catch (err) {
            console.error('Logout failed', err)
        } finally {
            localStorage.removeItem('token')
            setIsLoggedIn(false)
            setIsLoggingOut(false)
            navigate('/login')
        }
    }

    return (
        <div className="posts-page">
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="brand">GOBLO</div>

                    <nav className="menu">
                        <Link to="/">Trang chu</Link>
                        <Link to="/posts">Bai viet</Link>
                        <a href="#content">Noi dung</a>
                    </nav>

                    <div className="search-box">
                        <input type="text" placeholder="Tim kiem bai viet" />
                        <button type="button">Search</button>
                    </div>

                    {!isLoggedIn ? (
                        <div className="auth-links">
                            <Link to="/login">Dang nhap</Link>
                            <span>/</span>
                            <Link to="/register">Dang ky</Link>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/posts">Quay lai</Link>
                            <button type="button" className="logout-link" onClick={logout} disabled={isLoggingOut}>
                                {isLoggingOut ? 'Dang xuat...' : 'Dang xuat'}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="posts-layout single-post-layout">
                <section className="posts-main">
                    <article className="card-shell post-detail-card" id="content">
                        {loading ? (
                            <div className="empty-state">Dang tai bai viet...</div>
                        ) : error ? (
                            <div className="empty-state">{error}</div>
                        ) : post ? (
                            <>
                                <div className="detail-header">
                                    <p className="eyebrow">Bai viet chi tiet</p>
                                    <div className="detail-breadcrumb">
                                        <Link to="/">Trang chu</Link>
                                        <span>/</span>
                                        <Link to="/posts">Bai viet</Link>
                                        <span>/</span>
                                        <strong>Chi tiet</strong>
                                    </div>
                                    <h1 className="post-detail-title">{getPostValue(post, 'title')}</h1>
                                    <div className="post-detail-meta">
                                        <p className="meta-line compact">
                                            <strong>{getPostValue(post, 'author') || 'Unknown'}</strong>
                                            <span>{getFormattedDate(getPostValue(post, 'created_at'))}</span>
                                            <span>{getReadingMinutes(getPostValue(post, 'content'))} phut doc</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="detail-divider" />
                                <div className="post-detail-content rich-content">
                                    {String(getPostValue(post, 'content') || '')
                                        .split('\n')
                                        .filter((line) => line.trim().length > 0)
                                        .map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                </div>
                            </>
                        ) : null}
                    </article>
                </section>

                <aside className="posts-sidebar">
                    <section className="card-shell sidebar-card accent-card">
                        <h3>Hanh dong nhanh</h3>
                        <p>Quay lai danh sach hoac mo trang tao bai viet moi.</p>
                        <div className="sidebar-actions">
                            <Link to="/posts" className="btn ghost block-button">Danh sach</Link>
                            <Link to="/posts/new" className="btn solid block-button">Tao bai viet</Link>
                        </div>
                    </section>

                    <section className="card-shell sidebar-card">
                        <h3>Bai viet moi</h3>
                        {latestPosts.length === 0 ? (
                            <p className="auth-subtitle">Chua co bai viet de goi y.</p>
                        ) : (
                            <div className="related-list">
                                {latestPosts.map((item) => (
                                    <article key={item.id || item.ID} className="related-item">
                                        <Link to={`/posts/${item.id || item.ID}`} className="post-link">
                                            {getPostValue(item, 'title')}
                                        </Link>
                                        <small>{getFormattedDate(getPostValue(item, 'created_at'))}</small>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </main>
        </div>
    )
}

export default PostDetail
