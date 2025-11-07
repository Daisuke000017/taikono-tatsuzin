'use client';

import React from 'react';
import { Note, NoteType } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface NoteComponentProps {
  note: Note;
  position: number;
  isHit?: boolean;
}

export default function NoteComponent({ note, position, isHit = false }: NoteComponentProps) {
  const size = GAME_CONFIG.NOTE_SIZE;
  const isRoll = note.type === 'don-roll';
  const isDon = note.type === 'don';
  const color = isRoll ? '#FFD700' : (isDon ? '#FF4444' : '#4488FF');
  const label = isRoll ? '連打' : (isDon ? 'ドン' : 'カッ');

  // 画面外なら表示しない
  if (position < -size || position > window.innerWidth + size) {
    return null;
  }

  // 連打ノーツの場合、長い棒状に表示
  if (isRoll && note.endTime) {
    const duration = note.endTime - note.time;
    const rollWidth = Math.max(100, duration / 10); // 最低100px、時間に応じて伸びる

    return (
      <div
        className={`absolute transition-opacity duration-300 ${
          isHit ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
        }`}
        style={{
          left: `${position}px`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${rollWidth}px`,
          height: `${size}px`,
        }}
      >
        <svg
          width={rollWidth}
          height={size}
          viewBox={`0 0 ${rollWidth} 60`}
          xmlns="http://www.w3.org/2000/svg"
          className={isHit ? 'animate-note-hit' : ''}
        >
          <defs>
            <linearGradient id={`roll-gradient-${note.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 連打バー */}
          <rect
            x="0"
            y="10"
            width={rollWidth}
            height="40"
            rx="20"
            fill={`url(#roll-gradient-${note.id})`}
            stroke="#FF8C00"
            strokeWidth="3"
          />

          {/* 連打パターン（斜線） */}
          {Array.from({ length: Math.floor(rollWidth / 15) }).map((_, i) => (
            <line
              key={i}
              x1={i * 15}
              y1="10"
              x2={i * 15 + 15}
              y2="50"
              stroke="white"
              strokeWidth="2"
              opacity="0.4"
            />
          ))}

          {/* テキスト */}
          <text
            x={rollWidth / 2}
            y="35"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            style={{ userSelect: 'none' }}
          >
            {label}
          </text>
        </svg>
      </div>
    );
  }

  // 通常ノーツの表示
  return (
    <div
      className={`absolute transition-opacity duration-300 ${
        isHit ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
      }`}
      style={{
        left: `${position}px`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
        className={isHit ? 'animate-note-hit' : ''}
      >
        {/* グラデーション定義 */}
        <defs>
          <radialGradient id={`gradient-${note.id}`} cx="40%" cy="40%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* ノーツの円 */}
        <circle
          cx="30"
          cy="30"
          r="28"
          fill={`url(#gradient-${note.id})`}
          stroke={color}
          strokeWidth="2"
        />

        {/* 内側の円 */}
        <circle
          cx="30"
          cy="30"
          r="22"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* テキスト */}
        <text
          x="30"
          y="35"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
