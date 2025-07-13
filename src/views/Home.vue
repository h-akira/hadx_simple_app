<template>
  <div>
    <h1>ホームページ</h1>
    <p>このページは誰でも見ることができます。</p>
    
    <nav>
      <ul>
        <li><router-link to="/">ホーム</router-link></li>
        <li><router-link to="/protected">プロテクトされたページ</router-link></li>
      </ul>
    </nav>
    
    <div v-if="authState.loading">
      <p>読み込み中...</p>
    </div>
    
    <div v-else>
      <div v-if="authState.isAuthenticated">
        <h2>ログイン済み</h2>
        <p>ユーザー名: {{ authState.user?.['cognito:username'] || 'N/A' }}</p>
        <p>メール: {{ authState.user?.email || 'N/A' }}</p>
        <button @click="logout">ログアウト</button>
      </div>
      
      <div v-else>
        <h2>未ログイン</h2>
        <button @click="login">ログイン</button>
        <button @click="signup" style="margin-left: 10px;">サインアップ</button>
      </div>
    </div>
    
    <!-- サンプルAPI機能 -->
    <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <h2>サンプルAPI機能</h2>
      <button @click="fetchSampleData" :disabled="sampleState.loading">
        {{ sampleState.loading ? '読み込み中...' : 'サンプルデータを取得' }}
      </button>
      
      <div v-if="sampleState.data" style="margin-top: 10px;">
        <h3>取得したデータ:</h3>
        <p><strong>メッセージ:</strong> {{ sampleState.data.message }}</p>
      </div>
      
      <div v-if="sampleState.error" style="margin-top: 10px; color: red;">
        <p><strong>エラー:</strong> {{ sampleState.error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authState, authService, apiService } from '../services/auth'
import { onMounted, reactive } from 'vue'

export default {
  name: 'Home',
  setup() {
    // サンプルAPI状態管理
    const sampleState = reactive({
      data: null,
      loading: false,
      error: null
    })
    // 認証コード処理とステータスチェック
    onMounted(async () => {
      // URLパラメータから認証コードをチェック
      const urlParams = new URLSearchParams(window.location.search)
      const authCode = urlParams.get('code')
      
      if (authCode && !authState.isAuthenticated) {
        console.log('🔑 認証コード検出:', authCode)
        console.log('🔄 トークン交換を開始')
        
        try {
          const result = await authService.exchangeCodeForToken(authCode)
          
          if (result.success) {
            console.log('✅ 認証成功！URLをクリーンアップ')
            // URLから認証コードを削除（履歴を汚さないようにreplace）
            window.history.replaceState({}, '', window.location.pathname)
          } else {
            console.error('❌ 認証失敗:', result.error)
          }
        } catch (error) {
          console.error('💥 認証処理エラー:', error)
        }
      } else {
        // 通常の認証状態チェック
        await authService.checkAuthStatus()
      }
    })
    
    const login = () => {
      authService.redirectToLogin()
    }
    
    const signup = () => {
      authService.redirectToSignup()
    }
    
    const logout = async () => {
      await authService.logout()
    }
    
    // サンプルデータを取得
    const fetchSampleData = async () => {
      console.log('サンプルデータ取得開始')
      
      sampleState.loading = true
      sampleState.error = null
      
      try {
        const result = await apiService.fetchSample()
        
        if (result.success) {
          sampleState.data = result.data
          console.log('サンプルデータ取得成功:', result.data)
        } else {
          sampleState.error = result.error
          console.error('サンプルデータ取得失敗:', result.error)
        }
      } catch (error) {
        sampleState.error = error.message || 'サンプルデータの取得に失敗しました'
        console.error('サンプルデータ取得エラー:', error)
      } finally {
        sampleState.loading = false
      }
    }
    
    return {
      authState,
      login,
      signup,
      logout,
      sampleState,
      fetchSampleData
    }
  }
}
</script> 