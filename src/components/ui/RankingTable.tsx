'use client';

import React from 'react';
import { RankingEntry } from '@/types/game';

interface RankingTableProps {
  rankings: RankingEntry[];
  maxEntries?: number;
}

export default function RankingTable({ rankings, maxEntries = 10 }: RankingTableProps) {
  const displayRankings = rankings.slice(0, maxEntries);

  if (displayRankings.length === 0) {
    return (
      <div className="bg-black/30 rounded-lg p-8 text-center text-gray-400">
        まだランキングデータがありません
      </div>
    );
  }

  return (
    <div className="bg-black/30 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr className="text-left text-sm text-gray-300">
              <th className="px-4 py-3 w-16">順位</th>
              <th className="px-4 py-3">プレイヤー</th>
              <th className="px-4 py-3 text-right">スコア</th>
              <th className="px-4 py-3 text-right">コンボ</th>
              <th className="px-4 py-3 text-center">ランク</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">判定</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {displayRankings.map((entry, index) => (
              <tr
                key={index}
                className={`border-t border-gray-700/50 hover:bg-white/5 transition-colors ${
                  index === 0 ? 'bg-accent/10' : ''
                }`}
              >
                {/* 順位 */}
                <td className="px-4 py-3">
                  <div
                    className={`font-bold text-lg ${
                      index === 0
                        ? 'text-accent'
                        : index === 1
                        ? 'text-gray-300'
                        : index === 2
                        ? 'text-orange-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>

                {/* プレイヤー名 */}
                <td className="px-4 py-3">
                  <div className="font-medium">{entry.playerName}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(entry.playedAt).toLocaleDateString('ja-JP')}
                  </div>
                </td>

                {/* スコア */}
                <td className="px-4 py-3 text-right">
                  <div className="font-bold text-lg">
                    {entry.score.toLocaleString()}
                  </div>
                </td>

                {/* コンボ */}
                <td className="px-4 py-3 text-right">
                  <div className="text-perfect font-semibold">
                    {entry.maxCombo}
                  </div>
                </td>

                {/* ランク */}
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-block px-3 py-1 rounded-full font-bold ${
                      entry.rank === 'S'
                        ? 'bg-accent text-black'
                        : entry.rank === 'A'
                        ? 'bg-perfect text-black'
                        : entry.rank === 'B'
                        ? 'bg-good text-black'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {entry.rank}
                  </div>
                </td>

                {/* 判定 (PC only) */}
                <td className="px-4 py-3 text-center text-xs hidden md:table-cell">
                  <div className="flex gap-2 justify-center">
                    <span className="text-perfect">{entry.perfectCount}</span>
                    <span className="text-good">{entry.goodCount}</span>
                    <span className="text-miss">{entry.missCount}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 凡例 (モバイル用) */}
      <div className="md:hidden px-4 py-3 bg-black/30 text-xs text-gray-400 flex gap-4 justify-center">
        <span>P: Perfect</span>
        <span>G: Good</span>
        <span>M: Miss</span>
      </div>
    </div>
  );
}
