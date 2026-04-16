<template>
  <div class="home-page">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">GOBLO</div>

        <nav class="menu">
          <a href="#">Bai Viet</a>
          <a href="#">Hoi dap</a>
          <a href="#">Thao luan</a>
        </nav>

        <div class="search-box">
          <input type="text" placeholder="Tim kiem tren Viblo" />
          <button type="button">Search</button>
        </div>

        <div v-if="!isLoggedIn" class="auth-links">
          <router-link to="/login">Dang nhap</router-link>
          <span>/</span>
          <router-link to="/register">Dang ky</router-link>
        </div>

        <div v-else class="auth-links">
          <span>Xin chao</span>
          <button type="button" class="logout-link" @click="logout" :disabled="isLoggingOut">
            {{ isLoggingOut ? 'Dang xuat...' : 'Dang xuat' }}
          </button>
        </div>
      </div>
    </header>

    <main class="layout">
      <section class="feed">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-head">
            <img :src="post.avatar" :alt="post.author" class="avatar" />
            <div>
              <p class="meta-line">
                <strong>{{ post.author }}</strong>
                <span>{{ post.time }}</span>
                <span>{{ post.read }}</span>
              </p>
              <h2>{{ post.title }}</h2>
            </div>
          </div>

          <div class="tags">
            <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
          </div>

          <div class="stats">
            <span>Views {{ post.views }}</span>
            <span>Bookmarks {{ post.bookmarks }}</span>
            <span>Comments {{ post.comments }}</span>
          </div>
        </article>
      </section>

      <aside class="sidebar">
        <section class="panel">
          <h3>Cau hoi moi nhat</h3>
          <div v-for="item in questions" :key="item.id" class="question-item">
            <p>{{ item.title }}</p>
            <small>{{ item.author }}</small>
          </div>
        </section>

        <section class="panel">
          <h3>Cac tac gia hang dau</h3>
          <div v-for="writer in topWriters" :key="writer.id" class="writer-item">
            <img :src="writer.avatar" :alt="writer.name" class="writer-avatar" />
            <div>
              <p>{{ writer.name }}</p>
              <small>{{ writer.followers }} followers</small>
            </div>
          </div>
        </section>
      </aside>
    </main>

    <div v-if="!isLoggedIn" class="floating-auth">
      <router-link to="/login" class="btn ghost">Login</router-link>
      <router-link to="/register" class="btn solid">Register</router-link>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      isLoggedIn: false,
      isLoggingOut: false,
      posts: [
        {
          id: 1,
          author: 'Nguyen Huy Hoang',
          time: '1 gio truoc',
          read: '7 phut doc',
          title: 'Nghe thuat Key-Value: Dung bien Redis thanh bai rac tri gia tram trieu',
          tags: ['database', 'redis', 'systemdesign'],
          views: 4,
          bookmarks: 0,
          comments: 1,
          avatar: 'https://i.pravatar.cc/80?img=12'
        },
        {
          id: 2,
          author: 'Nguyen Huy Hoang',
          time: '5 phut truoc',
          read: '4 phut doc',
          title: 'Visual Studio Code 1.116: Copilot duoc tich hop sau va ky nguyen AI Agent',
          tags: ['vscode', 'agenticai', 'update'],
          views: 13,
          bookmarks: 0,
          comments: 1,
          avatar: 'https://i.pravatar.cc/80?img=14'
        },
        {
          id: 3,
          author: 'Nguyen Huy Hoang',
          time: '1 gio truoc',
          read: '7 phut doc',
          title: 'Giai phau in-memory database: Tai sao RAM danh bai moi o cung SSD?',
          tags: ['architecture', 'database', 'redis'],
          views: 18,
          bookmarks: 0,
          comments: 5,
          avatar: 'https://i.pravatar.cc/80?img=18'
        },
        {
          id: 4,
          author: 'Nguyen Huy Hoang',
          time: '4 gio truoc',
          read: '7 phut doc',
          title: 'Nghe thuat viet test: Dung de hai banh rang xin ghep vao nhau lai bi ket',
          tags: ['testing', 'engineering', 'unit-test'],
          views: 21,
          bookmarks: 0,
          comments: 1,
          avatar: 'https://i.pravatar.cc/80?img=20'
        }
      ],
      questions: [
        {
          id: 1,
          title: 'Why do many experienced project managers fail the PMP exam first try?',
          author: 'Russell Walker'
        },
        {
          id: 2,
          title: 'Tu dong phan loai van ban va tao cong viec tu he thong quan ly van ban bang AI?',
          author: 'Nguyen Thu Ha'
        },
        {
          id: 3,
          title: 'Learning path cho Security Engineer',
          author: 'Sea Anh'
        }
      ],
      topWriters: [
        {
          id: 1,
          name: 'Infinity',
          followers: '1.9k',
          avatar: 'https://i.pravatar.cc/80?img=30'
        },
        {
          id: 2,
          name: 'Nguyen Dinh Long',
          followers: '1.4k',
          avatar: 'https://i.pravatar.cc/80?img=33'
        }
      ]
    }
  },
  mounted() {
    this.isLoggedIn = !!localStorage.getItem('token')
  },
  methods: {
    async logout() {
      if (this.isLoggingOut) {
        return
      }

      this.isLoggingOut = true
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout failed', error)
      } finally {
        localStorage.removeItem('token')
        this.isLoggedIn = false
        this.isLoggingOut = false
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f3f7fc 0%, #f7f8fb 45%, #fbfcfe 100%);
  color: #1f2d3d;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #ffffff;
  border-bottom: 1px solid #d8e2ec;
}

.topbar-inner {
  max-width: 1220px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}

.brand {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #4f79bf;
}

.menu {
  display: flex;
  gap: 1.1rem;
}

.menu a {
  text-decoration: none;
  color: #2d3d51;
  font-weight: 600;
  font-size: 0.95rem;
}

.search-box {
  display: flex;
  border: 1px solid #c6d5e6;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.search-box input {
  flex: 1;
  border: 0;
  outline: none;
  padding: 0.65rem 0.8rem;
  font-size: 0.95rem;
}

.search-box button {
  border: 0;
  background: #3f80cf;
  color: #fff;
  padding: 0 1rem;
  font-weight: 600;
  cursor: pointer;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.92rem;
}

.auth-links a {
  color: #2f63a6;
  text-decoration: none;
  font-weight: 600;
}

.logout-link {
  border: 0;
  background: transparent;
  color: #2f63a6;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.logout-link:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.layout {
  max-width: 1220px;
  margin: 1.25rem auto;
  padding: 0 1rem 5rem;
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(260px, 1fr);
  gap: 1.25rem;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.post-card {
  background: #fff;
  border: 1px solid #d8e2ec;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 8px 18px rgba(58, 89, 140, 0.07);
}

.post-head {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.meta-line {
  margin: 0;
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  color: #6b7f95;
  font-size: 0.85rem;
}

.post-card h2 {
  margin: 0.35rem 0 0;
  font-size: 1.45rem;
  line-height: 1.3;
}

.tags {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tags span {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #eef4fb;
  border: 1px solid #d4e1f1;
  color: #55739a;
  font-size: 0.78rem;
}

.stats {
  margin-top: 0.85rem;
  display: flex;
  gap: 0.95rem;
  color: #61788f;
  font-size: 0.84rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel {
  background: #fff;
  border: 1px solid #d8e2ec;
  border-radius: 10px;
  padding: 1rem;
}

.panel h3 {
  margin: 0 0 0.8rem;
  color: #4a74a4;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.03em;
}

.question-item + .question-item,
.writer-item + .writer-item {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e6edf5;
}

.question-item p {
  margin: 0;
  line-height: 1.35;
  font-size: 0.95rem;
}

.question-item small {
  color: #7690ac;
}

.writer-item {
  display: flex;
  gap: 0.7rem;
  align-items: center;
}

.writer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.writer-item p {
  margin: 0;
  font-weight: 600;
}

.writer-item small {
  color: #6f86a0;
}

.floating-auth {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn {
  text-decoration: none;
  padding: 0.55rem 0.95rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
}

.btn.ghost {
  border: 1px solid #8da8c9;
  color: #2e5788;
  background: #f7fbff;
}

.btn.solid {
  background: #2f78cd;
  border: 1px solid #2f78cd;
  color: #fff;
}

@media (max-width: 1080px) {
  .topbar-inner {
    grid-template-columns: auto 1fr auto;
  }

  .menu {
    display: none;
  }

  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .topbar-inner {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .auth-links {
    justify-content: flex-end;
  }

  .post-card h2 {
    font-size: 1.08rem;
  }

  .stats {
    flex-wrap: wrap;
  }
}
</style>
