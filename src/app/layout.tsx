import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '太鼓の達人風リズムゲーム',
  description: 'オリジナルの太鼓の達人風リズムゲーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
