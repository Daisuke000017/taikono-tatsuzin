import {
  Note,
  NoteType,
  JudgementType,
  JudgementResult,
  GameState,
  Difficulty,
} from '@/types/game';
import { DIFFICULTY_CONFIGS, GAME_CONFIG } from '@/constants/gameConfig';
import { calculateScore } from './scoreCalculator';

export class GameEngine {
  private notes: Note[];
  private difficulty: Difficulty;
  private currentNoteIndex: number = 0;
  private activeNotes: Set<string> = new Set();
  private processedNotes: Set<string> = new Set();
  private rollNoteHits: Map<string, number> = new Map(); // 連打ノーツのヒット数を追跡

  constructor(notes: Note[], difficulty: Difficulty) {
    this.notes = [...notes].sort((a, b) => a.time - b.time);
    this.difficulty = difficulty;
  }

  /**
   * 指定時間にアクティブなノーツを取得
   */
  getActiveNotes(currentTime: number): Note[] {
    const config = DIFFICULTY_CONFIGS[this.difficulty];
    const spawnTime = 2000; // ノーツが表示されてから判定位置に到達するまでの時間（ms）

    const active: Note[] = [];

    for (const note of this.notes) {
      const spawnAt = note.time - spawnTime;

      // 連打ノーツの場合、終了時刻まで表示
      const expireAt = note.type === 'don-roll' && note.endTime
        ? note.endTime
        : note.time + config.timingWindow.good;

      if (currentTime >= spawnAt && currentTime <= expireAt) {
        active.push(note);
      }
    }

    return active;
  }

  /**
   * ノーツの現在位置を計算（画面左端からのpx）
   */
  getNotePosition(note: Note, currentTime: number): number {
    const config = DIFFICULTY_CONFIGS[this.difficulty];
    const timeUntilHit = note.time - currentTime;
    const distance = timeUntilHit * config.scrollSpeed;

    return GAME_CONFIG.DRUM_POSITION_X + distance;
  }

  /**
   * 入力判定を行う
   */
  judgeInput(
    noteType: NoteType,
    currentTime: number,
    gameState: GameState
  ): JudgementResult | null {
    const config = DIFFICULTY_CONFIGS[this.difficulty];

    // 連打ノーツのチェック（'don'入力の場合のみ）
    if (noteType === 'don') {
      for (const note of this.notes) {
        if (note.type === 'don-roll' && note.endTime) {
          // 連打ノーツがアクティブかチェック
          if (currentTime >= note.time && currentTime <= note.endTime) {
            // 連打ヒット数をカウント
            const hits = (this.rollNoteHits.get(note.id) || 0) + 1;
            this.rollNoteHits.set(note.id, hits);

            // 連打ノーツはコンボに影響しないが、小さいスコアを返す
            return {
              type: 'perfect',
              timing: 0,
              score: 100, // 連打1回あたりのスコア
              combo: gameState.combo, // コンボは維持
            };
          }
        }
      }
    }

    // 通常ノーツの判定
    // 未処理のノーツから最も近いものを検索
    let closestNote: Note | null = null;
    let closestTiming = Infinity;

    for (const note of this.notes) {
      // 既に処理済みならスキップ
      if (this.processedNotes.has(note.id)) continue;

      // 連打ノーツはスキップ
      if (note.type === 'don-roll') continue;

      // タイプが一致しない場合はスキップ
      if (note.type !== noteType) continue;

      const timing = currentTime - note.time;
      const absTiming = Math.abs(timing);

      // 判定範囲外ならスキップ
      if (absTiming > config.timingWindow.good) continue;

      // より近いノーツを見つけた
      if (absTiming < closestTiming) {
        closestNote = note;
        closestTiming = absTiming;
      }
    }

    // 判定可能なノーツが見つからない
    if (!closestNote) {
      return {
        type: 'miss',
        timing: 0,
        score: 0,
        combo: 0,
      };
    }

    // 判定を確定
    this.processedNotes.add(closestNote.id);

    const timing = currentTime - closestNote.time;
    const absTiming = Math.abs(timing);

    let judgement: JudgementType;
    if (absTiming <= config.timingWindow.perfect) {
      judgement = 'perfect';
    } else if (absTiming <= config.timingWindow.good) {
      judgement = 'good';
    } else {
      judgement = 'miss';
    }

    // スコアとコンボを計算
    const newCombo = judgement !== 'miss' ? gameState.combo + 1 : 0;
    const score = calculateScore(judgement, newCombo);

    return {
      type: judgement,
      timing,
      score,
      combo: newCombo,
    };
  }

  /**
   * 見逃したノーツをチェック
   */
  checkMissedNotes(currentTime: number): Note[] {
    const config = DIFFICULTY_CONFIGS[this.difficulty];
    const missed: Note[] = [];

    for (const note of this.notes) {
      // 既に処理済みならスキップ
      if (this.processedNotes.has(note.id)) continue;

      // 連打ノーツの場合、終了時刻を過ぎたら処理済みにするが、ミスにはしない
      if (note.type === 'don-roll' && note.endTime) {
        if (currentTime > note.endTime) {
          this.processedNotes.add(note.id);
        }
        continue; // 連打ノーツはミスにならない
      }

      // 通常ノーツ: 判定ウィンドウを過ぎたか確認
      if (currentTime > note.time + config.timingWindow.good) {
        this.processedNotes.add(note.id);
        missed.push(note);
      }
    }

    return missed;
  }

  /**
   * ゲームが終了したかチェック
   */
  isGameFinished(currentTime: number): boolean {
    const config = DIFFICULTY_CONFIGS[this.difficulty];
    const lastNote = this.notes[this.notes.length - 1];

    if (!lastNote) return true;

    // 連打ノーツの場合は終了時刻を使用
    const endTime = lastNote.type === 'don-roll' && lastNote.endTime
      ? lastNote.endTime
      : lastNote.time + config.timingWindow.good;

    // 最後のノーツの判定ウィンドウ（または連打終了時刻）が過ぎたか
    return currentTime > endTime + 1000;
  }

  /**
   * リセット
   */
  reset(): void {
    this.currentNoteIndex = 0;
    this.activeNotes.clear();
    this.processedNotes.clear();
  }

  /**
   * 総ノーツ数を取得
   */
  getTotalNotes(): number {
    return this.notes.length;
  }

  /**
   * 処理済みノーツ数を取得
   */
  getProcessedNotesCount(): number {
    return this.processedNotes.size;
  }
}
