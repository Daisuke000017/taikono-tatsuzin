'use client';

import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

export default function SakuraPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // 桜の花びらを生成
    const petalCount = 15;
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: -10 - Math.random() * 20,
      size: 10 + Math.random() * 15,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      drift: -10 + Math.random() * 20,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall-petal"
          style={{
            left: `${petal.x}%`,
            top: `${petal.startY}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            '--drift-x': `${petal.drift}px`,
          } as React.CSSProperties}
        >
          {/* 桜の花びらSVG */}
          <svg viewBox="0 0 20 20" className="w-full h-full opacity-70">
            <path
              d="M10 2 Q12 5, 10 10 Q15 8, 18 10 Q15 12, 10 10 Q12 15, 10 18 Q8 15, 10 10 Q5 12, 2 10 Q5 8, 10 10 Q8 5, 10 2"
              fill="#FFB7C5"
              opacity="0.8"
            />
            <circle cx="10" cy="10" r="2" fill="#FF69B4" opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
