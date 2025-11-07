'use client';

import { GAME_CONFIG } from '@/constants/gameConfig';

export default function JudgementLine() {
  return (
    <>
      {/* ノーツレーン */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute h-32 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            right: 0,
          }}
        >
          {/* レーングリッドライン */}
          <div className="absolute top-0 bottom-0 left-0 right-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-white/30"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 判定ライン */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${GAME_CONFIG.DRUM_POSITION_X}px`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* メインライン */}
        <div className="relative">
          {/* グロー効果 */}
          <div
            className="absolute w-2 h-40 bg-gradient-to-b from-yellow-400/0 via-yellow-400/80 to-yellow-400/0 blur-xl animate-pulse-glow"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          {/* 実線 */}
          <div
            className="absolute w-1 h-40 bg-gradient-to-b from-white/0 via-white to-white/0"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 215, 0, 0.6)',
            }}
          />
        </div>

        {/* 判定サークル */}
        <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-24 h-24 rounded-full border-4 border-yellow-400/60 animate-pulse-ring" />
          <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-white/40" />
        </div>
      </div>
    </>
  );
}
