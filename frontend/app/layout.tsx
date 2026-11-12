import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, AuthProvider, NotificationProvider } from './providers';
import Navbar from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { metadata as defaultMetadata } from '@/lib/seo';
import PwaInstallPrompt from '@/components/pwa/PwaInstallPrompt';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563EB',
};

export const metadata: Metadata = {
  ...defaultMetadata,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Geonixa NextJob',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%230ea5e9'>JU</text></svg>" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Geonixa NextJob" />
        <link rel="apple-touch-icon" href="/geonixa-logo-full.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <PwaInstallPrompt />
              <Navbar />
              <main className="pt-16 md:pt-20">{children}</main>
              <Footer />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
