import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Wait for Firebase Auth to initialize
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe()
    
    if (requiresAuth && !user) {
      next('/signin')
    } else if (to.path === '/signin' && user) {
      next('/')
    } else {
      next()
    }
  })
})

export default router 