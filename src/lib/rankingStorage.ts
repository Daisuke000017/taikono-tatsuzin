import { RankingEntry, Difficulty } from '@/types/game';

const STORAGE_PREFIX = 'taikono_ranking';
const MAX_ENTRIES = 10;

/**
 * LocalStorageのキーを生成
 */
function getStorageKey(songId: string, difficulty: Difficulty): string {
  return `${STORAGE_PREFIX}_${songId}_${difficulty}`;
}

/**
 * ランキングを取得
 */
export function getRanking(
  songId: string,
  difficulty: Difficulty
): RankingEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = getStorageKey(songId, difficulty);
    const data = localStorage.getItem(key);

    if (!data) return [];

    return JSON.parse(data) as RankingEntry[];
  } catch (error) {
    console.error('Failed to load ranking:', error);
    return [];
  }
}

/**
 * ランキングにエントリーを追加
 */
export function addRankingEntry(
  songId: string,
  entry: RankingEntry
): RankingEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const rankings = getRanking(songId, entry.difficulty);

    // 新しいエントリーを追加
    rankings.push(entry);

    // スコア順にソート（降順）
    rankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.maxCombo - a.maxCombo;
    });

    // トップ10のみ保持
    const topRankings = rankings.slice(0, MAX_ENTRIES);

    // LocalStorageに保存
    const key = getStorageKey(songId, entry.difficulty);
    localStorage.setItem(key, JSON.stringify(topRankings));

    return topRankings;
  } catch (error) {
    console.error('Failed to save ranking:', error);
    return [];
  }
}

/**
 * 全楽曲のランキングを取得
 */
export function getAllRankings(): Record<string, RankingEntry[]> {
  if (typeof window === 'undefined') return {};

  try {
    const rankings: Record<string, RankingEntry[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          rankings[key] = JSON.parse(data);
        }
      }
    }

    return rankings;
  } catch (error) {
    console.error('Failed to load all rankings:', error);
    return {};
  }
}

/**
 * 特定楽曲のランキングをクリア
 */
export function clearRanking(songId: string, difficulty: Difficulty): void {
  if (typeof window === 'undefined') return;

  try {
    const key = getStorageKey(songId, difficulty);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear ranking:', error);
  }
}

/**
 * 全ランキングをクリア
 */
export function clearAllRankings(): void {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all rankings:', error);
  }
}

/**
 * 自分の順位を取得
 */
export function getPlayerRank(
  songId: string,
  difficulty: Difficulty,
  score: number
): number {
  const rankings = getRanking(songId, difficulty);
  const rank = rankings.findIndex((entry) => entry.score <= score);

  return rank === -1 ? rankings.length + 1 : rank + 1;
}

/**
 * トップスコアを取得
 */
export function getTopScore(songId: string, difficulty: Difficulty): number {
  const rankings = getRanking(songId, difficulty);
  return rankings.length > 0 ? rankings[0].score : 0;
}
