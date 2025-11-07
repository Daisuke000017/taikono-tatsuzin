'use client';

import React from 'react';
import { GameState } from '@/types/game';

interface ScoreDisplayProps {
  gameState: GameState;
}

export default function ScoreDisplay({ gameState }: ScoreDisplayProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* 左側 - スコア */}
        <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-yellow-500/30">
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 drop-shadow-2xl animate-shimmer">
            {gameState.score.toLocaleString()}
          </div>
          <div className="text-sm text-yellow-200/80 font-bold tracking-wider">SCORE</div>
        </div>

        {/* 中央 - コンボ */}
        <div className="flex flex-col items-center relative">
          <div
            className={`text-7xl font-black transition-all duration-300 relative ${
              gameState.combo >= 50
                ? 'text-accent scale-125 animate-pulse-combo'
                : gameState.combo >= 10
                ? 'text-perfect scale-110'
                : 'text-white'
            }`}
            style={{
              textShadow: gameState.combo >= 50
                ? '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4)'
                : gameState.combo >= 10
                ? '0 0 20px rgba(0, 255, 136, 0.6)'
                : '0 0 10px rgba(255, 255, 255, 0.5)',
              WebkitTextStroke: '2px rgba(0, 0, 0, 0.5)',
            }}
          >
            {gameState.combo}
          </div>
          <div className="text-xl text-white/90 font-bold tracking-widest mt-2 bg-black/30 px-4 py-1 rounded-full">
            COMBO
          </div>
          {gameState.combo >= 50 && (
            <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" />
          )}
        </div>

        {/* 右側 - 統計 */}
        <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl border border-purple-500/30">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center gap-4">
              <span className="text-perfect font-bold text-shadow">Perfect:</span>
              <span className="font-black text-white text-lg">{gameState.judgements.perfect}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-good font-bold text-shadow">Good:</span>
              <span className="font-black text-white text-lg">{gameState.judgements.good}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-miss font-bold text-shadow">Miss:</span>
              <span className="font-black text-white text-lg">{gameState.judgements.miss}</span>
            </div>
          </div>
          <div className="text-xs text-purple-200/80 font-semibold border-t border-purple-500/30 pt-2 mt-1">
            Max Combo: <span className="text-white font-bold">{gameState.maxCombo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
