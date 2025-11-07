'use client';

interface PauseMenuProps {
  onResume: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export default function PauseMenu({ onResume, onRetry, onHome }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="relative bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-red-900/95 rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 border-4 border-yellow-500/30">
        {/* 装飾的なコーナー */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400/60 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400/60 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400/60 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400/60 rounded-br-3xl" />

        {/* ヘッダー */}
        <div className="text-center mb-10 relative">
          <div className="absolute inset-0 bg-yellow-400/10 blur-2xl" />
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 mb-3 drop-shadow-2xl relative"
              style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}>
            PAUSE
          </h2>
          <p className="text-yellow-200/90 text-lg font-bold tracking-widest relative">一時停止中</p>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4 relative">
          <button
            onClick={onResume}
            className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-5 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/50 border-2 border-green-400/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span className="text-lg tracking-wider">再開</span>
          </button>

          <button
            onClick={onRetry}
            className="group w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black py-5 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/50 border-2 border-blue-400/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-lg tracking-wider">リトライ</span>
          </button>

          <button
            onClick={onHome}
            className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-5 px-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50 border-2 border-purple-400/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <span className="text-lg tracking-wider">ホームに戻る</span>
          </button>
        </div>

        {/* ヒント */}
        <div className="mt-8 text-center relative">
          <div className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-yellow-500/30 inline-block">
            <p className="text-sm text-yellow-200/90 font-semibold tracking-wide">
              <span className="text-yellow-400">ESC</span> キーで再開できます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
