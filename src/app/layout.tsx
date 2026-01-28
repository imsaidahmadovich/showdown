import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MobileContainer } from '@/components/layout/mobile-container';
import { FirebaseClientProvider } from '@/firebase';
import { AppProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Pixel Soccer Showdown',
  description: 'Guess footballers from silhouettes, stats, and face off against others online!',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
          <AppProvider>
            <FirebaseClientProvider>
              <MobileContainer>
                {children}
              </MobileContainer>
            </FirebaseClientProvider>
          </AppProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
