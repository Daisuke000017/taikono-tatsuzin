'use client';

interface PauseMenuProps {
  onResume: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export default function PauseMenu({ onResume, onRetry, onHome }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-12 shadow-2xl max-w-md w-full mx-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black text-white mb-2">PAUSE</h2>
          <p className="text-gray-300">一時停止中</p>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            再開
          </button>

          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            リトライ
          </button>

          <button
            onClick={onHome}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            ホームに戻る
          </button>
        </div>

        {/* ヒント */}
        <div className="mt-6 text-center text-sm text-gray-400">
          ESCキーで再開できます
        </div>
      </div>
    </div>
  );
}
