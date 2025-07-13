# hadx Simple App

最低限の機能を持つシンプルなVueアプリケーションです。Cognito認証とバックエンドAPIとの連携機能を提供します。

## 機能

- **パブリックページ**: 誰でも閲覧可能なホームページ
- **プロテクトされたページ**: ログイン必須のページ  
- **Cognito認証**: マネージドログインページを使用した認証
- **認証状態管理**: リアクティブな認証状態の管理

## 環境変数の設定

このアプリケーションは以下の環境変数を使用します：

- `VUE_APP_COGNITO_LOGIN_URL`: CognitoのログインページURL（必須）

### 1. ローカル開発時の環境変数設定

#### 方法1: .env.localファイルを使用
```bash
# .env.localファイルを作成
cp .env.example .env.local
```

`.env.local`ファイルを編集：
```
VUE_APP_COGNITO_LOGIN_URL=https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com
```

#### 方法2: コマンドライン実行時に環境変数を設定
```bash
# 開発サーバー起動時
VUE_APP_COGNITO_LOGIN_URL="https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com" npm run serve

# ビルド時
VUE_APP_COGNITO_LOGIN_URL="https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com" npm run build
```

### 2. 本番環境でのビルド・デプロイ

#### ローカルから本番環境へのデプロイ
```bash
# 環境変数を設定してビルド
export VUE_APP_COGNITO_LOGIN_URL="https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com"

# ビルド
npm run build

# S3にデプロイ（例）
aws s3 sync dist/ s3://your-bucket-name --delete

# CloudFrontキャッシュクリア（例）
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### AWS CodeBuildでの自動デプロイ
CodeBuildを使用する場合、環境変数はSSMパラメータストアから取得されます。

必要なSSMパラメータ：
```bash
aws ssm put-parameter --name "/HadxSampleProject/cognito/login-url" --value "https://your-cognito-domain.auth.region.amazoncognito.com/login?client_id=xxx&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyour-domain.com" --type "String"
```

`buildspec.yml`で自動的にビルド・デプロイが実行されます。

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定（上記の「環境変数の設定」を参照）

3. 開発サーバーの起動:
```bash
npm run serve
```

## 認証フロー

1. ユーザーが「ログイン」ボタンをクリック
2. Cognitoマネージドログインページにリダイレクト
3. ログイン後、認証コードと共にホームページ（`/`）にリダイレクト
4. ホームページで認証コードを検出し、`/api/auth/token`エンドポイントにPOSTしてトークンを取得
5. 認証状態が更新され、プロテクトされたページにアクセス可能

## バックエンド要件

このアプリは以下のAPIエンドポイントを期待しています：

- `POST /api/auth/token`: 認証コードをトークンに交換
- `GET /api/auth/status`: 認証状態を確認  
- `POST /api/auth/logout`: ログアウト
- `GET /api/sample`: サンプルデータ取得

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
│   ├── Home.vue           # ホームページ（認証処理含む）
│   └── Protected.vue      # プロテクトされたページ
├── App.vue                # メインアプリケーション
└── main.js                # エントリーポイント
```

## 重要な注意点

1. **環境変数は必須**: `VUE_APP_COGNITO_LOGIN_URL`が設定されていない場合、アプリケーションはエラーを発生させます
2. **ビルド時の環境変数**: Vue.jsの環境変数（`VUE_APP_*`）はビルド時にコードに埋め込まれます。配置後の環境では不要です
3. **リダイレクトURL**: CognitoのリダイレクトURLは末尾のスラッシュなしで設定してください（例：`https://domain.com`）
4. **認証処理**: 専用のコールバックページではなく、ホームページで認証コードを処理します

