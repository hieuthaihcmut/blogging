<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            placeholder="Choose a username"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="Enter your email"
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
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">{{ success }}</p>
      </form>
      <p class="link">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async register() {
      if (this.loading) {
        return
      }

      this.error = ''
      this.success = ''

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }

      this.loading = true

      try {
        await api.post('/register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })
        this.success = 'Registration successful! Redirecting to login...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-form h2 {
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
