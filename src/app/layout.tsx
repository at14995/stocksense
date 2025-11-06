import './globals.css';
import type {Metadata} from 'next';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import DarkVeil from '@/components/backgrounds/DarkVeil';
import { CurrencyProvider } from '@/context/CurrencyContext';

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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
          <CurrencyProvider>
            <div className="fixed inset-0 -z-10">
              <DarkVeil
                hueShift={0}
                noiseIntensity={0.04}
                scanlineIntensity={0.08}
                speed={0.4}
                scanlineFrequency={2.8}
                warpAmount={0.02}
                resolutionScale={1}
              />
            </div>
            
            <header className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-lg bg-[#0B0D14]/70 border-b border-white/10">
              <Header />
            </header>

            <main className="relative z-10 pt-16 min-h-screen bg-transparent">{children}</main>

            <footer className="relative z-50 border-t border-white/10 bg-background/80">
              <Footer />
            </footer>

            <Toaster />
          </CurrencyProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
