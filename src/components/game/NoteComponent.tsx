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
  const isDon = note.type === 'don';
  const color = isDon ? '#FF4444' : '#4488FF';
  const label = isDon ? 'ドン' : 'カッ';

  // 画面外なら表示しない
  if (position < -size || position > window.innerWidth + size) {
    return null;
  }

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
