
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, Trophy, Shield, Gem, Crown, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { withAuth } from '@/components/auth/with-auth';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';

type LeaderboardPlayer = PlayerStatistic & {
  rank: number;
  totalWins: number;
};

const badgeIcons: { [key: string]: ElementType } = {
    'badge-shield': Shield,
    'badge-gem': Gem,
    'badge-crown': Crown,
    'badge-star': Star,
    'badge-medal': Medal,
    'badge-trophy': Trophy,
};


function LeaderboardPage() {
  const { t } = useLanguage();
  const firestore = useFirestore();
  
  const statsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const statCollection = collection(firestore, 'playerStatistics');
    return query(statCollection, orderBy('coins', 'desc'), limit(10));
  }, [firestore]);

  const { data: topStats, isLoading } = useCollection<PlayerStatistic>(statsQuery);

  const leaderboard: LeaderboardPlayer[] = (topStats || []).map((player, index) => {
    const totalWins = (player.clubGuessrGamesWon || 0) + (player.statDetectiveGamesWon || 0) + (player.footballerFaceoffGamesWon || 0);
    return {
      ...player,
      rank: index + 1,
      totalWins,
    };
  });


  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="font-headline text-xl font-bold">{t('leaderboard.title')}</h1>
      </header>
       
      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('leaderboard.loading')}</p>
          </div>
        ) : leaderboard.length === 0 ? (
           <Card className="mt-10 text-center p-8">
              <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
              <CardHeader>
                <CardTitle>{t('leaderboard.noPlayers')}</CardTitle>
              </CardHeader>
           </Card>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((player) => {
              const EquippedBadgeIcon = player.equippedBadge ? badgeIcons[player.equippedBadge] : null;
              return (
              <Card key={player.id} className={cn(
                  "flex items-center p-4 gap-4",
                  player.rank === 1 && "border-yellow-400 bg-yellow-400/10",
                  player.rank === 2 && "border-gray-400 bg-gray-400/10",
                  player.rank === 3 && "border-orange-400 bg-orange-400/10",
              )}>
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                     player.rank === 1 && "bg-yellow-400 text-yellow-900",
                     player.rank === 2 && "bg-gray-400 text-gray-900",
                     player.rank === 3 && "bg-orange-400 text-orange-900",
                     player.rank > 3 && "bg-muted text-muted-foreground"
                )}>
                    {player.rank}
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={player.photoURL} alt={player.displayName} />
                  <AvatarFallback>{player.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold flex items-center gap-2">
                    {player.displayName}
                    {EquippedBadgeIcon && <EquippedBadgeIcon className="h-4 w-4 text-primary" />}
                    </p>
                </div>
                <div className="flex items-end gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4 text-primary/70" />
                        <span>{player.totalWins}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-lg">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>{player.coins || 0}</span>
                    </div>
                </div>
              </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
export default withAuth(LeaderboardPage);
