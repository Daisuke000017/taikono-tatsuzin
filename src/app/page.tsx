'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Difficulty } from '@/types/game';
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from '@/constants/gameConfig';
import { getRanking } from '@/lib/rankingStorage';
import RankingTable from '@/components/ui/RankingTable';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SakuraPetals from '@/components/ui/SakuraPetals';

export default function HomePage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [selectedTab, setSelectedTab] = useState<'songs' | 'ranking'>('songs');
  const [selectedSongForRanking, setSelectedSongForRanking] = useState<string>('sample-01');

  // 利用可能な楽曲リスト
  const songs = [
    {
      id: 'sample-01',
      title: 'サンプル曲 1',
      artist: 'Traditional Rhythm',
      coverImage: '/assets/images/cover-01.svg',
    },
    {
      id: 'sample-02',
      title: 'サンプル曲 2',
      artist: 'Electronic Beats',
      coverImage: '/assets/images/cover-02.svg',
    },
    {
      id: 'sample-03',
      title: 'サンプル曲 3',
      artist: 'Happy Pop',
      coverImage: '/assets/images/cover-03.svg',
    },
    {
      id: 'sample-04',
      title: 'ロックビート',
      artist: 'Rock Master',
      coverImage: '/assets/images/cover-04.svg',
    },
    {
      id: 'sample-05',
      title: '静かなる旋律',
      artist: 'Peaceful Journey',
      coverImage: '/assets/images/cover-05.svg',
    },
  ];

  const handleStart = (songId: string) => {
    router.push(`/game?song=${songId}&difficulty=${selectedDifficulty}`);
  };

  const currentRankings = getRanking(selectedSongForRanking, selectedDifficulty);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* アニメーション背景 */}
      <AnimatedBackground />

      {/* 桜の花びら */}
      <SakuraPetals />

      {/* タイトル */}
      <div className="text-center mb-12 relative z-10">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl animate-pulse-slow" />
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mb-4 drop-shadow-2xl relative animate-shimmer"
              style={{
                textShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
                backgroundSize: '200% auto',
              }}>
            太鼓の達人風
          </h1>
        </div>
        <p className="text-3xl text-white font-bold tracking-widest drop-shadow-lg">
          リズムゲーム
        </p>
      </div>

      {/* タブ切り替え */}
      <div className="mb-8 flex gap-4 relative z-10">
        <button
          onClick={() => setSelectedTab('songs')}
          className={`px-10 py-4 rounded-xl font-black text-xl transition-all duration-300 border-2 ${
            selectedTab === 'songs'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-yellow-400 scale-105 shadow-lg shadow-yellow-500/50'
              : 'bg-black/40 text-white border-white/30 hover:bg-black/60 backdrop-blur-md'
          }`}
        >
          🎵 楽曲を選ぶ
        </button>
        <button
          onClick={() => setSelectedTab('ranking')}
          className={`px-10 py-4 rounded-xl font-black text-xl transition-all duration-300 border-2 ${
            selectedTab === 'ranking'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-yellow-400 scale-105 shadow-lg shadow-yellow-500/50'
              : 'bg-black/40 text-white border-white/30 hover:bg-black/60 backdrop-blur-md'
          }`}
        >
          🏆 ランキング
        </button>
      </div>

      {/* 難易度選択 */}
      <div className="mb-12 relative z-10">
        <h2 className="text-3xl font-black text-white mb-6 text-center drop-shadow-lg">
          難易度を選択
        </h2>
        <div className="flex gap-5 flex-wrap justify-center">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`
                px-10 py-5 rounded-xl font-black text-xl transition-all duration-300 border-3
                ${
                  selectedDifficulty === diff
                    ? 'scale-110 shadow-2xl border-white'
                    : 'opacity-80 hover:opacity-100 hover:scale-105 border-transparent'
                }
              `}
              style={{
                backgroundColor: DIFFICULTY_COLORS[diff],
                color: 'white',
                boxShadow: selectedDifficulty === diff
                  ? `0 0 30px ${DIFFICULTY_COLORS[diff]}80`
                  : 'none',
              }}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl w-full relative z-10">
        {selectedTab === 'songs' ? (
          <>
            <h2 className="text-3xl font-black text-white mb-8 text-center drop-shadow-lg">
              楽曲を選択
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {songs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleStart(song.id)}
                  className="
                    group
                    bg-gradient-to-br from-purple-600 via-pink-600 to-red-600
                    hover:from-purple-500 hover:via-pink-500 hover:to-red-500
                    text-white rounded-2xl overflow-hidden
                    transition-all duration-300 hover:scale-105
                    shadow-lg hover:shadow-2xl hover:shadow-purple-500/50
                    border-2 border-purple-400/30
                    relative
                  "
                >
                  {/* グローエフェクト */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* カバー画像 */}
                  <div className="relative h-48 bg-black/20 overflow-hidden">
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* 楽曲情報 */}
                  <div className="p-6 relative">
                    <h3 className="text-2xl font-black mb-2 drop-shadow-md">{song.title}</h3>
                    <p className="text-sm opacity-90 mb-4 font-semibold">{song.artist}</p>
                    <div className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-black py-2 px-4 rounded-lg group-hover:bg-yellow-300 transition-colors">
                      <span>プレイ</span>
                      <span className="text-xl">▶</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black text-white mb-8 text-center drop-shadow-lg">
              ランキング
            </h2>

            {/* 楽曲選択タブ（ランキング用） */}
            <div className="mb-8 flex gap-3 flex-wrap justify-center">
              {songs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => setSelectedSongForRanking(song.id)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${
                    selectedSongForRanking === song.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg shadow-purple-500/50 border-purple-400'
                      : 'bg-black/40 text-gray-300 hover:bg-black/60 border-white/20 backdrop-blur-md'
                  }`}
                >
                  {song.title}
                </button>
              ))}
            </div>

            {/* ランキング表示 */}
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <RankingTable rankings={currentRankings} />
            </div>
          </>
        )}
      </div>

      {/* 操作説明 */}
      {selectedTab === 'songs' && (
        <div className="mt-16 max-w-3xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-500/30 relative z-10">
          <h3 className="text-2xl font-black text-yellow-400 mb-6 text-center drop-shadow-lg">
            操作方法
          </h3>
          <div className="grid grid-cols-2 gap-8 text-white">
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 p-6 rounded-xl border border-red-500/30">
              <span className="text-don font-black text-2xl block mb-3 drop-shadow-lg">ドン（面）</span>
              <div className="text-lg font-bold bg-black/30 px-4 py-2 rounded-lg inline-block">
                F キー / J キー
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-6 rounded-xl border border-blue-500/30">
              <span className="text-ka font-black text-2xl block mb-3 drop-shadow-lg">カッ（縁）</span>
              <div className="text-lg font-bold bg-black/30 px-4 py-2 rounded-lg inline-block">
                D キー / K キー
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-yellow-200/90 text-sm font-semibold">
            🎮 ゲームパッド対応
          </div>
        </div>
      )}
    </div>
  );
}
