import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Nav from '@/components/nav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <div className="flex">
          {/* Hide nav on mobile, show on desktop */}
          <div className="hidden md:block">
            <Nav />
          </div>
          
          {/* Main content - centered with padding */}
          <div className="flex-1">
            <main className="px-4 max-w-8xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
