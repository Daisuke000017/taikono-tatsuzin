'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GameEngine } from '@/lib/gameEngine';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useInputHandler } from '@/hooks/useInputHandler';
import { useGamepadInput } from '@/hooks/useGamepadInput';
import Drum from '@/components/game/Drum';
import NoteComponent from '@/components/game/NoteComponent';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import JudgementDisplay from '@/components/game/JudgementDisplay';
import { Song, Difficulty, GameState, NoteType } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [song, setSong] = useState<Song | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isLoading, setIsLoading] = useState(true);
  const [drumHit, setDrumHit] = useState<{ isHit: boolean; type?: NoteType }>({
    isHit: false,
  });

  const audio = useAudioEngine();

  // URLパラメータから楽曲と難易度を取得
  useEffect(() => {
    const songId = searchParams.get('song');
    const diff = searchParams.get('difficulty') as Difficulty;

    if (!songId || !diff) {
      router.push('/');
      return;
    }

    setDifficulty(diff);

    // 楽曲データを読み込み
    fetch(`/assets/charts/${songId}.json`)
      .then((res) => res.json())
      .then((data: Song) => {
        setSong(data);
        // 音声を読み込み（プロトタイプでは実際の音声ファイルがないため、エラーは無視）
        audio.loadAudio(data.audioFile).catch(() => {
          console.warn('Audio file not found, using silent mode');
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load song:', error);
        router.push('/');
      });
  }, [searchParams, router, audio]);

  const handleGameEnd = (finalState: GameState) => {
    // リザルト画面へ遷移
    const params = new URLSearchParams({
      song: song?.id || '',
      difficulty,
      score: finalState.score.toString(),
      combo: finalState.maxCombo.toString(),
      perfect: finalState.judgements.perfect.toString(),
      good: finalState.judgements.good.toString(),
      miss: finalState.judgements.miss.toString(),
    });
    router.push(`/result?${params.toString()}`);
  };

  const gameLoop = useGameLoop({
    notes: song?.difficulties[difficulty]?.notes || [],
    difficulty,
    getCurrentTime: audio.getCurrentTime,
    onGameEnd: handleGameEnd,
  });

  const handleInput = (noteType: NoteType) => {
    const result = gameLoop.handleInput(noteType);
    if (result && result.type !== 'miss') {
      audio.playHitSound(noteType);
      audio.playJudgementSound(result.type);

      // 太鼓ヒットアニメーション
      setDrumHit({ isHit: true, type: noteType });
      setTimeout(() => setDrumHit({ isHit: false }), 150);
    }
  };

  const handleBackToHome = () => {
    audio.stop();
    gameLoop.endGame();
    router.push('/');
  };

  // キーボード入力
  useInputHandler(handleInput);

  // ゲームパッド入力（標準コントローラー + 太鼓コントローラー対応）
  useGamepadInput(handleInput);

  // ゲーム開始
  useEffect(() => {
    if (!isLoading && song && audio.isLoaded) {
      const timer = setTimeout(() => {
        gameLoop.startGame();
        audio.play();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, song, audio.isLoaded]);

  if (isLoading || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  const engine = new GameEngine(
    song.difficulties[difficulty].notes,
    difficulty
  );

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* ホームに戻るボタン */}
      <button
        onClick={handleBackToHome}
        className="absolute top-4 left-4 z-50 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        aria-label="ホームに戻る"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm font-bold">ホーム</span>
      </button>

      {/* スコア表示 */}
      <ScoreDisplay gameState={gameLoop.gameState} />

      {/* ゲームエリア */}
      <div className="h-screen flex items-center relative">
        {/* 太鼓 */}
        <div
          className="absolute z-20"
          style={{
            left: `${GAME_CONFIG.DRUM_POSITION_X}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <Drum
            isHit={drumHit.isHit}
            hitType={drumHit.type}
            size={150}
          />
        </div>

        {/* ノーツ */}
        <div className="absolute inset-0 pointer-events-none">
          {gameLoop.activeNotes.map((note) => {
            const position = engine.getNotePosition(
              note,
              audio.getCurrentTime()
            );
            return (
              <NoteComponent
                key={note.id}
                note={note}
                position={position}
              />
            );
          })}
        </div>

        {/* 判定表示 */}
        {gameLoop.lastJudgement && (
          <JudgementDisplay
            judgement={gameLoop.lastJudgement.type}
            timing={gameLoop.lastJudgement.timing}
          />
        )}
      </div>

      {/* キー説明 */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 text-white">
        <div className="flex gap-8">
          <div className="bg-black/50 px-6 py-3 rounded-lg">
            <div className="text-don font-bold text-xl mb-1">ドン</div>
            <div className="text-sm">[F] [J]</div>
          </div>
          <div className="bg-black/50 px-6 py-3 rounded-lg">
            <div className="text-ka font-bold text-xl mb-1">カッ</div>
            <div className="text-sm">[D] [K]</div>
          </div>
        </div>
        <div className="bg-black/50 px-4 py-2 rounded-lg text-xs opacity-80">
          🎮 ゲームパッド対応 | ドン: A/B/下/L1 | カッ: X/Y/上/R1
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-white">Loading...</div></div>}>
      <GamePageContent />
    </Suspense>
  );
}
