import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/register', {
        username: form.username,
        email: form.email,
        password: form.password
      })

      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">GOBLO</div>
        <h1>Dang ky</h1>
        <p className="auth-subtitle">Tao tai khoan moi de bat dau su dung blog.</p>

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
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Nhap email"
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

          <label>
            Confirm Password
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Nhap lai password"
              required
            />
          </label>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Dang tao tai khoan...' : 'Dang ky'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {success ? <p className="success-text">{success}</p> : null}
        </form>

        <p className="auth-link">
          Da co tai khoan? <Link to="/login">Dang nhap</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
