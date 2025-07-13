<template>
  <div>
    <h1>プロテクトされたページ</h1>
    <p>このページはログイン済みのユーザーのみ見ることができます。</p>
    
    <nav>
      <ul>
        <li><router-link to="/">ホーム</router-link></li>
        <li><router-link to="/protected">プロテクトされたページ</router-link></li>
      </ul>
    </nav>
    
    <div v-if="authState.loading">
      <p>読み込み中...</p>
    </div>
    
    <div v-else-if="authState.isAuthenticated">
      <h2>ユーザー情報</h2>
      <div>
        <p><strong>ユーザー名:</strong> {{ authState.user?.['cognito:username'] || 'N/A' }}</p>
        <p><strong>メール:</strong> {{ authState.user?.email || 'N/A' }}</p>
        <p><strong>メール認証:</strong> {{ authState.user?.email_verified ? '済み' : '未認証' }}</p>
        <p><strong>サブ:</strong> {{ authState.user?.sub || 'N/A' }}</p>
      </div>
      
      <h2>プロテクトされた機能</h2>
      <p>ここには認証済みユーザーのみがアクセスできる機能やコンテンツが表示されます。</p>
      
      <button @click="logout">ログアウト</button>
    </div>
    
    <div v-else>
      <p>認証されていません。ログインしてください。</p>
      <button @click="login">ログイン</button>
    </div>
  </div>
</template>

<script>
import { authState, authService } from '../services/auth'

export default {
  name: 'Protected',
  setup() {
    const login = () => {
      authService.redirectToLogin()
    }
    
    const logout = async () => {
      await authService.logout()
    }
    
    return {
      authState,
      login,
      logout
    }
  }
}
</script> 