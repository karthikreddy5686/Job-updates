import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, AuthProvider, NotificationProvider } from './providers';
import Navbar from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { metadata as defaultMetadata } from '../lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = defaultMetadata;

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
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
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
