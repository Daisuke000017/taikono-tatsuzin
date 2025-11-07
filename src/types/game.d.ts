// ゲーム全体の型定義

export type Difficulty = 'easy' | 'normal' | 'hard' | 'oni';

export type NoteType = 'don' | 'ka';

export type JudgementType = 'perfect' | 'good' | 'miss';

export interface Note {
  id: string;
  time: number; // ミリ秒
  type: NoteType;
  lane?: number; // 将来的な複数レーン対応
}

export interface DifficultyData {
  level: number; // 1-10
  maxCombo: number;
  notes: Note[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  offset: number; // 音声とノーツの同期オフセット (ms)
  audioFile: string;
  coverImage: string;
  difficulties: {
    easy: DifficultyData;
    normal: DifficultyData;
    hard: DifficultyData;
    oni: DifficultyData;
  };
}

export interface GameConfig {
  difficulty: Difficulty;
  song: Song;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number; // ミリ秒
  score: number;
  combo: number;
  maxCombo: number;
  judgements: {
    perfect: number;
    good: number;
    miss: number;
  };
  health: number; // 0-100
}

export interface JudgementResult {
  type: JudgementType;
  timing: number; // ±ミリ秒
  score: number;
  combo: number;
}

export interface RankingEntry {
  playerName: string;
  score: number;
  maxCombo: number;
  difficulty: Difficulty;
  perfectCount: number;
  goodCount: number;
  missCount: number;
  playedAt: string; // ISO 8601
  rank?: string; // S, A, B, C, D
}

export interface TimingWindow {
  perfect: number; // ±ms
  good: number; // ±ms
}

export interface DifficultyConfig {
  timingWindow: TimingWindow;
  noteSpeed: number; // 倍率
  scrollSpeed: number; // px/ms
}

// フック用の型
export interface UseGameLoopReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  handleInput: (noteType: NoteType) => JudgementResult | null;
}

export interface UseAudioEngineReturn {
  loadAudio: (audioFile: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  getCurrentTime: () => number;
  playHitSound: (noteType: NoteType) => void;
  playJudgementSound: (judgement: JudgementType) => void;
  isLoaded: boolean;
}

export interface UseInputHandlerReturn {
  pressedKeys: Set<string>;
  onKeyDown: (e: KeyboardEvent) => void;
  onKeyUp: (e: KeyboardEvent) => void;
}
