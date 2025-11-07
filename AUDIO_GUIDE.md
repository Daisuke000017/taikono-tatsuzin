# 音楽ファイル配置ガイド 🎵

このガイドでは、ゲームで使用する音楽ファイルの入手方法と配置方法を説明します。

## 📁 ファイル配置場所

音楽ファイルは以下のディレクトリに配置してください：

```
public/assets/audio/
├── sample-01.mp3
├── sample-02.mp3
└── sample-03.mp3
```

## 🎼 推奨仕様

### ファイルフォーマット
- **推奨**: MP3 (128-192kbps)
- **代替**: OGG Vorbis

### ファイルサイズ
- **目標**: 1曲あたり2-5MB
- **理由**: Vercel無料プランの帯域幅制限（月100GB）を考慮

### 音楽の長さ
- **推奨**: 1-2分程度
- **理由**: プロトタイプでは短い楽曲の方がテストしやすい

## 🆓 著作権フリー音楽の入手先

### 日本語サイト

#### 1. DOVA-SYNDROME
- URL: https://dova-s.jp/
- ライセンス: 無料、商用利用可（要クレジット表記推奨）
- ジャンル: 豊富
- 特徴: 日本のクリエイター向け、高品質

#### 2. 魔王魂
- URL: https://maou.audio/
- ライセンス: 無料、商用利用可
- ジャンル: ゲーム音楽、BGM、効果音
- 特徴: ゲーム向けの楽曲が豊富

#### 3. 甘茶の音楽工房
- URL: https://amachamusic.chagasi.com/
- ライセンス: 無料、商用利用可
- ジャンル: 和風、クラシック、ポップス
- 特徴: 和風楽曲が充実

### 英語サイト

#### 4. Freesound
- URL: https://freesound.org/
- ライセンス: CC0, CC-BY（楽曲により異なる）
- 特徴: 効果音も豊富

#### 5. Incompetech
- URL: https://incompetech.com/music/
- ライセンス: CC-BY（クレジット表記必要）
- 特徴: Kevin MacLeodの楽曲、ゲームでよく使用される

#### 6. Free Music Archive
- URL: https://freemusicarchive.org/
- ライセンス: 楽曲により異なる（CC0, CC-BYなど）
- 特徴: ジャンルが多様

## 📝 ファイル配置手順

### 1. 音楽をダウンロード

上記サイトから好きな楽曲を3曲ダウンロードします。

### 2. ファイル名を変更

ダウンロードしたファイルを以下のように改名：

```bash
original-song-name.mp3 → sample-01.mp3
another-song.mp3       → sample-02.mp3
third-song.ogg         → sample-03.mp3
```

### 3. ファイルを配置

改名したファイルを `public/assets/audio/` に配置：

```bash
# プロジェクトルートから
cp ~/Downloads/sample-01.mp3 public/assets/audio/
cp ~/Downloads/sample-02.mp3 public/assets/audio/
cp ~/Downloads/sample-03.mp3 public/assets/audio/
```

### 4. 動作確認

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
# 楽曲を選択してゲームをプレイ
```

## 🔧 音楽ファイルがない場合

音楽ファイルがなくても、ゲームは動作します：

- **効果音**: Web Audio APIで生成される簡易音が再生されます
- **BGM**: エラーが表示されますが、ゲームプレイには影響しません
- **譜面**: ノーツは時間通りに流れてきます

## 🎨 カスタム楽曲の追加

新しい楽曲を追加する場合：

### 1. 譜面データを作成

`public/assets/charts/sample-04.json` を作成：

```json
{
  "id": "sample-04",
  "title": "あなたの楽曲名",
  "artist": "アーティスト名",
  "bpm": 120,
  "offset": 0,
  "audioFile": "/assets/audio/sample-04.mp3",
  "coverImage": "/assets/images/cover-04.svg",
  "difficulties": {
    "easy": {
      "level": 2,
      "maxCombo": 50,
      "notes": [
        { "id": "e1", "time": 2000, "type": "don" },
        { "id": "e2", "time": 3000, "type": "ka" }
      ]
    }
  }
}
```

### 2. 音楽ファイルを配置

```bash
cp your-song.mp3 public/assets/audio/sample-04.mp3
```

### 3. カバー画像を作成

SVGファイルを作成するか、既存のものをコピー：

```bash
cp public/assets/images/cover-01.svg public/assets/images/cover-04.svg
```

### 4. 楽曲リストに追加

`src/app/page.tsx` の `songs` 配列に追加：

```typescript
const songs = [
  // ... 既存の楽曲
  {
    id: 'sample-04',
    title: 'あなたの楽曲名',
    artist: 'アーティスト名',
    coverImage: '/assets/images/cover-04.svg',
  },
];
```

## ⚖️ ライセンス表記

著作権フリー音楽を使用する場合でも、クレジット表記が推奨または必要な場合があります：

### 表記場所の例

1. **README.md** に追加
2. **ゲーム内** にクレジット画面を作成
3. **リザルト画面** に小さく表記

### 表記例

```markdown
## 使用楽曲

- 楽曲名: "Happy Tune"
  - 作曲: ○○○○
  - ライセンス: CC-BY 4.0
  - 出典: https://example.com/music

- 楽曲名: "Electronic Beat"
  - 作曲: △△△△
  - ライセンス: CC0 (パブリックドメイン)
```

## 🚨 注意事項

### ❌ やってはいけないこと

- 著作権のある市販の楽曲を無断使用
- YouTubeなどから音楽を抽出して使用
- ライセンスを確認せずに使用
- クレジット表記が必要なのに省略

### ✅ 推奨される使用方法

- CC0（パブリックドメイン）の楽曲を優先
- ライセンスを必ず確認
- クレジット表記を適切に行う
- 商用利用の有無を確認（Vercelでの公開は商用扱いの可能性あり）

## 🎵 効果音の追加（オプション）

ドンとカッのヒット音を実際の音源に差し替えることも可能です：

### 1. 効果音を入手

- 魔王魂の効果音カテゴリ
- Freesoundで "drum" や "taiko" を検索

### 2. ファイルを配置

```
public/assets/audio/sfx/
├── don.mp3
└── ka.mp3
```

### 3. コードを更新

`src/lib/audioEngine.ts` の `loadHitSounds` メソッドを修正して、実際のファイルを読み込むように変更。

## 🆘 トラブルシューティング

### 音楽が再生されない

1. ファイルパスが正しいか確認
2. ブラウザのコンソールでエラーを確認
3. ファイルフォーマットを確認（MP3が最も互換性が高い）
4. ファイルサイズを確認（大きすぎると読み込みに時間がかかる）

### 音楽とノーツがずれる

1. 譜面データの `offset` 値を調整
2. BPMが正しいか確認
3. ノーツの `time` 値を微調整

---

このガイドに従って音楽ファイルを配置すれば、完全に機能する太鼓の達人風ゲームが完成します！
