import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bloom - Botanical CAD Symbol Generator (Scripted Plants)',
  description: 'Generate customizable, beautiful 2D vector plant symbols (side, front, plan views) for architectural CAD and vector software using scripted fractal algorithms.',
  keywords: ['architectural CAD', 'scripted plants', 'vector trees', 'SVG plant generator', 'landscape CAD symbols', 'fractal plant'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
