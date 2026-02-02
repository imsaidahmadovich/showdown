'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { HelpCircle, List, Swords } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
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
export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useLanguage();

  const gameModes = [
    {
      title: t('game.club-guessr.title'),
      href: '/club-guessr',
      icon: <HelpCircle className="size-8 text-primary" />,
    },
    {
      title: t('game.stat-detective.title'),
      href: '/stat-detective',
      icon: <List className="size-8 text-primary" />,
    },
    {
      title: t('game.face-off.title'),
      href: '/face-off/lobby',
      icon: <Swords className="size-8 text-primary" />,
    },
  ];

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);
  
  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-col items-center justify-center p-8 text-center">
        <AppLogo className="mb-4 h-20 w-20" />
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          {t('app.title')}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        <div className="grid gap-4">
          {gameModes.map((mode) => (
            <Card
              key={mode.title}
              className="group transform-gpu transition-all duration-300 ease-out border-primary/20 bg-secondary/30 hover:border-primary/60 hover:bg-secondary/60 hover:shadow-lg hover:shadow-primary/20"
            >
              <Link href={mode.href} className="block h-full">
                <CardHeader className="flex flex-row items-center justify-center gap-4 p-6 text-center">
                  <div className="transition-transform duration-300 group-hover:scale-110">{mode.icon}</div>
                  <CardTitle className="font-headline text-2xl text-foreground">
                    {mode.title}
                  </CardTitle>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
