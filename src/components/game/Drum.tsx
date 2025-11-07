'use client';

import React from 'react';
import { NoteType } from '@/types/game';

interface DrumProps {
  isHit?: boolean;
  hitType?: NoteType;
  size?: number;
}

export default function Drum({ isHit = false, hitType, size = 120 }: DrumProps) {
  const strokeColor = hitType === 'don' ? '#FF4444' : hitType === 'ka' ? '#4488FF' : '#8B4513';

  return (
    <div className={`transition-transform duration-150 ${isHit ? 'scale-110' : 'scale-100'}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* 外枠 - 木製の太鼓 */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="3"
        />

        {/* 太鼓の面 */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="#F5F5DC"
          stroke={strokeColor}
          strokeWidth={isHit ? '4' : '2'}
          className="transition-all duration-150"
        />

        {/* 中心の円 */}
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="none"
          stroke="#DDD"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* 和風模様 - 十字 */}
        <line
          x1="60"
          y1="25"
          x2="60"
          y2="95"
          stroke="#DDD"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <line
          x1="25"
          y1="60"
          x2="95"
          y2="60"
          stroke="#DDD"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* ヒット時のエフェクト */}
        {isHit && (
          <>
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              opacity="0.6"
              className="animate-ripple"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill={strokeColor}
              opacity="0.2"
              className="animate-pulse"
            />
          </>
        )}

        {/* 中央の判定マーク */}
        <circle
          cx="60"
          cy="60"
          r="5"
          fill={isHit ? strokeColor : '#999'}
          className="transition-colors duration-150"
        />
      </svg>

      {/* 判定ライン */}
      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-[-10px] w-1 h-24 bg-accent opacity-30" />
    </div>
  );
}
