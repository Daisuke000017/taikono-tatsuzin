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
import JudgementLine from '@/components/game/JudgementLine';
import PauseMenu from '@/components/game/PauseMenu';
import HitEffect from '@/components/game/HitEffect';
import ComboMilestoneEffect from '@/components/game/ComboMilestoneEffect';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SakuraPetals from '@/components/ui/SakuraPetals';
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
  const [hitEffect, setHitEffect] = useState<{ show: boolean; type: NoteType } | null>(null);
  const [comboMilestone, setComboMilestone] = useState<number | null>(null);
  const [previousCombo, setPreviousCombo] = useState(0);

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

      // Perfect判定の場合のみヒットエフェクトを表示
      if (result.type === 'perfect') {
        setHitEffect({ show: true, type: noteType });
      }
    }
  };

  const handleBackToHome = () => {
    audio.stop();
    gameLoop.endGame();
    router.push('/');
  };

  const handlePause = () => {
    gameLoop.pauseGame();
    audio.pause();
  };

  const handleResume = () => {
    gameLoop.resumeGame();
    audio.play();
  };

  const handleRetry = () => {
    audio.stop();
    router.push(`/game?song=${searchParams.get('song')}&difficulty=${searchParams.get('difficulty')}`);
  };

  // コンボマイルストーン検出
  useEffect(() => {
    const combo = gameLoop.gameState.combo;

    // マイルストーンチェック（50, 100, 200）
    if (combo >= 50 && previousCombo < 50 && combo === 50) {
      setComboMilestone(50);
    } else if (combo >= 100 && previousCombo < 100 && combo === 100) {
      setComboMilestone(100);
    } else if (combo >= 200 && previousCombo < 200 && combo === 200) {
      setComboMilestone(200);
    }

    setPreviousCombo(combo);
  }, [gameLoop.gameState.combo, previousCombo]);

  // ESCキーでポーズ/再開
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameLoop.gameState.isPlaying) {
        e.preventDefault();
        if (gameLoop.gameState.isPaused) {
          handleResume();
        } else {
          handlePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameLoop.gameState.isPlaying, gameLoop.gameState.isPaused]);

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
      {/* アニメーション背景 */}
      <AnimatedBackground />

      {/* 桜の花びら */}
      <SakuraPetals />

      {/* ホームに戻るボタン */}
      <button
        onClick={handleBackToHome}
        className="absolute top-4 left-4 z-50 bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-red-500/50 border-2 border-red-700/50 backdrop-blur-md hover:scale-105"
        aria-label="ホームに戻る"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm font-bold tracking-wider">ホーム</span>
      </button>

      {/* スコア表示 */}
      <ScoreDisplay gameState={gameLoop.gameState} />

      {/* ゲームエリア */}
      <div className="h-screen flex items-center relative">
        {/* 判定ライン */}
        <div
          className="absolute z-10"
          style={{
            left: `${GAME_CONFIG.DRUM_POSITION_X}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <JudgementLine />
        </div>

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
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 text-white z-30">
        <div className="flex gap-6">
          <div className="bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-red-500/50 shadow-lg hover:scale-105 transition-transform">
            <div className="text-don font-black text-2xl mb-2 drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255, 68, 68, 0.8)' }}>ドン</div>
            <div className="text-sm font-bold bg-black/30 px-3 py-1 rounded-lg">[F] [J]</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-blue-500/50 shadow-lg hover:scale-105 transition-transform">
            <div className="text-ka font-black text-2xl mb-2 drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(68, 136, 255, 0.8)' }}>カッ</div>
            <div className="text-sm font-bold bg-black/30 px-3 py-1 rounded-lg">[D] [K]</div>
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl text-xs border border-white/20 shadow-lg">
          <span className="text-yellow-400 font-bold">🎮 ゲームパッド対応</span>
          <span className="mx-2 text-white/50">|</span>
          <span className="text-don font-semibold">ドン: A/B/下/L1</span>
          <span className="mx-2 text-white/50">|</span>
          <span className="text-ka font-semibold">カッ: X/Y/上/R1</span>
        </div>
      </div>

      {/* ポーズメニュー */}
      {gameLoop.gameState.isPaused && (
        <PauseMenu
          onResume={handleResume}
          onRetry={handleRetry}
          onHome={handleBackToHome}
        />
      )}

      {/* ヒットエフェクト */}
      {hitEffect && hitEffect.show && (
        <div
          className="absolute z-30"
          style={{
            left: `${GAME_CONFIG.DRUM_POSITION_X}px`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <HitEffect
            noteType={hitEffect.type}
            onComplete={() => setHitEffect(null)}
          />
        </div>
      )}

      {/* コンボマイルストーンエフェクト */}
      {comboMilestone && (
        <ComboMilestoneEffect
          combo={comboMilestone}
          onComplete={() => setComboMilestone(null)}
        />
      )}
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
