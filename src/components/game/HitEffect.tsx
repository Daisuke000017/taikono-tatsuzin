'use client';

import { useEffect, useState } from 'react';
import { NoteType } from '@/types/game';

interface HitEffectProps {
  noteType: NoteType;
  onComplete: () => void;
}

export default function HitEffect({ noteType, onComplete }: HitEffectProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    // パーティクルを生成
    const particleCount = 12;
    const color = noteType === 'don' || noteType === 'don-roll'
      ? '#FF4444'
      : '#4488FF';

    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 2;

      return {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 8 + Math.random() * 4,
      };
    });

    setParticles(newParticles);

    // エフェクト終了後にクリーンアップ
    const timer = setTimeout(() => {
      onComplete();
    }, 600);

    return () => clearTimeout(timer);
  }, [noteType, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-burst"
          style={{
            left: '50%',
            top: '50%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            '--particle-vx': `${particle.vx * 30}px`,
            '--particle-vy': `${particle.vy * 30}px`,
            boxShadow: `0 0 10px ${particle.color}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
