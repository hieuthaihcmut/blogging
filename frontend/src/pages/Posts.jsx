import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Posts() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const getPostId = (post) => post.id || post.ID
    const getPostTitle = (post) => post.title || post.Title || 'Chua co tieu de'
    const getPostContent = (post) => post.content || post.Content || ''
    const getPostAuthor = (post) => post.author || post.Author || 'Unknown'
    const getPostCreatedAt = (post) => post.created_at || post.CreatedAt

    const loadPosts = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await api.get('/posts')
            const fetchedPosts = Array.isArray(response?.data?.data) ? response.data.data : []
            const sortedPosts = [...fetchedPosts].sort((a, b) => {
                const dateA = new Date(getPostCreatedAt(a) || 0).getTime()
                const dateB = new Date(getPostCreatedAt(b) || 0).getTime()
                return dateB - dateA
            })
            setPosts(sortedPosts)
        } catch (err) {
            setError(err.response?.data?.error || 'Khong the tai danh sach bai viet')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    const handleDelete = async (post) => {
        const postID = getPostId(post)
        if (!postID) {
            setError('Khong the xoa bai viet vi thieu ID')
            return
        }

        if (!window.confirm('Ban co chac muon xoa bai viet nay khong?')) {
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        try {
            await api.delete(`/posts/${postID}`)
            setSuccess('Da xoa bai viet thanh cong')
            await loadPosts()
        } catch (err) {
            setError(err.response?.data?.error || 'Khong the xoa bai viet')
        } finally {
            setSaving(false)
        }
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
                        <Link to="/posts/new">Tao moi</Link>
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
                            <Link to="/">Home</Link>
                            <button type="button" className="logout-link" onClick={logout} disabled={isLoggingOut}>
                                {isLoggingOut ? 'Dang xuat...' : 'Dang xuat'}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="posts-layout">
                <section className="posts-main">
                    <div className="posts-hero card-shell">
                        <div>
                            <p className="eyebrow">Backend postcontroller</p>
                            <h1>Quan ly bai viet</h1>
                            <p>Danh sach bai viet moi nhat va cac thao tac xem, sua, xoa, tao moi tren endpoint /api/posts.</p>
                        </div>
                        <div className="posts-hero-stats">
                            <div>
                                <strong>{posts.length}</strong>
                                <span>Bai viet</span>
                            </div>
                            <div>
                                <strong>{isLoggedIn ? 'On' : 'Off'}</strong>
                                <span>Auth</span>
                            </div>
                        </div>
                    </div>

                    <div className="top-action-row">
                        <Link to="/posts/new" className="btn solid">Tao bai viet</Link>
                        <button type="button" className="secondary-button" onClick={loadPosts} disabled={loading}>
                            {loading ? 'Dang tai...' : 'Tai lai danh sach'}
                        </button>
                    </div>

                    <section className="card-shell post-list-shell">
                        <div className="section-head">
                            <div>
                                <h2>Danh sach bai viet</h2>
                                <p>Du lieu lay truc tiep tu backend qua GET /api/posts va sap xep bai moi nhat len tren.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="empty-state">Dang tai danh sach bai viet...</div>
                        ) : posts.length === 0 ? (
                            <div className="empty-state">Chua co bai viet nao.</div>
                        ) : (
                            <div className="post-list">
                                {posts.map((post) => {
                                    const postID = getPostId(post)
                                    return (
                                        <article key={postID} className="post-item">
                                            <div className="post-item-main">
                                                <div className="post-item-head">
                                                    <div>
                                                        <p className="meta-line compact">
                                                            <strong>{getPostAuthor(post)}</strong>
                                                            <span>{getPostCreatedAt(post) ? new Date(getPostCreatedAt(post)).toLocaleString('vi-VN') : 'Moi tao'}</span>
                                                        </p>
                                                        <h3>
                                                            <Link to={`/posts/${postID}`} className="post-link">
                                                                {getPostTitle(post)}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <span className="post-badge">#{String(postID).slice(0, 8)}</span>
                                                </div>
                                                <Link to={`/posts/${postID}`} className="post-preview post-preview-link">
                                                    {getPostContent(post)}
                                                </Link>
                                            </div>

                                            <div className="post-item-actions">
                                                <Link to={`/posts/${postID}`} className="secondary-button post-view-button">
                                                    Xem
                                                </Link>
                                                <Link to={`/posts/${postID}/edit`} className="secondary-button post-view-button">
                                                    Sua
                                                </Link>
                                                <button type="button" className="danger-button" onClick={() => handleDelete(post)} disabled={!isLoggedIn || saving}>
                                                    Xoa
                                                </button>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>

                    {error ? <p className="error-text mt-12">{error}</p> : null}
                    {success ? <p className="success-text mt-12">{success}</p> : null}
                </section>

                <aside className="posts-sidebar">
                    <section className="card-shell sidebar-card">
                        <h3>Huong dan nhanh</h3>
                        <ul>
                            <li>GET /api/posts: lay tat ca bai viet</li>
                            <li>POST /api/posts: tao bai viet moi</li>
                            <li>PUT /api/posts/:id: cap nhat bai viet</li>
                            <li>DELETE /api/posts/:id: xoa bai viet</li>
                        </ul>
                    </section>

                    <section className="card-shell sidebar-card accent-card">
                        <h3>Trang thai auth</h3>
                        <p>{isLoggedIn ? 'Da dang nhap. Co the tao, sua, xoa bai viet.' : 'Chua dang nhap. Hay dang nhap de su dung day du chuc nang.'}</p>
                        <Link to={isLoggedIn ? '/posts/new' : '/login'} className="btn solid block-button">
                            {isLoggedIn ? 'Tao bai viet moi' : 'Dang nhap ngay'}
                        </Link>
                    </section>
                </aside>
            </main>
        </div>
    )
}

export default Posts
