'use client';

import { useEffect } from 'react';

interface ComboMilestoneEffectProps {
  combo: number;
  onComplete: () => void;
}

export default function ComboMilestoneEffect({ combo, onComplete }: ComboMilestoneEffectProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getMessage = () => {
    if (combo >= 200) return '200 COMBO!!';
    if (combo >= 100) return '100 COMBO!!';
    if (combo >= 50) return '50 COMBO!';
    return '';
  };

  const getColor = () => {
    if (combo >= 200) return '#FF1493'; // ピンク
    if (combo >= 100) return '#FFD700'; // ゴールド
    if (combo >= 50) return '#00FF88'; // グリーン
    return '#FFFFFF';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className="text-8xl font-black animate-combo-milestone"
        style={{
          color: getColor(),
          textShadow: `0 0 40px ${getColor()}, 0 0 80px ${getColor()}`,
          WebkitTextStroke: '3px #000',
        }}
      >
        {getMessage()}
      </div>

      {/* 花火エフェクト */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 20;
          const distance = 200 + Math.random() * 100;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          return (
            <div
              key={i}
              className="absolute animate-firework"
              style={{
                left: '50%',
                top: '50%',
                width: '16px',
                height: '16px',
                backgroundColor: getColor(),
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                '--firework-x': `${x}px`,
                '--firework-y': `${y}px`,
                animationDelay: `${i * 50}ms`,
                boxShadow: `0 0 20px ${getColor()}`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );
}
