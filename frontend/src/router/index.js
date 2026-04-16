import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token')
    const publicPages = ['/', '/login', '/register']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !isLoggedIn) {
        next('/login')
    } else {
        next()
    }
})

export default router
