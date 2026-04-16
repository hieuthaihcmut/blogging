import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { posts, questions, topWriters } from '../data/mockContent'

function Home() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')))
  }, [])

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
            <a href="#">Bai Viet</a>
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
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-head">
                <img src={post.avatar} alt={post.author} className="avatar" />
                <div>
                  <p className="meta-line">
                    <strong>{post.author}</strong>
                    <span>{post.time}</span>
                    <span>{post.read}</span>
                  </p>
                  <h2>{post.title}</h2>
                </div>
              </div>

              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="stats">
                <span>Views {post.views}</span>
                <span>Bookmarks {post.bookmarks}</span>
                <span>Comments {post.comments}</span>
              </div>
            </article>
          ))}
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
