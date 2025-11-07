'use client';

import { useEffect, useRef, useCallback } from 'react';
import { NoteType } from '@/types/game';

/**
 * ゲームパッド入力フック
 *
 * 対応コントローラー:
 * - 標準ゲームパッド (Xbox, PlayStation, etc.)
 * - 太鼓の達人専用コントローラー
 */

// 標準コントローラーのボタンマッピング
const STANDARD_MAPPING = {
  donButtons: [0, 1, 12, 6],  // A, B, 十字キー下, L1/LB
  kaButtons: [2, 3, 13, 7],   // X, Y, 十字キー上, R1/RB
};

// 太鼓コントローラーのボタンマッピング
const TAIKO_MAPPING = {
  donButtons: [0, 1],  // 左ドン、右ドン（面）
  kaButtons: [2, 3],   // 左カッ、右カッ（縁）
};

export function useGamepadInput(
  onInput: (noteType: NoteType) => void,
  useTaikoMapping: boolean = false
) {
  const previousButtonsRef = useRef<Map<number, boolean>>(new Map());
  const animationFrameRef = useRef<number>();
  const gamepadIndexRef = useRef<number | null>(null);

  const pollGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepadIndexRef.current !== null
      ? gamepads[gamepadIndexRef.current]
      : gamepads[0]; // 最初に接続されたゲームパッドを使用

    if (!gamepad) {
      animationFrameRef.current = requestAnimationFrame(pollGamepad);
      return;
    }

    // 使用するマッピングを選択
    const mapping = useTaikoMapping ? TAIKO_MAPPING : STANDARD_MAPPING;

    // 全てのボタンをチェック
    gamepad.buttons.forEach((button, index) => {
      const wasPressed = previousButtonsRef.current.get(index) || false;
      const isPressed = button.pressed;

      // ボタンが今押された瞬間を検知（エッジ検出）
      if (isPressed && !wasPressed) {
        if (mapping.donButtons.includes(index)) {
          onInput('don');
        } else if (mapping.kaButtons.includes(index)) {
          onInput('ka');
        }
      }

      previousButtonsRef.current.set(index, isPressed);
    });

    // 次のフレームをリクエスト
    animationFrameRef.current = requestAnimationFrame(pollGamepad);
  }, [onInput, useTaikoMapping]);

  useEffect(() => {
    // ゲームパッド接続イベント
    const handleConnect = (e: GamepadEvent) => {
      console.log(`🎮 ゲームパッド接続: ${e.gamepad.id}`);
      gamepadIndexRef.current = e.gamepad.index;

      // 太鼓コントローラーかどうかを判定
      const isTaiko = e.gamepad.id.toLowerCase().includes('taiko') ||
                      e.gamepad.id.toLowerCase().includes('太鼓');

      if (isTaiko) {
        console.log('🥁 太鼓コントローラーを検出しました');
      }

      // ポーリング開始
      if (!animationFrameRef.current) {
        pollGamepad();
      }
    };

    const handleDisconnect = (e: GamepadEvent) => {
      console.log(`🎮 ゲームパッド切断: ${e.gamepad.id}`);
      if (gamepadIndexRef.current === e.gamepad.index) {
        gamepadIndexRef.current = null;
      }
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    // 既に接続されているゲームパッドをチェック
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        console.log(`🎮 既存のゲームパッド検出: ${gamepads[i]?.id}`);
        gamepadIndexRef.current = i;
        pollGamepad();
        break;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, [pollGamepad]);
}
