# hadx Simple App

最低限の機能を持つシンプルなVueアプリケーションです。Cognito認証とバックエンドAPIとの連携機能を提供します。

## 機能

- **パブリックページ**: 誰でも閲覧可能なホームページ
- **プロテクトされたページ**: ログイン必須のページ  
- **Cognito認証**: マネージドログインページを使用した認証
- **認証状態管理**: リアクティブな認証状態の管理

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
```bash
cp .env.example .env
```

3. `.env`ファイルを編集してCognito設定とAPIエンドポイントを設定:
```
VUE_APP_API_BASE_URL=https://your-api-gateway-url.com
VUE_APP_COGNITO_LOGIN_URL=https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:8080/auth/callback
VUE_APP_COGNITO_LOGOUT_URL=https://your-cognito-domain.auth.region.amazoncognito.com/logout?client_id=your-client-id&logout_uri=http://localhost:8080
VUE_APP_REDIRECT_URI=http://localhost:8080/auth/callback
```

## 開発サーバーの起動

```bash
npm run serve
```

## 認証フロー

1. ユーザーが「ログイン」ボタンをクリック
2. Cognitoマネージドログインページにリダイレクト
3. ログイン後、認証コードと共に`/auth/callback`にリダイレクト
4. 認証コードを`/api/auth/token`エンドポイントにPOSTしてトークンを取得
5. 認証状態が更新され、プロテクトされたページにアクセス可能

## バックエンド要件

このアプリは以下のAPIエンドポイントを期待しています：

- `POST /api/auth/token`: 認証コードをトークンに交換
- `GET /api/auth/status`: 認証状態を確認  
- `POST /api/auth/logout`: ログアウト

バックエンドは`HadxSampleProject_SAM`を使用してください。

## プロジェクト構成

```
src/
├── config.js              # アプリケーション設定
├── services/
│   └── auth.js            # 認証サービス
├── router/
│   └── index.js           # Vue Router設定
├── views/
│   ├── Home.vue           # ホームページ（パブリック）
│   ├── Protected.vue      # プロテクトされたページ
│   └── AuthCallback.vue   # 認証コールバック処理
├── App.vue                # メインアプリケーション
└── main.js                # エントリーポイント
```

