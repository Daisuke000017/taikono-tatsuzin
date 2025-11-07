'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { AudioEngine } from '@/lib/audioEngine';
import { NoteType, JudgementType } from '@/types/game';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    engineRef.current = new AudioEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, []);

  const loadAudio = useCallback(async (audioFile: string) => {
    if (!engineRef.current) return;

    try {
      await engineRef.current.loadMainAudio(audioFile);
      await engineRef.current.loadHitSounds();
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load audio:', error);
      // エラーが発生してもゲームを続行可能にする
      setIsLoaded(true);
    }
  }, []);

  const play = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.play();
  }, []);

  const pause = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.pause();
  }, []);

  const stop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.stop();
  }, []);

  const getCurrentTime = useCallback((): number => {
    if (!engineRef.current) return 0;
    return engineRef.current.getCurrentTime();
  }, []);

  const playHitSound = useCallback((noteType: NoteType) => {
    if (!engineRef.current) return;
    engineRef.current.playHitSound(noteType);
  }, []);

  const playJudgementSound = useCallback((judgement: JudgementType) => {
    if (!engineRef.current) return;
    engineRef.current.playJudgementSound(judgement);
  }, []);

  return useMemo(
    () => ({
      loadAudio,
      play,
      pause,
      stop,
      getCurrentTime,
      playHitSound,
      playJudgementSound,
      isLoaded,
    }),
    [loadAudio, play, pause, stop, getCurrentTime, playHitSound, playJudgementSound, isLoaded]
  );
}
