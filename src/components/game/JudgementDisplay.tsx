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
          text: 'PERFECT!',
          color: 'text-perfect',
          scale: 'scale-125',
        };
      case 'good':
        return {
          text: 'GOOD',
          color: 'text-good',
          scale: 'scale-110',
        };
      case 'miss':
        return {
          text: 'MISS',
          color: 'text-miss',
          scale: 'scale-100',
        };
    }
  };

  const style = getJudgementStyle();

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div
        className={`
          ${style.color} ${style.scale}
          text-6xl font-bold
          animate-pulse
          drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]
          transition-all duration-300
        `}
        style={{
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
        }}
      >
        {style.text}
      </div>
      {timing !== undefined && Math.abs(timing) > 0 && (
        <div className="text-center text-white text-lg mt-2">
          {timing > 0 ? '+' : ''}{timing.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}
