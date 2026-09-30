import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthed } from '@/store/auth'
import { setMockSpeed } from '@/store/work'

/* 路由规划 -> 关于管理档案馆登录 */
const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/HomeView.vue') },
  { path: '/works', name: 'works', component: () => import('@/pages/WorkListView.vue') },
  {
    path: '/works/:id',
    name: 'work-detail',
    component: () => import('@/pages/WorkDetailView.vue'),
  },
  { path: '/about', name: 'about', component: () => import('@/pages/AboutView.vue') },
  { path: '/login', name: 'login', component: () => import('@/pages/LoginView.vue') },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/AdminPreviewView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  // 自动化验证时用?mock=fast关掉模拟延迟,不影响正常浏览
  setMockSpeed(to.query.mock === 'fast')

  // 游客不允许进入管理档案馆
  if (to.meta.requiresAuth && !isAuthed.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 已登录再访问登录页，直接进后台
  if (to.name === 'login' && isAuthed.value) {
    return { name: 'admin' }
  }
  return true
})
