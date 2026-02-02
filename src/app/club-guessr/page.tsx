
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Footballer, PlayerStatistic } from '@/lib/data';
import { getRandomFootballer, footballers, clubs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { withAuth } from '@/components/auth/with-auth';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, getDoc, setDoc, increment, runTransaction, DocumentReference } from 'firebase/firestore';

const getShuffledOptions = (correctClub: string) => {
    const incorrectClubs = clubs.filter(c => c !== correctClub);
    const shuffled = incorrectClubs.sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 3);
    options.push(correctClub);
    return options.sort(() => 0.5 - Math.random());
}


function ClubGuessrPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [footballer, setFootballer] = useState<Footballer | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();

    const getPlayerStatDocRef = (userId: string): DocumentReference<PlayerStatistic> | null => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'playerStatistics', userId) as DocumentReference<PlayerStatistic>;
    };

    const playerStatDocRef = useMemoFirebase(() => getPlayerStatDocRef(user?.uid ?? ''), [firestore, user]);


 const setupNewGame = async () => {
    const newFootballer = getRandomFootballer(footballer?.id);
    setFootballer(newFootballer);
    setOptions(getShuffledOptions(newFootballer.stats.club));
    setIsCorrect(null);
    setSelectedClub(null);
    setIsAnswered(false);

     if (user && firestore && playerStatDocRef) {
        runTransaction(firestore, async (transaction) => {
            const statDoc = await transaction.get(playerStatDocRef);
            const initialData = {
                userId: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                clubGuessrGamesPlayed: 1,
                clubGuessrGamesWon: 0,
                statDetectiveGamesPlayed: 0,
                statDetectiveGamesWon: 0,
                footballerFaceoffGamesPlayed: 0,
                footballerFaceoffGamesWon: 0,
                coins: 0,
            };
            if (!statDoc.exists()) {
                transaction.set(playerStatDocRef, initialData);
            } else {
                transaction.update(playerStatDocRef, {
                    clubGuessrGamesPlayed: increment(1)
                });
            }
        }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({
                path: playerStatDocRef.path,
                operation: 'write',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
  };

  useEffect(() => {
    setupNewGame();
  }, [user, firestore]);

  const handleCorrectGuess = async () => {
    if (!user || !firestore || !playerStatDocRef) return;
    
    runTransaction(firestore, async (transaction) => {
        const statDoc = await transaction.get(playerStatDocRef);
         const initialData = {
            userId: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            clubGuessrGamesPlayed: 1,
            clubGuessrGamesWon: 1,
            statDetectiveGamesPlayed: 0,
            statDetectiveGamesWon: 0,
            footballerFaceoffGamesPlayed: 0,
            footballerFaceoffGamesWon: 0,
            coins: 10,
        };
        const updateData = {
            clubGuessrGamesWon: increment(1),
            coins: increment(10)
        }

        if (!statDoc.exists()) {
             transaction.set(playerStatDocRef, initialData);
        } else {
             transaction.update(playerStatDocRef, updateData);
        }
    }).then(() => {
        toast({
            title: t('clubGuessr.correctToast.title'),
            description: `${footballer?.name}'s club is indeed ${footballer?.stats.club}`,
        });
        toast({
            title: t('clubGuessr.coinsAdded'),
            description: '',
        });
    }).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
            path: playerStatDocRef.path,
            operation: 'write',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update your stats.",
        });
    });
  }

  const handleGuess = (club: string) => {
      if(isAnswered) return;

      setSelectedClub(club);
      setIsAnswered(true);

      if(club === footballer?.stats.club) {
          setIsCorrect(true);
          handleCorrectGuess();
      } else {
          setIsCorrect(false);
          toast({
              variant: 'destructive',
              title: t('clubGuessr.incorrectToast.title'),
              description: `The correct club was ${footballer?.stats.club}`,
          });
      }
  }

  const portraitImage = footballer ? PlaceHolderImages.find(p => p.id === footballer.portraitImageUrlId) : undefined;

  if (!footballer || !portraitImage) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
            <h1 className="font-headline text-xl font-bold">{t('clubGuessr.title')}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card className="overflow-hidden text-center">
             <CardHeader>
                <CardTitle className="font-headline text-2xl">Which club does {footballer.name} play for?</CardTitle>
                <CardDescription>Select one of the clubs below.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="relative mx-auto h-64 w-48">
                    <Image
                        src={portraitImage.imageUrl}
                        alt={footballer.name}
                        data-ai-hint={portraitImage.imageHint}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                        priority
                        />
                </div>
            </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-2 gap-4">
            {options.map(club => (
                <Button 
                    key={club} 
                    variant="outline" 
                    className={cn("h-20 text-base justify-center",
                        isAnswered && club === footballer.stats.club && 'border-green-500 bg-green-500/10 text-green-500',
                        isAnswered && club === selectedClub && club !== footballer.stats.club && 'border-red-500 bg-red-500/10 text-red-500'
                    )}
                    onClick={() => handleGuess(club)}
                    disabled={isAnswered}
                >
                    {club}
                </Button>
            ))}
        </div>

        <AnimatePresence>
            {isAnswered && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6"
                >
                    <Button onClick={setupNewGame} className="w-full" size="lg">{t('clubGuessr.nextPlayer')}</Button>
                </motion.div>
            )}
        </AnimatePresence>

      </main>
    </div>
  );
}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
export default withAuth(ClubGuessrPage);
