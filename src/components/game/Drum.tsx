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
  const glowColor = hitType === 'don' ? 'rgba(255, 68, 68, 0.6)' : hitType === 'ka' ? 'rgba(68, 136, 255, 0.6)' : 'rgba(139, 69, 19, 0.6)';

  return (
    <div
      className={`relative transition-all duration-150 ${isHit ? 'scale-110 animate-drum-hit' : 'scale-100'}`}
      style={{
        filter: isHit ? `drop-shadow(0 0 30px ${glowColor})` : 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 木製フレームのグラデーション */}
          <radialGradient id="woodGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </radialGradient>

          {/* 太鼓面のグラデーション */}
          <radialGradient id="drumSurfaceGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#FFFAF0" />
            <stop offset="60%" stopColor="#F5F5DC" />
            <stop offset="100%" stopColor="#DEB887" />
          </radialGradient>

          {/* 内側の影 */}
          <radialGradient id="innerShadow" cx="50%" cy="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.2)" />
          </radialGradient>

          {/* ヒット時のグロー */}
          <radialGradient id="hitGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 外側の影（3D効果） */}
        <ellipse
          cx="60"
          cy="65"
          rx="56"
          ry="54"
          fill="rgba(0, 0, 0, 0.3)"
          filter="blur(4px)"
        />

        {/* 外枠 - 木製の太鼓フレーム */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#woodGradient)"
          stroke="#3E2723"
          strokeWidth="2"
        />

        {/* 木目テクスチャ */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M ${60 + Math.cos((i * Math.PI) / 4) * 50} ${60 + Math.sin((i * Math.PI) / 4) * 50}
                Q ${60 + Math.cos((i * Math.PI) / 4 + 0.2) * 45} ${60 + Math.sin((i * Math.PI) / 4 + 0.2) * 45}
                  ${60 + Math.cos((i * Math.PI) / 4 + 0.4) * 50} ${60 + Math.sin((i * Math.PI) / 4 + 0.4) * 50}`}
            stroke="#654321"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
        ))}

        {/* 太鼓の面 - メインサーフェス */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="url(#drumSurfaceGradient)"
        />

        {/* 太鼓面の縁取り（装飾的な金具） */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="url(#woodGradient)"
          strokeWidth="2"
        />

        {/* 装飾リング */}
        {[42, 36].map((radius, i) => (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}

        {/* 和風模様 - 巴紋（ともえもん） */}
        <g opacity="0.15">
          {[0, 120, 240].map((angle, i) => (
            <path
              key={i}
              d={`M 60 60 Q ${60 + Math.cos((angle * Math.PI) / 180) * 25} ${60 + Math.sin((angle * Math.PI) / 180) * 25}
                  ${60 + Math.cos((angle * Math.PI) / 180 + 0.5) * 30} ${60 + Math.sin((angle * Math.PI) / 180 + 0.5) * 30}`}
              stroke="#8B4513"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* 内側の影 */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="url(#innerShadow)"
        />

        {/* ヒット時のエフェクト */}
        {isHit && (
          <>
            {/* パルスリング */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              opacity="0.8"
              className="animate-ripple"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              opacity="0.6"
              className="animate-ripple"
              style={{ animationDelay: '0.1s' }}
            />

            {/* グロー効果 */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="url(#hitGlow)"
              className="animate-pulse"
            />

            {/* フラッシュ効果 */}
            <circle
              cx="60"
              cy="60"
              r="20"
              fill={strokeColor}
              opacity="0.4"
            />
          </>
        )}

        {/* 中央のターゲットエリア */}
        <circle
          cx="60"
          cy="60"
          r="8"
          fill={isHit ? strokeColor : '#B8860B'}
          stroke={isHit ? 'white' : '#DAA520'}
          strokeWidth="2"
          className="transition-all duration-150"
          style={{
            filter: isHit ? `drop-shadow(0 0 10px ${glowColor})` : 'none',
          }}
        />

        {/* 中央マークの装飾 */}
        {!isHit && (
          <circle
            cx="60"
            cy="60"
            r="8"
            fill="none"
            stroke="#FFD700"
            strokeWidth="1"
            opacity="0.6"
            className="animate-pulse-ring"
          />
        )}
      </svg>
    </div>
  );
}
