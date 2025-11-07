'use client';

import { useEffect, useState, useCallback } from 'react';
import { NoteType } from '@/types/game';
import { KEY_BINDINGS } from '@/constants/gameConfig';

export function useInputHandler(onInput: (noteType: NoteType) => void) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // 既に押されている場合は無視（連打防止）
      if (pressedKeys.has(key)) return;

      // ドン判定
      if (key === KEY_BINDINGS.DON_LEFT || key === KEY_BINDINGS.DON_RIGHT) {
        setPressedKeys((prev) => new Set(prev).add(key));
        onInput('don');
      }
      // カッ判定
      else if (key === KEY_BINDINGS.KA_LEFT || key === KEY_BINDINGS.KA_RIGHT) {
        setPressedKeys((prev) => new Set(prev).add(key));
        onInput('ka');
      }
    },
    [onInput, pressedKeys]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setPressedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { pressedKeys };
}
