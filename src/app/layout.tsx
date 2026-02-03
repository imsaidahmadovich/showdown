import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MobileContainer } from '@/components/layout/mobile-container';
import { FirebaseClientProvider } from '@/firebase';
import { AppProvider } from '@/context/language-context';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-6493634839455307';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google AdSense - set NEXT_PUBLIC_ADSENSE_CLIENT in your env or replace the fallback above */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            data-ad-client={ADSENSE_CLIENT}
            crossOrigin="anonymous"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <meta name="google-adsense-account" content="ca-pub-XXXX" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
      </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
