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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* タイトル */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-accent mb-4 text-shadow">
          太鼓の達人風
        </h1>
        <p className="text-2xl text-gray-300">リズムゲーム</p>
      </div>

      {/* タブ切り替え */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setSelectedTab('songs')}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
            selectedTab === 'songs'
              ? 'bg-accent text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          楽曲を選ぶ
        </button>
        <button
          onClick={() => setSelectedTab('ranking')}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
            selectedTab === 'ranking'
              ? 'bg-accent text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          ランキング
        </button>
      </div>

      {/* 難易度選択 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          難易度を選択
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
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

      {/* メインコンテンツ */}
      <div className="max-w-6xl w-full">
        {selectedTab === 'songs' ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">楽曲を選択</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {songs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleStart(song.id)}
                  className="
                    bg-gradient-to-br from-purple-600 to-pink-600
                    hover:from-purple-700 hover:to-pink-700
                    text-white rounded-xl overflow-hidden
                    transition-all hover:scale-105
                    shadow-lg hover:shadow-2xl
                  "
                >
                  {/* カバー画像 */}
                  <div className="relative h-48 bg-black/20">
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 楽曲情報 */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{song.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{song.artist}</p>
                    <div className="flex items-center justify-center gap-2 text-accent font-bold">
                      <span>プレイ</span>
                      <span className="text-2xl">▶</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">ランキング</h2>

            {/* 楽曲選択タブ（ランキング用） */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {songs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => setSelectedSongForRanking(song.id)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    selectedSongForRanking === song.id
                      ? 'bg-purple-600 text-white scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {song.title}
                </button>
              ))}
            </div>

            {/* ランキング表示 */}
            <RankingTable rankings={currentRankings} />
          </>
        )}
      </div>

      {/* 操作説明 */}
      {selectedTab === 'songs' && (
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
      )}
    </div>
  );
}
