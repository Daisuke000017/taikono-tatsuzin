'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Difficulty } from '@/types/game';
import { calculateRank } from '@/lib/scoreCalculator';
import { addRankingEntry, getRanking } from '@/lib/rankingStorage';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/constants/gameConfig';

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [playerName, setPlayerName] = useState('プレイヤー');

  const songId = searchParams.get('song') || '';
  const difficulty = (searchParams.get('difficulty') || 'normal') as Difficulty;
  const score = parseInt(searchParams.get('score') || '0');
  const combo = parseInt(searchParams.get('combo') || '0');
  const perfect = parseInt(searchParams.get('perfect') || '0');
  const good = parseInt(searchParams.get('good') || '0');
  const miss = parseInt(searchParams.get('miss') || '0');

  const totalNotes = perfect + good + miss;
  const rank = calculateRank(score, 1000000);

  const handleSaveRanking = () => {
    const entry = {
      playerName,
      score,
      maxCombo: combo,
      difficulty,
      perfectCount: perfect,
      goodCount: good,
      missCount: miss,
      playedAt: new Date().toISOString(),
      rank,
    };

    addRankingEntry(songId, entry);
    alert('ランキングに保存しました！');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* リザルトカード */}
      <div className="max-w-2xl w-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-12 shadow-2xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-4">RESULT</h1>
          <div
            className="inline-block px-6 py-2 rounded-full text-white font-bold text-xl"
            style={{ backgroundColor: DIFFICULTY_COLORS[difficulty] }}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </div>
        </div>

        {/* ランク */}
        <div className="text-center mb-8">
          <div
            className={`
              text-9xl font-black mb-4
              ${rank === 'S' ? 'text-accent' : ''}
              ${rank === 'A' ? 'text-perfect' : ''}
              ${rank === 'B' ? 'text-good' : ''}
              ${rank === 'C' ? 'text-gray-400' : ''}
              ${rank === 'D' ? 'text-miss' : ''}
            `}
            style={{
              textShadow: '0 0 30px currentColor',
            }}
          >
            {rank}
          </div>
        </div>

        {/* スコア */}
        <div className="text-center mb-8">
          <div className="text-6xl font-black text-accent mb-2">
            {score.toLocaleString()}
          </div>
          <div className="text-xl text-gray-300">SCORE</div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">{combo}</div>
            <div className="text-sm text-gray-300">MAX COMBO</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {((perfect / totalNotes) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">ACCURACY</div>
          </div>
        </div>

        {/* 判定詳細 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-perfect font-bold text-sm mb-1">PERFECT</div>
            <div className="text-2xl font-bold text-white">{perfect}</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-good font-bold text-sm mb-1">GOOD</div>
            <div className="text-2xl font-bold text-white">{good}</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-miss font-bold text-sm mb-1">MISS</div>
            <div className="text-2xl font-bold text-white">{miss}</div>
          </div>
        </div>

        {/* プレイヤー名入力 */}
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2">
            プレイヤー名
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={10}
            className="w-full px-4 py-2 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="プレイヤー名を入力"
          />
        </div>

        {/* ボタン */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveRanking}
            className="flex-1 bg-accent hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all hover:scale-105"
          >
            ランキングに保存
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105"
          >
            タイトルに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-white">Loading...</div></div>}>
      <ResultPageContent />
    </Suspense>
  );
}
