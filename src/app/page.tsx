'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Difficulty } from '@/types/game';
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from '@/constants/gameConfig';

export default function HomePage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  // 利用可能な楽曲リスト（プロトタイプ版）
  const songs = [
    {
      id: 'sample-01',
      title: 'サンプル曲 1',
      artist: '太鼓の達人',
    },
  ];

  const handleStart = (songId: string) => {
    router.push(`/game?song=${songId}&difficulty=${selectedDifficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* タイトル */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-accent mb-4 text-shadow">
          太鼓の達人風
        </h1>
        <p className="text-2xl text-gray-300">リズムゲーム</p>
      </div>

      {/* 難易度選択 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          難易度を選択
        </h2>
        <div className="flex gap-4">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all
                ${
                  selectedDifficulty === diff
                    ? 'scale-110 shadow-2xl'
                    : 'opacity-70 hover:opacity-100'
                }
              `}
              style={{
                backgroundColor: DIFFICULTY_COLORS[diff],
                color: 'white',
              }}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
      </div>

      {/* 楽曲リスト */}
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-white mb-6">楽曲を選択</h2>
        <div className="grid gap-4">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => handleStart(song.id)}
              className="
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700
                text-white p-8 rounded-xl
                transition-all hover:scale-105
                shadow-lg hover:shadow-2xl
              "
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h3 className="text-3xl font-bold mb-2">{song.title}</h3>
                  <p className="text-lg opacity-90">{song.artist}</p>
                </div>
                <div className="text-6xl">▶</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 操作説明 */}
      <div className="mt-12 max-w-2xl bg-black/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">操作方法</h3>
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <span className="text-don font-bold">ドン（面）</span>
            <div className="text-sm mt-1">F キー / J キー</div>
          </div>
          <div>
            <span className="text-ka font-bold">カッ（縁）</span>
            <div className="text-sm mt-1">D キー / K キー</div>
          </div>
        </div>
      </div>
    </div>
  );
}
