import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post('/login', form)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        setSuccess(response.data.message || 'Login successful!')
        setTimeout(() => {
          navigate('/')
        }, 1000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">GOBLO</div>
        <h1>Dang nhap</h1>
        <p className="auth-subtitle">Ket noi backend de quan ly tai khoan cua ban.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="Nhap username"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Nhap password"
              required
            />
          </label>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>

        <p className="auth-link">
          Chua co tai khoan? <Link to="/register">Dang ky ngay</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
