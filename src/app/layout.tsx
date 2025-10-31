import './globals.css';
import type {Metadata} from 'next';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import DotGrid from '@/components/backgrounds/DotGrid';

export const metadata: Metadata = {
  title: 'Stock Sense — Intelligent Market Analysis and Alerts',
  description: 'Build watchlists, set price alerts, and analyze news sentiment with real-time data.',
  openGraph: {
    title: 'Stock Sense — Intelligent Market Analysis and Alerts',
    description: 'Build watchlists, set price alerts, and analyze news sentiment with real-time data.',
    images: [
      {
        url: '/og-image.png', // Assuming you have a generic social preview image
        width: 1200,
        height: 630,
        alt: 'Stock Sense',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen text-white overflow-x-hidden antialiased">
        <FirebaseClientProvider>
          {/* Solid fixed navbar */}
          <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a] border-b border-gray-800 shadow-md">
            <Header />
          </header>

          {/* Animated background behind all pages */}
          <div className="fixed inset-0 -z-10">
            <DotGrid dotSize={10} gap={15} baseColor="#5227FF" activeColor="#5227FF" proximity={120} shockRadius={250} shockStrength={5} resistance={750} returnDuration={1.5} />
          </div>
          
          <main className="relative z-10 pt-16 min-h-screen bg-transparent">{children}</main>

          {/* Footer */}
          <footer className="relative z-50 bg-[#0a0a0a] border-t border-gray-800">
            <Footer />
          </footer>

          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
