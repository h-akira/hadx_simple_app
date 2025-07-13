// アプリケーション設定
export const config = {
  // API設定
  api: {
    baseURL: '',
    endpoints: {
      tokenExchange: '/api/auth/token',
      authStatus: '/api/auth/status', 
      logout: '/api/auth/logout',
      sample: '/api/sample'
    }
  },
  
  // Cognito設定
  cognito: {
    // CognitoマネージドログインページのURL
    loginURL: 'https://ap-northeast-1zswtfdq5h.auth.ap-northeast-1.amazoncognito.com/login?client_id=1md2ve7n7lbl7bohnn37vemeln&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fhadx.h-akira.net'
    // 注意: redirect_uriやlogout処理は全てバックエンド設定で管理される
  }
} 