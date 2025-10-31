import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <section className="relative flex-1">
                <div className="absolute inset-0 -z-10">
                  <DarkVeil />
                </div>
                <main>{children}</main>
              </section>
              <Footer />
            </div>
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
