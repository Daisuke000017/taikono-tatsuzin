# 太鼓の達人風リズムゲーム - 設計ドキュメント

## プロジェクト概要

オリジナルの太鼓の達人風リズムゲームを、Next.js + TypeScript + Web Audio APIで実装。
GitHub + Vercelの無料プランで完全動作。

---

## 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Graphics**: SVG + HTML5 Canvas
- **Audio**: Web Audio API

### インフラ
- **Hosting**: Vercel (無料プラン)
- **Repository**: GitHub
- **Storage**: LocalStorage (ランキング)

---

## 機能仕様

### 1. 難易度システム

| 難易度 | レベル目安 | ノーツ密度 | 判定猶予 | スピード倍率 |
|--------|-----------|-----------|----------|-------------|
| かんたん | ★1-2 | 50-100 | ±70ms | 1.0x |
| ふつう | ★3-4 | 100-200 | ±50ms | 1.2x |
| むずかしい | ★5-7 | 200-350 | ±40ms | 1.5x |
| おに | ★8-10 | 350+ | ±30ms | 2.0x |

### 2. 判定システム

```typescript
判定        タイミング誤差    スコア    表示
-------------------------------------------
Perfect     ±30ms           1000点    良
Good        ±60ms            300点    可
Miss        60ms超            0点     不可
```

### 3. スコア計算

```
基本スコア = Σ(判定スコア × コンボ倍率)
コンボ倍率 = 1.0 + (現在コンボ数 / 100) × 0.5
最大スコア = 1,000,000点
```

### 4. ランキング機能

**保存データ構造:**
```typescript
interface RankingEntry {
  playerName: string;
  score: number;
  maxCombo: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'oni';
  perfectCount: number;
  goodCount: number;
  missCount: number;
  playedAt: string; // ISO 8601
}
```

**保存先:**
- LocalStorage: `ranking_${songId}_${difficulty}`
- 各楽曲・難易度ごとにトップ10を保存

---

## デザイン仕様

### カラーパレット

```css
/* メインカラー */
--color-don: #FF4444;        /* ドン（赤） */
--color-ka: #4488FF;         /* カッ（青） */
--color-background: #1a1a2e; /* 背景ダーク */
--color-background-light: #16213e;
--color-text: #eaeaea;       /* テキスト */
--color-accent: #FFD700;     /* ゴールド */
--color-perfect: #00FF88;    /* Perfect判定 */
--color-good: #FFAA00;       /* Good判定 */
--color-miss: #FF3333;       /* Miss判定 */
```

### レイアウト

```
画面構成（ゲーム画面）
┌─────────────────────────────────────┐
│  スコア: 123,456  コンボ: 50       │ ← ヘッダー
├─────────────────────────────────────┤
│                                     │
│  ノーツ ノーツ ノーツ → 🎯 太鼓    │ ← メイン
│                           ━━       │
│                                     │
├─────────────────────────────────────┤
│  [F] [J] ドン   [D] [K] カッ       │ ← コントロール
└─────────────────────────────────────┘
```

### SVGコンポーネント

#### 太鼓 (Drum.tsx)
- 外枠: 茶色の円 (stroke-width: 8)
- 内側: 白い面 + 和風模様
- ヒット時: スケールアニメーション (1.0 → 1.1 → 1.0)

#### ノーツ (Notes.tsx)
- ドン: 赤い円 + グラデーション
- カッ: 青い円 + グラデーション
- サイズ: 直径60px
- 移動: 右から左へ (速度は難易度により変動)

#### 判定エフェクト
- リップル: CSS3 animation (@keyframes ripple)
- パーティクル: Canvas で星型パーティクル
- グロー: box-shadow + blur

---

## ディレクトリ構造

```
taikono-tatsuzin/
├── public/
│   ├── assets/
│   │   ├── audio/           # MP3/OGG音源
│   │   ├── images/          # SVGカバー画像
│   │   └── charts/          # 譜面JSON
│   └── fonts/               # Webフォント
├── src/
│   ├── app/
│   │   ├── page.tsx         # トップ（楽曲選択）
│   │   ├── game/
│   │   │   └── page.tsx     # ゲーム画面
│   │   ├── result/
│   │   │   └── page.tsx     # リザルト画面
│   │   └── layout.tsx
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameCanvas.tsx
│   │   │   ├── Drum.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── JudgementDisplay.tsx
│   │   │   └── ScoreDisplay.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── SongCard.tsx
│   │   │   └── RankingTable.tsx
│   │   └── layout/
│   │       └── Header.tsx
│   ├── hooks/
│   │   ├── useAudioEngine.ts
│   │   ├── useGameLoop.ts
│   │   ├── useInputHandler.ts
│   │   └── useRanking.ts
│   ├── lib/
│   │   ├── gameEngine.ts
│   │   ├── audioEngine.ts
│   │   ├── scoreCalculator.ts
│   │   ├── chartLoader.ts
│   │   └── rankingStorage.ts
│   ├── types/
│   │   └── game.d.ts
│   └── constants/
│       └── gameConfig.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── vercel.json
```

---

## 譜面フォーマット

```json
{
  "id": "sample-song-01",
  "title": "サンプル曲1",
  "artist": "オリジナル",
  "bpm": 120,
  "offset": 0,
  "audioFile": "/assets/audio/sample-01.mp3",
  "coverImage": "/assets/images/cover-01.svg",
  "difficulties": {
    "easy": {
      "level": 2,
      "maxCombo": 50,
      "notes": [
        { "time": 1000, "type": "don" },
        { "time": 1500, "type": "ka" },
        { "time": 2000, "type": "don" }
      ]
    },
    "normal": {
      "level": 4,
      "maxCombo": 120,
      "notes": [...]
    },
    "hard": {
      "level": 7,
      "maxCombo": 280,
      "notes": [...]
    },
    "oni": {
      "level": 9,
      "maxCombo": 450,
      "notes": [...]
    }
  }
}
```

---

## 入力設定

### キーボード
- **ドン（面）**: F キー / J キー
- **カッ（縁）**: D キー / K キー
- **決定**: Enter
- **キャンセル**: ESC

### 将来的な拡張
- タッチ操作（スマホ対応）
- ゲームパッド対応

---

## パフォーマンス最適化

### 音声ファイル
- フォーマット: MP3 (128kbps) または OGG
- サイズ目安: 1曲あたり2-5MB
- プリロード: ゲーム開始前に完全ロード

### 画像
- SVG: UI要素、ノーツ、太鼓
- PNG/WebP: カバー画像（圧縮必須）

### Canvas最適化
- requestAnimationFrame で60fps維持
- オフスクリーンキャンバス活用
- 不要なオブジェクトの描画スキップ

---

## Vercelデプロイ設定

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

---

## イラスト・素材方針

### プロトタイプ段階
- **SVG**: コンポーネント化した太鼓、ノーツ
- **CSS3**: グラデーション、アニメーション
- **Google Fonts**: Noto Sans JP（日本語）

### 将来的な拡張
- オリジナルイラスト外注
- AI生成素材（利用規約確認後）
- 無料素材サイト（CC0/CC-BY）

---

## 開発フェーズ

### Phase 1: プロトタイプ（現在）
- [x] 設計ドキュメント作成
- [ ] Next.js プロジェクト初期化
- [ ] ゲームコアロジック実装
- [ ] 基本UI実装
- [ ] サンプル楽曲1-2曲
- [ ] ランキング機能（LocalStorage）

### Phase 2: ブラッシュアップ
- [ ] デザイン改善
- [ ] エフェクト追加
- [ ] 楽曲追加（5-10曲）
- [ ] レスポンシブ対応

### Phase 3: 拡張機能
- [ ] バックエンド連携（Supabase等）
- [ ] オンラインランキング
- [ ] ソーシャル共有機能
- [ ] カスタム譜面アップロード

---

## ライセンス・著作権

### コード
MIT License

### 音楽素材
- オリジナル作曲
- または著作権フリー素材（出典明記）

### 使用予定の無料音源サイト
- [DOVA-SYNDROME](https://dova-s.jp/)
- [魔王魂](https://maou.audio/)
- [freesound.org](https://freesound.org/)

---

最終更新: 2025-11-07
