
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Palette, Star, CheckCircle2, ShoppingCart, Lightbulb, Shield, Gem, Crown, Medal, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, useTheme } from '@/context/language-context';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';
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
type ShopItem = {
    id: string;
    name: string;
    price: number;
    icon: ElementType;
    type: 'theme' | 'badge' | 'consumable';
    amount?: number;
};


function ShopPage() {
    const { t } = useLanguage();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();

    const playerStatsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'playerStatistics', user.uid);
    }, [firestore, user]);
    const { data: userStat, isLoading: isStatsLoading } = useDoc<PlayerStatistic>(playerStatsQuery);

    const shopItems: ShopItem[] = [
        {
            id: 'theme-golden-goal',
            name: t('shop.theme.golden'),
            price: 1000,
            icon: Palette,
            type: 'theme',
        },
        {
            id: 'badge-shield',
            name: t('shop.badge.shield'),
            price: 250,
            icon: Shield,
            type: 'badge',
        },
        {
            id: 'badge-star',
            name: t('shop.badge.star'),
            price: 500,
            icon: Star,
            type: 'badge',
        },
        {
            id: 'badge-gem',
            name: t('shop.badge.gem'),
            price: 750,
            icon: Gem,
            type: 'badge',
        },
        {
            id: 'badge-medal',
            name: t('shop.badge.medal'),
            price: 1000,
            icon: Medal,
            type: 'badge',
        },
        {
            id: 'badge-crown',
            name: t('shop.badge.crown'),
            price: 1500,
            icon: Crown,
            type: 'badge',
        },
        {
            id: 'badge-trophy',
            name: t('shop.badge.trophy'),
            price: 2000,
            icon: Trophy,
            type: 'badge',
        },
         {
            id: 'clue-pack-5',
            name: t('shop.cluePack'),
            price: 50,
            icon: Lightbulb,
            type: 'consumable',
            amount: 5,
        },
    ];

    const handlePurchase = async (item: ShopItem) => {
        if (!user || !userStat || !playerStatsQuery) return;

        if ((userStat.coins || 0) < item.price) {
            toast({
                variant: 'destructive',
                title: t('shop.insufficientCoins'),
            });
            return;
        }

        const statRef = playerStatsQuery;
        
        let updates: any = {
            coins: increment(-item.price),
        };

        if(item.type === 'theme') {
            updates.purchasedThemes = arrayUnion(item.id);
        } else if (item.type === 'badge') {
            updates.purchasedBadges = arrayUnion(item.id);
        } else if (item.type === 'consumable' && item.id.startsWith('clue-pack')) {
            updates.purchasedClues = increment(item.amount || 0);
        }

        updateDoc(statRef, updates).then(() => {
            toast({
                title: t('shop.purchaseSuccess'),
            });
        }).catch(async (error) => {
             const permissionError = new FirestorePermissionError({
                path: statRef.path,
                operation: 'update',
                requestResourceData: updates
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleEquip = async (item: ShopItem) => {
        if (!user || !playerStatsQuery) return;

        if(item.type === 'theme') {
            setTheme(item.id);
        } else if (item.type === 'badge') {
            updateDoc(playerStatsQuery, {
                equippedBadge: item.id
            }).then(() => {
                 toast({
                    title: t('shop.badgeEquipped'),
                });
            }).catch(async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: playerStatsQuery.path,
                    operation: 'update',
                    requestResourceData: { equippedBadge: item.id }
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center gap-4 border-b p-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="font-headline text-xl font-bold">{t('shop.title')}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                           <ShoppingCart className="h-6 w-6" /> {t('shop.themes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {shopItems.filter(i => i.type === 'theme').map((item) => {
                             const isPurchased = userStat?.purchasedThemes?.includes(item.id);
                             const isEquipped = theme === item.id;

                             return(
                                <Card key={item.id} className={cn("flex flex-col sm:flex-row items-center justify-between p-4 gap-4", isEquipped && "border-primary")}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-lg", item.id === 'theme-golden-goal' ? 'bg-yellow-400/20' : 'bg-muted')}>
                                          <item.icon className={cn("h-8 w-8", item.id === 'theme-golden-goal' ? 'text-yellow-500' : 'text-primary')} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span>{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isPurchased ? (
                                        isEquipped ? (
                                            <Button disabled variant="outline" className="w-full sm:w-auto">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {t('shop.equipped')}
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEquip(item)} className="w-full sm:w-auto">
                                                {t('shop.equip')}
                                            </Button>
                                        )
                                    ) : (
                                        <Button 
                                            onClick={() => handlePurchase(item)} 
                                            disabled={isStatsLoading || (userStat?.coins || 0) < item.price}
                                            className="w-full sm:w-auto"
                                        >
                                            {t('shop.buy')}
                                        </Button>
                                    )}
                                </Card>
                             )
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                           <Shield className="h-6 w-6" /> {t('shop.badges')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {shopItems.filter(i => i.type === 'badge').map((item) => {
                             const isPurchased = userStat?.purchasedBadges?.includes(item.id);
                             const isEquipped = userStat?.equippedBadge === item.id;

                             return(
                                <Card key={item.id} className={cn("flex flex-col sm:flex-row items-center justify-between p-4 gap-4", isEquipped && "border-primary")}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-muted">
                                          <item.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span>{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isPurchased ? (
                                        isEquipped ? (
                                            <Button disabled variant="outline" className="w-full sm:w-auto">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {t('shop.equipped')}
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEquip(item)} className="w-full sm:w-auto">
                                                {t('shop.equip')}
                                            </Button>
                                        )
                                    ) : (
                                        <Button 
                                            onClick={() => handlePurchase(item)} 
                                            disabled={isStatsLoading || (userStat?.coins || 0) < item.price}
                                            className="w-full sm:w-auto"
                                        >
                                            {t('shop.buy')}
                                        </Button>
                                    )}
                                </Card>
                             )
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                           <Lightbulb className="h-6 w-6" /> {t('shop.consumables')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {shopItems.filter(i => i.type === 'consumable').map((item) => {
                             return(
                                <Card key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                                     <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-accent/10">
                                          <item.icon className="h-8 w-8 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span>{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handlePurchase(item)} 
                                        disabled={isStatsLoading || (userStat?.coins || 0) < item.price}
                                        className="w-full sm:w-auto"
                                    >
                                        {t('shop.buy')}
                                    </Button>
                                </Card>
                             )
                        })}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default withAuth(ShopPage);
