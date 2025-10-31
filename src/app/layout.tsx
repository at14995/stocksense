import './globals.css';
import type {Metadata} from 'next';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import DarkVeil from '@/components/backgrounds/DarkVeil';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-[#0f172a] text-foreground relative min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          {/* Fixed Solid Navbar */}
          <header
              className="fixed top-0 left-0 right-0 z-[100] border-b border-gray-800 shadow-md"
              style={{
                backgroundColor: "#0a0a0a",
                opacity: 1,
              }}
            >
            <Header />
          </header>

          {/* Persistent Animated Background — stays behind content only */}
          <div className="fixed inset-0 -z-10">
            <DarkVeil />
          </div>

          {/* Gradient overlay for contrast and depth */}
          <div className="fixed inset-0 -z-[5] pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/90" />
          
          {/* Main Content */}
          <main className="relative z-10 pt-16 min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="relative z-50">
            <Footer />
          </footer>

          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
