'use client';

import React from 'react';
import { GameState } from '@/types/game';

interface ScoreDisplayProps {
  gameState: GameState;
}

export default function ScoreDisplay({ gameState }: ScoreDisplayProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* 左側 - スコア */}
        <div className="flex flex-col gap-2">
          <div className="text-4xl font-bold text-accent drop-shadow-lg">
            {gameState.score.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">SCORE</div>
        </div>

        {/* 中央 - コンボ */}
        <div className="flex flex-col items-center">
          <div
            className={`text-6xl font-bold transition-all duration-200 ${
              gameState.combo >= 50
                ? 'text-accent scale-110'
                : gameState.combo >= 10
                ? 'text-perfect'
                : 'text-white'
            }`}
          >
            {gameState.combo}
          </div>
          <div className="text-lg text-gray-300">COMBO</div>
        </div>

        {/* 右側 - 統計 */}
        <div className="flex flex-col gap-1 text-right">
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-perfect">Perfect: </span>
              <span className="font-bold">{gameState.judgements.perfect}</span>
            </div>
            <div>
              <span className="text-good">Good: </span>
              <span className="font-bold">{gameState.judgements.good}</span>
            </div>
            <div>
              <span className="text-miss">Miss: </span>
              <span className="font-bold">{gameState.judgements.miss}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Max Combo: {gameState.maxCombo}
          </div>
        </div>
      </div>
    </div>
  );
}
