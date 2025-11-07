# 太鼓の達人風リズムゲーム 🥁

オリジナルの太鼓の達人風リズムゲームのプロトタイプ。Next.js + TypeScript + Web Audio APIで実装されています。

## 🎮 デモ

プロトタイプをプレイするには、以下の手順でローカルで実行してください。

## ✨ 機能

- **3つの楽曲**: カバー画像付きの多様な楽曲
- **4つの難易度**: かんたん、ふつう、むずかしい、おに
- **リアルタイム判定システム**: Perfect、Good、Miss
- **コンボシステム**: 連続ヒットでスコア倍率アップ
- **ランキング機能**: 楽曲・難易度別のトップ10表示
- **SVGベースのUI**: 美しいカバー画像とスケーラブルなデザイン
- **Web Audio API**: リアルタイム音声再生

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API
- **Storage**: LocalStorage

## 📦 インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd taikono-tatsuzin

# 依存関係をインストール
npm install
```

## 🚀 開発

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

## 🏗️ ビルド

```bash
# プロダクションビルド
npm run build

# 静的エクスポート (Vercel用)
npm run build
```

## 🎯 操作方法

### キーボード

| キー | アクション |
|------|-----------|
| F / J | ドン（面）|
| D / K | カッ（縁）|

## 📁 プロジェクト構造

```
taikono-tatsuzin/
├── public/
│   └── assets/
│       ├── audio/         # 音楽ファイル（MP3/OGG）
│       ├── images/        # カバー画像（SVG推奨）
│       └── charts/        # 譜面データ（JSON）
├── src/
│   ├── app/
│   │   ├── page.tsx       # トップ（楽曲選択）
│   │   ├── game/          # ゲーム画面
│   │   └── result/        # リザルト画面
│   ├── components/
│   │   └── game/          # ゲーム用コンポーネント
│   ├── hooks/             # カスタムフック
│   ├── lib/               # コアロジック
│   ├── types/             # TypeScript型定義
│   └── constants/         # 定数設定
├── DESIGN.md              # 詳細設計ドキュメント
└── README.md
```

## 📊 譜面データフォーマット

譜面は `public/assets/charts/` に JSON形式で配置します：

```json
{
  "id": "sample-01",
  "title": "サンプル曲 1",
  "artist": "アーティスト名",
  "bpm": 120,
  "offset": 0,
  "audioFile": "/assets/audio/sample-01.mp3",
  "coverImage": "/assets/images/cover-01.svg",
  "difficulties": {
    "easy": {
      "level": 2,
      "maxCombo": 40,
      "notes": [
        { "id": "e1", "time": 2000, "type": "don" },
        { "id": "e2", "time": 3000, "type": "ka" }
      ]
    }
  }
}
```

## 🎨 カスタマイズ

### 難易度設定

`src/constants/gameConfig.ts` で判定猶予やスピードを調整できます：

```typescript
export const DIFFICULTY_CONFIGS = {
  easy: {
    timingWindow: { perfect: 70, good: 100 },
    noteSpeed: 1.0,
  },
  // ...
}
```

### 新しい楽曲の追加

1. 譜面JSONを `public/assets/charts/` に配置
2. 音声ファイルを `public/assets/audio/` に配置
3. `src/app/page.tsx` の楽曲リストに追加

## 🚢 デプロイ (Vercel)

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com) にログイン
3. 「Import Project」からリポジトリを選択
4. ビルド設定は自動検出されます
5. デプロイ！

### Vercel無料プランの制限

- 帯域幅: 月100GB
- ビルド時間: 月6,000分
- 静的ファイル: 推奨100MB以下

## 📝 今後の拡張予定

- [ ] 実際の音楽ファイルの追加（著作権フリー）
- [ ] タッチ操作対応（スマホ）
- [ ] オンラインランキング（Supabase等）
- [ ] カスタム譜面アップロード機能
- [ ] リプレイ機能
- [ ] マルチプレイモード

## 🎵 音楽素材について

プロトタイプでは音声ファイルが含まれていません。詳しい音楽ファイルの配置方法は **[AUDIO_GUIDE.md](./AUDIO_GUIDE.md)** をご覧ください。

### 推奨サイト
- [DOVA-SYNDROME](https://dova-s.jp/)
- [魔王魂](https://maou.audio/)
- [甘茶の音楽工房](https://amachamusic.chagasi.com/)
- [Freesound](https://freesound.org/)
- [Incompetech](https://incompetech.com/music/)

## 📄 ライセンス

MIT License

## 🙏 謝辞

このプロジェクトは、バンダイナムコエンターテインメントの「太鼓の達人」にインスパイアされて作成されました。

---

**注意**: これは教育目的のプロトタイプです。商用利用する場合は、音楽の著作権に十分注意してください。
