import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'KampusCuan — Manajemen Keuangan Mahasiswa',
    template: '%s | KampusCuan',
  },
  description:
    'Platform manajemen keuangan pribadi untuk mahasiswa Indonesia. Catat pengeluaran, atur budget, dan dapatkan insight AI untuk keuangan lebih cerdas.',
  keywords: ['keuangan', 'mahasiswa', 'budget', 'fintech', 'Indonesia', 'AI'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
