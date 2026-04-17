import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const emptyForm = {
    title: '',
    content: ''
}

function PostEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = useMemo(() => Boolean(id), [id])

    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem('token')))
    }, [])

    useEffect(() => {
        if (!isEditing) {
            setForm(emptyForm)
            setLoading(false)
            return
        }

        const loadPost = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await api.get(`/posts/${id}`)
                const post = response?.data?.data || {}
                setForm({
                    title: post.title || post.Title || '',
                    content: post.content || post.Content || ''
                })
            } catch (err) {
                setError(err.response?.data?.error || 'Khong the tai bai viet de chinh sua')
            } finally {
                setLoading(false)
            }
        }

        loadPost()
    }, [id, isEditing])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!isLoggedIn) {
            setError('Ban can dang nhap de dang bai hoac chinh sua bai viet')
            return
        }

        if (saving) {
            return
        }

        const payload = {
            title: form.title.trim(),
            content: form.content.trim()
        }

        if (!payload.title || !payload.content) {
            setError('Vui long nhap day du tieu de va noi dung')
            return
        }

        setSaving(true)
        setError('')

        try {
            if (isEditing) {
                await api.put(`/posts/${id}`, payload)
                navigate(`/posts/${id}`)
                return
            }

            const response = await api.post('/posts', payload)
            const newPost = response?.data?.data || {}
            const newID = newPost.id || newPost.ID
            navigate(newID ? `/posts/${newID}` : '/posts')
        } catch (err) {
            setError(err.response?.data?.error || 'Khong the luu bai viet')
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
                        <Link to={isEditing ? `/posts/${id}` : '/posts/new'}>{isEditing ? 'Chi tiet' : 'Tao moi'}</Link>
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
                            <Link to="/posts">Danh sach</Link>
                            <button type="button" className="logout-link" onClick={logout} disabled={isLoggingOut}>
                                {isLoggingOut ? 'Dang xuat...' : 'Dang xuat'}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="posts-layout single-post-layout">
                <section className="posts-main">
                    <section className="card-shell post-editor-page">
                        <div className="section-head">
                            <div>
                                <p className="eyebrow">Trinh bien tap</p>
                                <h2>{isEditing ? 'Chinh sua bai viet' : 'Tao bai viet moi'}</h2>
                                <p>{isEditing ? 'Cap nhat lai tieu de va noi dung bai viet.' : 'Nhap thong tin de dang bai moi len he thong.'}</p>
                            </div>
                            <Link to="/posts" className="secondary-button post-view-button">Quay lai danh sach</Link>
                        </div>

                        {loading ? (
                            <div className="empty-state">Dang tai du lieu bai viet...</div>
                        ) : !isLoggedIn ? (
                            <div className="login-prompt">
                                <p>Ban chua dang nhap. Dang nhap de dang bai va chinh sua bai viet.</p>
                                <div className="prompt-actions">
                                    <Link to="/login" className="btn ghost">Dang nhap</Link>
                                    <Link to="/register" className="btn solid">Dang ky</Link>
                                </div>
                            </div>
                        ) : (
                            <form className="post-form" onSubmit={handleSubmit}>
                                <label>
                                    Tieu de
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Nhap tieu de bai viet"
                                        required
                                    />
                                </label>

                                <label>
                                    Noi dung
                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows="12"
                                        placeholder="Nhap noi dung bai viet"
                                        required
                                    />
                                </label>

                                <div className="form-actions editor-form-actions">
                                    <button type="button" className="secondary-button" onClick={() => navigate('/posts')} disabled={saving}>
                                        Huy
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={saving}>
                                        {saving ? 'Dang luu...' : isEditing ? 'Cap nhat bai viet' : 'Dang bai'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {error ? <p className="error-text mt-12">{error}</p> : null}
                    </section>
                </section>

                <aside className="posts-sidebar">
                    <section className="card-shell sidebar-card accent-card">
                        <h3>Huong dan</h3>
                        <ul>
                            <li>Tieu de nen ngan gon, ro y chinh.</li>
                            <li>Noi dung co the xuong dong de de doc hon.</li>
                            <li>Sau khi luu, he thong se chuyen den trang chi tiet.</li>
                        </ul>
                    </section>
                </aside>
            </main>
        </div>
    )
}

export default PostEditor
