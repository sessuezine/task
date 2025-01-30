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
        <div className="flex min-h-screen">
          <Nav />
          <main className="w-full">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
