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
    // CognitoマネージドログインページのURL（環境変数から取得）
    loginURL: (() => {
      const loginURL = process.env.VUE_APP_COGNITO_LOGIN_URL;
      if (!loginURL) {
        throw new Error('環境変数 VUE_APP_COGNITO_LOGIN_URL が設定されていません');
      }
      return loginURL;
    })(),
    // CognitoマネージドサインアップページのURL（環境変数から取得）
    signupURL: (() => {
      const signupURL = process.env.VUE_APP_COGNITO_SIGNUP_URL;
      if (!signupURL) {
        throw new Error('環境変数 VUE_APP_COGNITO_SIGNUP_URL が設定されていません');
      }
      return signupURL;
    })()
    // 注意: redirect_uriやlogout処理は全てバックエンド設定で管理される
  }
} 