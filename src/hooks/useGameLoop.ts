'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  JudgementResult,
  NoteType,
  Difficulty,
  Note,
} from '@/types/game';
import { GameEngine } from '@/lib/gameEngine';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface UseGameLoopProps {
  notes: Note[];
  difficulty: Difficulty;
  getCurrentTime: () => number;
  onGameEnd: (finalState: GameState) => void;
}

export function useGameLoop({
  notes,
  difficulty,
  getCurrentTime,
  onGameEnd,
}: UseGameLoopProps) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    judgements: {
      perfect: 0,
      good: 0,
      miss: 0,
    },
    health: 100,
  });

  const [activeNotes, setActiveNotes] = useState<Note[]>([]);
  const [lastJudgement, setLastJudgement] = useState<JudgementResult | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number>();

  // ゲームエンジンの初期化
  useEffect(() => {
    engineRef.current = new GameEngine(notes, difficulty);
  }, [notes, difficulty]);

  // ゲームループ
  const gameLoop = useCallback(() => {
    if (!engineRef.current || !gameState.isPlaying || gameState.isPaused) {
      return;
    }

    const currentTime = getCurrentTime();

    // アクティブなノーツを取得
    const active = engineRef.current.getActiveNotes(currentTime);
    setActiveNotes(active);

    // 見逃したノーツをチェック
    const missedNotes = engineRef.current.checkMissedNotes(currentTime);
    if (missedNotes.length > 0) {
      setGameState((prev) => ({
        ...prev,
        combo: 0,
        judgements: {
          ...prev.judgements,
          miss: prev.judgements.miss + missedNotes.length,
        },
        health: Math.max(0, prev.health - GAME_CONFIG.HEALTH_DECREASE_ON_MISS),
      }));
    }

    // ゲーム終了判定
    if (engineRef.current.isGameFinished(currentTime)) {
      setGameState((prev) => {
        const finalState = { ...prev, isPlaying: false };
        onGameEnd(finalState);
        return finalState;
      });
      return;
    }

    // 次のフレームをリクエスト
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, getCurrentTime, onGameEnd]);

  // ゲームループの開始/停止
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameLoop]);

  // 入力処理
  const handleInput = useCallback(
    (noteType: NoteType): JudgementResult | null => {
      if (!engineRef.current || !gameState.isPlaying) return null;

      const currentTime = getCurrentTime();
      const result = engineRef.current.judgeInput(noteType, currentTime, gameState);

      if (result) {
        setLastJudgement(result);

        // 判定表示を一定時間後にクリア
        setTimeout(() => setLastJudgement(null), GAME_CONFIG.JUDGEMENT_DISPLAY_DURATION);

        // ゲーム状態を更新
        setGameState((prev) => ({
          ...prev,
          score: prev.score + result.score,
          combo: result.combo,
          maxCombo: Math.max(prev.maxCombo, result.combo),
          judgements: {
            ...prev.judgements,
            [result.type]: prev.judgements[result.type] + 1,
          },
        }));
      }

      return result;
    },
    [gameState, getCurrentTime]
  );

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => {
      const finalState = { ...prev, isPlaying: false };
      onGameEnd(finalState);
      return finalState;
    });
  }, [onGameEnd]);

  return {
    gameState,
    activeNotes,
    lastJudgement,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    handleInput,
  };
}
