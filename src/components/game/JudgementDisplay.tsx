'use client';

import React, { useEffect, useState } from 'react';
import { JudgementType } from '@/types/game';

interface JudgementDisplayProps {
  judgement: JudgementType | null;
  timing?: number;
}

export default function JudgementDisplay({ judgement, timing }: JudgementDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (judgement) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [judgement]);

  if (!visible || !judgement) return null;

  const getJudgementStyle = () => {
    switch (judgement) {
      case 'perfect':
        return {
          text: '完璧！',
          englishText: 'PERFECT',
          color: 'text-perfect',
          scale: 'scale-150',
          glow: '0 0 40px rgba(0, 255, 136, 0.8), 0 0 80px rgba(0, 255, 136, 0.4)',
        };
      case 'good':
        return {
          text: 'いいね！',
          englishText: 'GOOD',
          color: 'text-good',
          scale: 'scale-125',
          glow: '0 0 30px rgba(255, 170, 0, 0.8), 0 0 60px rgba(255, 170, 0, 0.4)',
        };
      case 'miss':
        return {
          text: 'ミス...',
          englishText: 'MISS',
          color: 'text-miss',
          scale: 'scale-110',
          glow: '0 0 20px rgba(255, 51, 51, 0.6)',
        };
    }
  };

  const style = getJudgementStyle();

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
      <div className={`flex flex-col items-center ${style.scale} transition-all duration-200`}>
        {/* メインテキスト（日本語） */}
        <div
          className={`
            ${style.color}
            text-7xl font-black
            animate-pulse
            transition-all duration-300
          `}
          style={{
            textShadow: style.glow,
            WebkitTextStroke: '2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {style.text}
        </div>

        {/* 英語サブテキスト */}
        <div
          className={`
            ${style.color}
            text-3xl font-bold tracking-widest mt-1
            opacity-90
          `}
          style={{
            textShadow: '0 0 10px currentColor',
          }}
        >
          {style.englishText}
        </div>

        {/* タイミング表示 */}
        {timing !== undefined && Math.abs(timing) > 0 && (
          <div className="mt-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <div className="text-white text-lg font-bold">
              {timing > 0 ? '+' : ''}{timing.toFixed(0)}ms
            </div>
          </div>
        )}

        {/* 装飾エフェクト */}
        {judgement === 'perfect' && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-perfect opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
}
