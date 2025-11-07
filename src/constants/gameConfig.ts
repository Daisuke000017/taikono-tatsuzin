import { Difficulty, DifficultyConfig } from '@/types/game';

// 難易度別の設定
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    timingWindow: {
      perfect: 70, // ±70ms
      good: 100,   // ±100ms
    },
    noteSpeed: 1.0,
    scrollSpeed: 0.3, // px/ms
  },
  normal: {
    timingWindow: {
      perfect: 50, // ±50ms
      good: 80,    // ±80ms
    },
    noteSpeed: 1.2,
    scrollSpeed: 0.4,
  },
  hard: {
    timingWindow: {
      perfect: 40, // ±40ms
      good: 70,    // ±70ms
    },
    noteSpeed: 1.5,
    scrollSpeed: 0.5,
  },
  oni: {
    timingWindow: {
      perfect: 30, // ±30ms
      good: 60,    // ±60ms
    },
    noteSpeed: 2.0,
    scrollSpeed: 0.6,
  },
};

// スコア計算
export const SCORE_CONFIG = {
  PERFECT_SCORE: 1000,
  GOOD_SCORE: 300,
  MISS_SCORE: 0,
  MAX_SCORE: 1000000,
  COMBO_MULTIPLIER_BASE: 1.0,
  COMBO_MULTIPLIER_PER_100: 0.5, // 100コンボごとに0.5倍加算
};

// ランク判定
export const RANK_THRESHOLDS = {
  S: 0.95,  // 95%以上
  A: 0.85,  // 85%以上
  B: 0.70,  // 70%以上
  C: 0.50,  // 50%以上
  D: 0,     // それ以下
};

// キー設定
export const KEY_BINDINGS = {
  DON_LEFT: 'f',
  DON_RIGHT: 'j',
  KA_LEFT: 'd',
  KA_RIGHT: 'k',
  PAUSE: 'Escape',
  ENTER: 'Enter',
};

// ゲーム設定
export const GAME_CONFIG = {
  TARGET_FPS: 60,
  DRUM_POSITION_X: 150, // 太鼓のX位置（画面左からのpx）
  NOTE_SPAWN_X: 1200,   // ノーツの出現位置（画面右側）
  NOTE_SIZE: 60,        // ノーツの直径（px）
  HIT_ZONE_WIDTH: 100,  // 判定範囲の幅（px）
  JUDGEMENT_DISPLAY_DURATION: 500, // 判定表示時間（ms）
  MAX_HEALTH: 100,
  HEALTH_DECREASE_ON_MISS: 5,
};

// 難易度表示名
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい',
  oni: 'おに',
};

// 難易度カラー
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#4ade80',   // 緑
  normal: '#3b82f6', // 青
  hard: '#f59e0b',   // オレンジ
  oni: '#ef4444',    // 赤
};
