import './assets/main.css'
import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { VueFire, VueFireAuth, getCurrentUser } from 'vuefire'
import App from './App.vue'
import { firebaseApp } from './firebase.js'
import Landing from './MyComponents/landing.vue'
import Recordatorios from './MyComponents/Recordatorios.vue'
import Login from './MyComponents/login.vue'
import Premium from './MyComponents/Premium.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Landing }, { path: '/Recordatorios', component: Recordatorios, meta: { requireAuth: true } }, { path: '/login', component: Login }, { path: '/focus', component: Premium, meta: { requireAuth: true } }],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
router.beforeEach(async (to) => {
  const user = await getCurrentUser()
  if (to.meta.requireAuth && !user) return '/login'
  if (to.path === '/login' && user) return '/Recordatorios'
})

createApp(App).use(VueFire, { firebaseApp, modules: [VueFireAuth()] }).use(router).mount('#app')
