import { JudgementType, GameState } from '@/types/game';
import { SCORE_CONFIG, RANK_THRESHOLDS } from '@/constants/gameConfig';

/**
 * 判定タイプに基づく基本スコアを取得
 */
export function getBaseScore(judgement: JudgementType): number {
  switch (judgement) {
    case 'perfect':
      return SCORE_CONFIG.PERFECT_SCORE;
    case 'good':
      return SCORE_CONFIG.GOOD_SCORE;
    case 'miss':
      return SCORE_CONFIG.MISS_SCORE;
    default:
      return 0;
  }
}

/**
 * コンボ倍率を計算
 */
export function getComboMultiplier(combo: number): number {
  return (
    SCORE_CONFIG.COMBO_MULTIPLIER_BASE +
    Math.floor(combo / 100) * SCORE_CONFIG.COMBO_MULTIPLIER_PER_100
  );
}

/**
 * 判定結果からスコアを計算
 */
export function calculateScore(
  judgement: JudgementType,
  currentCombo: number
): number {
  const baseScore = getBaseScore(judgement);
  const multiplier = getComboMultiplier(currentCombo);
  return Math.floor(baseScore * multiplier);
}

/**
 * ゲーム終了時のランクを計算
 */
export function calculateRank(
  score: number,
  maxScore: number
): 'S' | 'A' | 'B' | 'C' | 'D' {
  const ratio = score / maxScore;

  if (ratio >= RANK_THRESHOLDS.S) return 'S';
  if (ratio >= RANK_THRESHOLDS.A) return 'A';
  if (ratio >= RANK_THRESHOLDS.B) return 'B';
  if (ratio >= RANK_THRESHOLDS.C) return 'C';
  return 'D';
}

/**
 * 達成率を計算（パーセンテージ）
 */
export function calculateAccuracy(gameState: GameState, totalNotes: number): number {
  const { judgements } = gameState;
  const totalHits = judgements.perfect + judgements.good + judgements.miss;

  if (totalHits === 0) return 0;

  const weightedScore =
    judgements.perfect * 1.0 +
    judgements.good * 0.5 +
    judgements.miss * 0;

  return (weightedScore / totalNotes) * 100;
}

/**
 * 最大スコアを計算（全てPerfectの場合）
 */
export function calculateMaxScore(totalNotes: number): number {
  let maxScore = 0;

  for (let i = 0; i < totalNotes; i++) {
    const score = calculateScore('perfect', i);
    maxScore += score;
  }

  return Math.min(maxScore, SCORE_CONFIG.MAX_SCORE);
}
