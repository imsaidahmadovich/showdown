
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, BarChart2, Award, Star, LogOut, Loader2, Settings, Lightbulb, Shield, Gem, Crown, Medal, Trophy } from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '@/components/auth/with-auth';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import type { ElementType } from 'react';

const calculateWinRate = (stats: PlayerStatistic | null) => {
  if (!stats) return '0%';
  const totalPlayed =
    (stats.clubGuessrGamesPlayed || 0) +
    (stats.statDetectiveGamesPlayed || 0) +
    (stats.footballerFaceoffGamesPlayed || 0);
  const totalWins =
    (stats.clubGuessrGamesWon || 0) +
    (stats.statDetectiveGamesWon || 0) +
    (stats.footballerFaceoffGamesWon || 0);
  if (totalPlayed === 0) return '0%';
  return `${Math.round((totalWins / totalPlayed) * 100)}%`;
};

const getTotalWins = (stats: PlayerStatistic | null) => {
  if (!stats) return '0';
  return (
    (stats.clubGuessrGamesWon || 0) +
    (stats.statDetectiveGamesWon || 0) +
    (stats.footballerFaceoffGamesWon || 0)
  ).toString();
};

const badgeIcons: { [key: string]: ElementType } = {
    'badge-shield': Shield,
    'badge-gem': Gem,
    'badge-crown': Crown,
    'badge-star': Star,
    'badge-medal': Medal,
    'badge-trophy': Trophy,
};


function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();


  const playerStatDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'playerStatistics', user.uid);
  }, [firestore, user]);

  const { data: userStat, isLoading: isStatsLoading } = useDoc<PlayerStatistic>(playerStatDocRef);


  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getJoinDate = () => {
    if (user?.metadata.creationTime) {
      const date = new Date(user.metadata.creationTime);
      return `${t('profile.joined')} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
    return '';
  };
  
  const userStats = [
    { name: t('profile.totalWins'), value: getTotalWins(userStat), icon: Award },
    { name: t('profile.winRate'), value: calculateWinRate(userStat), icon: BarChart2 },
    { name: t('profile.coins'), value: userStat?.coins?.toString() ?? '0', icon: Star },
    { name: t('profile.purchasedClues'), value: userStat?.purchasedClues?.toString() ?? '0', icon: Lightbulb },
  ];

  const performanceData = [
    { name: t('game.club-guessr.title'), wins: userStat?.clubGuessrGamesWon || 0 },
    { name: t('game.stat-detective.title'), wins: userStat?.statDetectiveGamesWon || 0 },
    { name: t('game.face-off.title'), wins: userStat?.footballerFaceoffGamesWon || 0 },
  ];

  const EquippedBadgeIcon = userStat?.equippedBadge ? badgeIcons[userStat.equippedBadge] : null;

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="font-headline text-xl font-bold">{t('profile.title')}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label={t('profile.signOut')}>
          <LogOut />
          <span className="sr-only">{t('profile.signOut')}</span>
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage
              src={user?.photoURL || undefined}
              alt="User Avatar"
            />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
             <h2 className="flex items-center justify-center gap-2 font-headline text-2xl font-bold">
                {user?.displayName}
                {EquippedBadgeIcon && <EquippedBadgeIcon className="h-6 w-6 text-primary" />}
            </h2>
            <p className="text-muted-foreground">{getJoinDate()}</p>
          </div>
        </div>

        {isStatsLoading ? <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" /> : (
        <>
          <div className="mt-8 grid grid-cols-4 gap-2">
            {userStats.map((stat) => (
              <Card key={stat.name} className="text-center">
                <CardHeader className="p-2 md:p-4">
                  <stat.icon className="mx-auto h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent className="p-2 md:p-4 pt-0">
                  <p className="text-lg md:text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{stat.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline">{t('profile.performance')}</CardTitle>
              <CardDescription>{t('profile.winsPerGame')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Bar dataKey="wins" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
        )}

        <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Settings className="h-5 w-5" />
                {t('profile.settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <label htmlFor="language-select" className="text-sm font-medium">{t('profile.language')}</label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ru' | 'uz')}>
                    <SelectTrigger id="language-select" className="w-full">
                        <SelectValue placeholder={t('profile.language')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">{t('lang.en')}</SelectItem>
                        <SelectItem value="ru">{t('lang.ru')}</SelectItem>
                        <SelectItem value="uz">{t('lang.uz')}</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default withAuth(ProfilePage);
