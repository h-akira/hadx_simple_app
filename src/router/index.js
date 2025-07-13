import { createRouter, createWebHistory } from 'vue-router'
import { authState, authService } from '../services/auth'

// ページコンポーネントをインポート
import Home from '../views/Home.vue'
import Protected from '../views/Protected.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/protected',
    name: 'Protected', 
    component: Protected,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 認証ガード
router.beforeEach(async (to, from, next) => {
  console.log('ルートガード:', { to: to.path, requiresAuth: to.meta.requiresAuth })
  
  // 認証が必要なページの場合
  if (to.meta.requiresAuth) {
    // 認証状態がまだ確認されていない場合はチェック
    if (!authState.isAuthenticated) {
      await authService.checkAuthStatus()
    }
    
    // 認証されていない場合はログインページにリダイレクト
    if (!authState.isAuthenticated) {
      console.log('未認証のため、ログインページにリダイレクト')
      authService.redirectToLogin()
      return
    }
  }
  
  next()
})

export default router 