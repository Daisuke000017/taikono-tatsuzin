# Vercelデプロイガイド 🚀

このガイドでは、太鼓の達人風リズムゲームをVercelにデプロイする手順を説明します。

## 📋 前提条件

- GitHubアカウント
- Vercelアカウント（無料）

## 🚀 デプロイ手順

### ステップ1: Vercelアカウントの作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで認証

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から `taikono-tatsuzin` を選択
3. 「Import」をクリック

### ステップ3: ビルド設定の確認

以下の設定が自動的に検出されます：

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next (自動検出)
Install Command: npm install
```

**⚠️ 重要**: 設定は自動検出されるので、変更不要です。

### ステップ4: デプロイ

1. 「Deploy」ボタンをクリック
2. ビルドが開始されます（約1-2分）
3. ✅ デプロイ完了！

### ステップ5: 確認

デプロイが完了すると、以下のようなURLが発行されます：

```
https://taikono-tatsuzin-xxx.vercel.app
```

このURLをクリックしてゲームにアクセスできます！

## 🎮 デプロイ後の動作

### 正常に動作する機能

✅ 楽曲選択画面
✅ 難易度選択
✅ ゲームプレイ（ノーツの流れ、判定）
✅ スコア計算
✅ コンボシステム
✅ リザルト画面
✅ ランキング機能（LocalStorage）
✅ カバー画像表示
✅ SVGグラフィック

### 音声について

❌ BGM: 音楽ファイルがないため再生されません
✅ 効果音: Web Audio APIで生成される簡易音が再生されます

**注意**: ブラウザのコンソールに音楽ファイルが見つからないという警告が表示されますが、ゲームプレイには影響しません。

## 🔧 カスタムドメインの設定（オプション）

### 独自ドメインを使用する場合

1. Vercelプロジェクトの「Settings」→「Domains」
2. カスタムドメインを追加
3. DNSレコードを設定
4. 完了！

例: `taiko-game.yourdomain.com`

## 🎵 音楽ファイルの追加（後から）

デプロイ後に音楽ファイルを追加する方法：

### 方法1: ローカルで追加してプッシュ

1. `public/assets/audio/` に音楽ファイルを配置
2. Gitにコミット＆プッシュ
3. Vercelが自動的に再デプロイ

```bash
# 音楽ファイルを配置
cp ~/Downloads/sample-01.mp3 public/assets/audio/
cp ~/Downloads/sample-02.mp3 public/assets/audio/
cp ~/Downloads/sample-03.mp3 public/assets/audio/

# コミット＆プッシュ
git add public/assets/audio/
git commit -m "Add music files"
git push origin main

# Vercelが自動的に再デプロイ
```

### 方法2: GitHub Web UIで追加

1. GitHubリポジトリで `public/assets/audio/` に移動
2. 「Add file」→「Upload files」
3. 音楽ファイルをドラッグ＆ドロップ
4. コミット → Vercelが自動再デプロイ

## 📊 デプロイ設定の詳細

### 環境変数（不要）

このプロジェクトは完全にフロントエンドのみなので、環境変数は不要です。

### ビルド最適化

プロジェクトは以下の最適化が施されています：

- ✅ 静的サイト生成（SSG）
- ✅ 画像最適化無効（SVG使用のため）
- ✅ Tailwind CSS パージ
- ✅ TypeScript型チェック
- ✅ Tree Shaking

### パフォーマンス

**予想されるパフォーマンス:**
- Lighthouse Score: 90+
- First Load JS: ~90KB
- 初回読み込み: < 2秒

## 🐛 トラブルシューティング

### ビルドエラー

**問題**: ビルドが失敗する
**解決策**:
1. ローカルで `npm run build` を実行してエラーを確認
2. エラーを修正してプッシュ
3. Vercelで再デプロイ

### 画像が表示されない

**問題**: カバー画像が表示されない
**原因**: パスが間違っている
**解決策**:
- パスは `/assets/images/cover-01.svg` のように先頭に `/` を付ける
- `next.config.js` で `images.unoptimized: true` が設定されているか確認

### ランキングが保存されない

**問題**: スコアが保存されない
**原因**: LocalStorageがブロックされている
**解決策**:
- ブラウザのプライベートモードを無効化
- サードパーティCookieを許可

### 音が出ない

**問題**: 効果音も出ない
**原因**: ブラウザの自動再生ポリシー
**解決策**:
- ページをクリックしてから再生開始
- ユーザーインタラクション後に音声を初期化

## 🔄 自動デプロイ

Vercelは以下の場合に自動的に再デプロイします：

- ✅ `main` ブランチへのプッシュ → 本番環境
- ✅ その他のブランチへのプッシュ → プレビュー環境
- ✅ プルリクエストの作成 → プレビューURL生成

## 📈 分析とモニタリング

### Vercel Analytics（オプション）

無料でアクセス分析が可能：

1. プロジェクト設定で「Analytics」を有効化
2. 訪問者数、ページビュー、デバイス情報を確認

### パフォーマンスモニタリング

Vercelが提供する情報：
- ビルド時間
- デプロイ頻度
- エラーログ
- リアルタイムログ

## 🌍 複数環境の管理

### 本番環境
- ブランチ: `main`
- URL: `https://taikono-tatsuzin.vercel.app`

### プレビュー環境
- ブランチ: その他（例: `develop`, `feature/xxx`）
- URL: `https://taikono-tatsuzin-git-branch-name.vercel.app`

## 💰 Vercel無料プランの制限

### 制限事項

- 帯域幅: 100GB/月
- ビルド時間: 6,000分/月
- 同時ビルド: 1つ
- プロジェクト数: 無制限

### このプロジェクトでの影響

**想定トラフィック:**
- 1ページビュー: ~2MB（画像、JS、CSS込み）
- 100GB ÷ 2MB = **約50,000ページビュー/月**

**十分すぎる容量！** 🎉

## 🔐 セキュリティ

### HTTPS

Vercelは自動的にHTTPSを有効化します：
- ✅ 無料SSL証明書
- ✅ 自動更新
- ✅ HTTP → HTTPS リダイレクト

### セキュリティヘッダー

必要に応じて `next.config.js` でセキュリティヘッダーを追加できます。

## 📱 モバイル対応

デプロイ後、以下のデバイスで動作確認してください：

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ PC Chrome/Firefox/Edge

## 🎯 次のステップ

デプロイ後にできること：

1. **音楽ファイルの追加**: AUDIO_GUIDE.mdを参照
2. **カスタムドメインの設定**: 独自ドメインを使用
3. **OGP画像の追加**: SNSシェア用の画像
4. **Google Analyticsの統合**: アクセス解析
5. **PWA化**: オフラインでもプレイ可能に

## 📞 サポート

問題が発生した場合：

1. **Vercelドキュメント**: https://vercel.com/docs
2. **Next.jsドキュメント**: https://nextjs.org/docs
3. **GitHubイシュー**: プロジェクトリポジトリで質問

---

**デプロイ完了おめでとうございます！** 🎊

ゲームを楽しんでください！
