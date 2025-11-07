'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GameEngine } from '@/lib/gameEngine';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useInputHandler } from '@/hooks/useInputHandler';
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

  useInputHandler(handleInput);

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
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-white">
        <div className="bg-black/50 px-6 py-3 rounded-lg">
          <div className="text-don font-bold text-xl mb-1">ドン</div>
          <div className="text-sm">[F] [J]</div>
        </div>
        <div className="bg-black/50 px-6 py-3 rounded-lg">
          <div className="text-ka font-bold text-xl mb-1">カッ</div>
          <div className="text-sm">[D] [K]</div>
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
