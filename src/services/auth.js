import axios from 'axios'
import { config } from '../config'
import { reactive } from 'vue'

// 認証状態管理
export const authState = reactive({
  isAuthenticated: false,
  user: null,
  loading: false
})

// Axiosインスタンス設定
const api = axios.create({
  baseURL: config.api.baseURL,
  withCredentials: true // Cookieを含める
})

// 認証サービス
export const authService = {
  // 認証コードをトークンに交換
  async exchangeCodeForToken(code) {
    console.log('🔄 認証コード交換開始:', code)
    console.log('📡 API_BASE_URL:', config.api.baseURL)
    console.log('🎯 tokenExchange endpoint:', config.api.endpoints.tokenExchange)
    console.log('🔗 完全なURL:', config.api.baseURL + config.api.endpoints.tokenExchange)
    
    try {
      authState.loading = true
      
      const payload = { 
        code: code
        // redirect_uri は不要（バックエンドが独自の値を使用）
      }
      console.log('📤 送信データ:', payload)
      
      console.log('🚀 POSTリクエスト送信中...')
      const response = await api.post(config.api.endpoints.tokenExchange, payload)
      
      console.log('✅ トークン交換成功:', response.data)
      console.log('📊 レスポンスステータス:', response.status)
      
      // 認証状態を更新
      await this.checkAuthStatus()
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ トークン交換エラー詳細:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      })
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'トークン交換に失敗しました' 
      }
    } finally {
      authState.loading = false
    }
  },

  // 認証状態をチェック
  async checkAuthStatus() {
    console.log('認証状態チェック開始')
    
    try {
      authState.loading = true
      
      const response = await api.get(config.api.endpoints.authStatus)
      
      console.log('認証状態レスポンス:', response.data)
      
      authState.isAuthenticated = response.data.authenticated
      authState.user = response.data.user
      
      return response.data
    } catch (error) {
      console.error('認証状態チェックエラー:', error)
      authState.isAuthenticated = false
      authState.user = null
      return { authenticated: false, user: null }
    } finally {
      authState.loading = false
    }
  },

  // ログアウト
  async logout() {
    console.log('ログアウト開始')
    
    try {
      authState.loading = true
      
      // バックエンドでCognitoサインアウト & Cookie削除
      await api.post(config.api.endpoints.logout)
      
      console.log('ログアウト完了')
      
    } catch (error) {
      console.error('ログアウトエラー:', error)
    } finally {
      // ローカル状態をクリア（成功・失敗関係なく）
      authState.isAuthenticated = false
      authState.user = null
      authState.loading = false
      
      // ホームページにリダイレクト（バックエンドで既にCognitoサインアウト済み）
      console.log('ホームページにリダイレクト')
      window.location.href = '/'
    }
  },

  // Cognitoログインページにリダイレクト
  redirectToLogin() {
    console.log('Cognitoログインページにリダイレクト')
    window.location.href = config.cognito.loginURL
  }
}

// サンプルAPIサービス
export const apiService = {
  // サンプルAPIを呼び出し
  async fetchSample() {
    console.log('サンプルAPI呼び出し開始')
    
    try {
      const response = await api.get(config.api.endpoints.sample)
      
      console.log('サンプルAPIレスポンス:', response.data)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('サンプルAPIエラー:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'サンプルAPIの呼び出しに失敗しました' 
      }
    }
  }
} 