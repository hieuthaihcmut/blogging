import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { questions, topWriters } from '../data/mockContent'

function Home() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState('')

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')))
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true)
      setPostsError('')
      try {
        const response = await api.get('/posts')
        const apiPosts = Array.isArray(response?.data?.data) ? response.data.data : []
        const sortedPosts = [...apiPosts].sort((a, b) => {
          const dateA = new Date(a.created_at || a.CreatedAt || 0).getTime()
          const dateB = new Date(b.created_at || b.CreatedAt || 0).getTime()
          return dateB - dateA
        })
        setPosts(sortedPosts)
      } catch (error) {
        setPostsError(error.response?.data?.error || 'Khong the tai danh sach bai viet')
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (value) => {
    if (!value) {
      return 'Moi dang'
    }

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Moi dang'
    }

    return parsedDate.toLocaleString('vi-VN')
  }

  const getExcerpt = (value) => {
    if (!value) {
      return 'Bai viet chua co noi dung xem truoc.'
    }

    return value.length > 220 ? `${value.slice(0, 220)}...` : value
  }

  const logout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setIsLoggingOut(false)
      navigate('/login')
    }
  }

  return (
    <div className="home-page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">GOBLO</div>

          <nav className="menu">
            <Link to="/posts">Bai Viet</Link>
            <a href="#">Hoi dap</a>
            <a href="#">Thao luan</a>
          </nav>

          <div className="search-box">
            <input type="text" placeholder="Tim kiem tren Viblo" />
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
              <span>Xin chao</span>
              <button type="button" className="logout-link" onClick={logout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Dang xuat...' : 'Dang xuat'}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="layout">
        <section className="feed">
          <div className="panel">
            <h3>Bai viet moi nhat</h3>
          </div>

          {loadingPosts ? (
            <div className="empty-state">Dang tai bai viet moi nhat...</div>
          ) : postsError ? (
            <div className="empty-state">{postsError}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">Chua co bai viet nao duoc dang.</div>
          ) : (
            posts.map((post) => (
              <article key={post.id || post.ID} className="post-item">
                <div>
                  <p className="meta-line">
                    <strong>{post.author || post.Author || 'Unknown'}</strong>
                    <span>{formatDate(post.created_at || post.CreatedAt)}</span>
                  </p>
                  <h2>
                    <Link to={`/posts/${post.id || post.ID}`} className="post-link">
                      {post.title || post.Title}
                    </Link>
                  </h2>
                  <p className="post-preview">{getExcerpt(post.content || post.Content)}</p>
                  <Link to={`/posts/${post.id || post.ID}`} className="post-preview-link">
                    Xem chi tiet
                  </Link>
                </div>

                <div className="post-item-actions">
                  <span className="post-badge">Moi nhat</span>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="sidebar">
          <section className="panel">
            <h3>Cau hoi moi nhat</h3>
            {questions.map((item) => (
              <div key={item.id} className="question-item">
                <p>{item.title}</p>
                <small>{item.author}</small>
              </div>
            ))}
          </section>

          <section className="panel">
            <h3>Cac tac gia hang dau</h3>
            {topWriters.map((writer) => (
              <div key={writer.id} className="writer-item">
                <img src={writer.avatar} alt={writer.name} className="writer-avatar" />
                <div>
                  <p>{writer.name}</p>
                  <small>{writer.followers} followers</small>
                </div>
              </div>
            ))}
          </section>
        </aside>
      </main>

      {!isLoggedIn ? (
        <div className="floating-auth">
          <Link to="/login" className="btn ghost">Login</Link>
          <Link to="/register" className="btn solid">Register</Link>
        </div>
      ) : null}
    </div>
  )
}

export default Home
