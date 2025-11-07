import { NoteType, JudgementType } from '@/types/game';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private mainAudioBuffer: AudioBuffer | null = null;
  private mainAudioSource: AudioBufferSourceNode | null = null;
  private startTime: number = 0;
  private pausedAt: number = 0;
  private isPlaying: boolean = false;
  private silentMode: boolean = false; // 音楽ファイルなしモード
  private silentStartTime: number = 0; // サイレントモード用の開始時刻

  // 効果音用のオーディオバッファ
  private hitSounds: Map<NoteType, AudioBuffer> = new Map();
  private judgementSounds: Map<JudgementType, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  /**
   * メイン楽曲の読み込み
   */
  async loadMainAudio(audioFile: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized');
    }

    try {
      const response = await fetch(audioFile);
      if (!response.ok) {
        // 404などの場合、サイレントモードで続行
        console.warn(`Audio file not found: ${audioFile}, switching to silent mode`);
        this.silentMode = true;
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      this.mainAudioBuffer = await this.audioContext.decodeAudioData(
        arrayBuffer
      );
      this.silentMode = false;
    } catch (error) {
      console.warn('Failed to load main audio, switching to silent mode:', error);
      this.silentMode = true;
      // エラーをスローせずにサイレントモードで続行
    }
  }

  /**
   * 効果音の読み込み（ドン・カッ）
   */
  async loadHitSounds(): Promise<void> {
    // プロトタイプではWeb Audio APIで簡易的な効果音を生成
    // 将来的には実際の音源ファイルを読み込む
    this.generateHitSound('don', 220); // A3
    this.generateHitSound('ka', 440);  // A4
  }

  /**
   * 判定音の読み込み
   */
  async loadJudgementSounds(): Promise<void> {
    // プロトタイプでは簡易音を生成
    // Perfect: 高音
    // Good: 中音
    // Miss: 低音
  }

  /**
   * メイン楽曲の再生
   */
  play(): void {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized');
      return;
    }

    // サイレントモードの場合は時間計測のみ開始
    if (this.silentMode || !this.mainAudioBuffer) {
      this.silentStartTime = performance.now() - (this.pausedAt * 1000);
      this.isPlaying = true;
      console.log('Playing in silent mode (no audio file)');
      return;
    }

    // 既存の再生を停止
    if (this.mainAudioSource) {
      this.mainAudioSource.stop();
    }

    // 新しいソースを作成
    this.mainAudioSource = this.audioContext.createBufferSource();
    this.mainAudioSource.buffer = this.mainAudioBuffer;
    this.mainAudioSource.connect(this.audioContext.destination);

    // 再開の場合は一時停止位置から再生
    const offset = this.pausedAt;
    this.mainAudioSource.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;
  }

  /**
   * 一時停止
   */
  pause(): void {
    if (!this.isPlaying) {
      return;
    }

    // サイレントモードの場合
    if (this.silentMode || !this.mainAudioBuffer) {
      this.pausedAt = (performance.now() - this.silentStartTime) / 1000;
      this.isPlaying = false;
      return;
    }

    if (!this.audioContext || !this.mainAudioSource) {
      return;
    }

    this.pausedAt = this.audioContext.currentTime - this.startTime;
    this.mainAudioSource.stop();
    this.isPlaying = false;
  }

  /**
   * 停止
   */
  stop(): void {
    if (this.mainAudioSource) {
      this.mainAudioSource.stop();
      this.mainAudioSource = null;
    }

    this.startTime = 0;
    this.pausedAt = 0;
    this.silentStartTime = 0;
    this.isPlaying = false;
  }

  /**
   * 現在の再生時間を取得（ミリ秒）
   */
  getCurrentTime(): number {
    // サイレントモードの場合
    if (this.silentMode || !this.mainAudioBuffer) {
      if (this.isPlaying) {
        return performance.now() - this.silentStartTime;
      } else {
        return this.pausedAt * 1000;
      }
    }

    // 通常モード
    if (!this.audioContext) return 0;

    if (this.isPlaying) {
      return (this.audioContext.currentTime - this.startTime) * 1000;
    } else {
      return this.pausedAt * 1000;
    }
  }

  /**
   * ヒット音を再生
   */
  playHitSound(noteType: NoteType): void {
    if (!this.audioContext) return;

    const buffer = this.hitSounds.get(noteType);
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
    } else {
      // バッファがない場合は簡易音を生成して再生
      this.playSimpleBeep(noteType === 'don' ? 220 : 440, 0.1);
    }
  }

  /**
   * 判定音を再生
   */
  playJudgementSound(judgement: JudgementType): void {
    if (!this.audioContext) return;

    let frequency = 440;
    switch (judgement) {
      case 'perfect':
        frequency = 880; // A5
        break;
      case 'good':
        frequency = 660; // E5
        break;
      case 'miss':
        frequency = 220; // A3
        break;
    }

    this.playSimpleBeep(frequency, 0.05);
  }

  /**
   * 簡易ビープ音を生成
   */
  private playSimpleBeep(frequency: number, duration: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * ヒット音を生成（簡易版）
   */
  private generateHitSound(type: NoteType, frequency: number): void {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.1; // 100ms
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 10); // エンベロープ
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    this.hitSounds.set(type, buffer);
  }

  /**
   * 音声の読み込み完了チェック
   */
  isLoaded(): boolean {
    // サイレントモードでも読み込み完了とみなす
    return this.mainAudioBuffer !== null || this.silentMode;
  }

  /**
   * クリーンアップ
   */
  dispose(): void {
    this.stop();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
