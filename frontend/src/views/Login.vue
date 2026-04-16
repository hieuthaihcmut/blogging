<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">{{ success }}</p>
      </form>
      <p class="link">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async login() {
      if (this.loading) {
        return
      }

      this.error = ''
      this.success = ''
      this.loading = true
      try {
        const response = await api.post('/login', this.form)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          this.success = response.data.message || 'Login successful!'
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit:hover {
  background-color: #764ba2;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: #27ae60;
  margin-top: 1rem;
  text-align: center;
}

.link {
  text-align: center;
  margin-top: 1rem;
}

.link a {
  color: #667eea;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>
