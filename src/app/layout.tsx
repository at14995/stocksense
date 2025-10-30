import type {Metadata} from 'next';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {Toaster} from '@/components/ui/toaster';
import { BackgroundGrid } from '@/components/landing/background-grid';

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
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundGrid />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
