'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Lightbulb, Loader2, Weight, Ruler, Club, Target } from 'lucide-react';
import type { Footballer, Stat, PlayerStatistic } from '@/lib/data';
import { getRandomFootballer, footballers } from '@/lib/data';
import { getSmartClueAction } from '@/app/actions';
import type { SmartClueOutput } from '@/ai/flows/smart-clue-generation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { withAuth } from '@/components/auth/with-auth';
import { useLanguage } from '@/context/language-context';
import { useUser, useFirestore, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, increment, runTransaction, DocumentReference, updateDoc } from 'firebase/firestore';


const formSchema = z.object({
  guess: z.string().min(2, { message: 'Guess must be at least 2 characters.' }),
});

const MAX_ATTEMPTS = 6;

function StatDetectivePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [footballer, setFootballer] = useState<Footballer | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [clue, setClue] = useState<SmartClueOutput | null>(null);
  const [clueLevel, setClueLevel] = useState(1);
  const [isClueLoading, startClueTransition] = useTransition();
  const [filteredFootballers, setFilteredFootballers] = useState<Footballer[]>([]);
  const [revealedStats, setRevealedStats] = useState<Stat[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

    const getPlayerStatDocRef = (userId: string): DocumentReference<PlayerStatistic> | null => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'playerStatistics', userId) as DocumentReference<PlayerStatistic>;
    };
    const playerStatDocRef = useMemoFirebase(() => getPlayerStatDocRef(user?.uid ?? ''), [firestore, user]);
    const { data: userStat } = useDoc<PlayerStatistic>(playerStatDocRef);

  const handleNewGameStatUpdate = async () => {
    if (!user || !firestore || !playerStatDocRef) return;
    
    runTransaction(firestore, async (transaction) => {
        const statDoc = await transaction.get(playerStatDocRef);
        const initialData = {
            userId: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            statDetectiveGamesPlayed: 1,
            statDetectiveGamesWon: 0,
            footballerFaceoffGamesPlayed: 0,
            footballerFaceoffGamesWon: 0,
            clubGuessrGamesPlayed: 0,
            clubGuessrGamesWon: 0,
            coins: 0,
        };
        if (!statDoc.exists()) {
            transaction.set(playerStatDocRef, initialData);
        } else {
            transaction.update(playerStatDocRef, {
                statDetectiveGamesPlayed: increment(1)
            });
        }
    }).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
            path: playerStatDocRef.path,
            operation: 'write',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
 };

  const setupNewGame = () => {
    const newFootballer = getRandomFootballer(footballer?.id);
    setFootballer(newFootballer);
    setIsCorrect(null);
    setClue(null);
    setClueLevel(1);
    form.reset();
    setGuesses([]);
    
    // Reveal one random stat to start
    const allStats = [
        { label: 'Height', value: newFootballer.stats.height, icon: Ruler },
        { label: 'Weight', value: newFootballer.stats.weight, icon: Weight },
        { label: 'Club', value: newFootballer.stats.club, icon: Club },
        { label: 'Career Goals', value: newFootballer.stats.careerGoals, icon: Target },
    ];
    const randomStatIndex = Math.floor(Math.random() * allStats.length);
    setRevealedStats([allStats[randomStatIndex]]);
    handleNewGameStatUpdate();
  };

  useEffect(() => {
    setupNewGame();
  }, [user, firestore]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { guess: '' },
  });

  const guessValue = form.watch('guess');

  useEffect(() => {
    if (guessValue && guessValue.length > 0) {
      setFilteredFootballers(
        footballers.filter((f) =>
          f.name.toLowerCase().includes(guessValue.toLowerCase())
        )
      );
    } else {
      setFilteredFootballers([]);
    }
  }, [guessValue]);

  const handleNextPlayer = () => {
    setupNewGame();
  };

  const revealNextStat = () => {
    if (!footballer) return;
    const allStats: Stat[] = [
      { label: 'Height', value: footballer.stats.height, icon: Ruler },
      { label: 'Weight', value: footballer.stats.weight, icon: Weight },
      { label: 'Club', value: footballer.stats.club, icon: Club },
      { label: 'Career Goals', value: footballer.stats.careerGoals, icon: Target },
    ];

    const unrevealedStats = allStats.filter(
      (stat) => !revealedStats.some((rs) => rs.label === stat.label)
    );

    if (unrevealedStats.length > 0) {
      setRevealedStats((prev) => [...prev, unrevealedStats[0]]);
    }
  };

  const handleCorrectGuess = async () => {
    if (!user || !firestore || !playerStatDocRef) return;
    
    runTransaction(firestore, async (transaction) => {
        const statDoc = await transaction.get(playerStatDocRef);
        const initialData = {
            userId: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            statDetectiveGamesPlayed: 1,
            statDetectiveGamesWon: 1,
            footballerFaceoffGamesPlayed: 0,
            footballerFaceoffGamesWon: 0,
            clubGuessrGamesPlayed: 0,
            clubGuessrGamesWon: 0,
            coins: 10,
        };
        const updateData = {
            statDetectiveGamesWon: increment(1),
            coins: increment(10)
        };

         if (!statDoc.exists()) {
            transaction.set(playerStatDocRef, initialData);
         } else {
            transaction.update(playerStatDocRef, updateData);
         }
    }).then(() => {
        toast({
            title: t('stat.correctToast.title'),
            description: t('stat.correctToast.description', { playerName: footballer!.name }),
        });
        toast({
            title: t('stat.coinsAdded'),
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


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!footballer) return;
    const currentGuesses = [...guesses, values.guess];
    setGuesses(currentGuesses);
    
    if (values.guess.toLowerCase() === footballer.name.toLowerCase()) {
      setIsCorrect(true);
      handleCorrectGuess();
    } else {
      toast({
        variant: 'destructive',
        title: t('stat.incorrectToast.title'),
        description: t('stat.incorrectToast.description'),
      });
       if ((currentGuesses.length) % 1 === 0 && currentGuesses.length < MAX_ATTEMPTS) {
         revealNextStat();
       }

      if (currentGuesses.length >= MAX_ATTEMPTS) {
        setIsCorrect(false); // Game over
      }
    }
    setFilteredFootballers([]);
    form.reset();
  };

  const handleSuggestionClick = (name: string) => {
    form.setValue('guess', name);
    form.handleSubmit(onSubmit)();
  };
  
  const handleGetClue = () => {
    if (!footballer || !user || !playerStatDocRef) return;

    if (!userStat || (userStat.purchasedClues || 0) <= 0) {
        toast({
            variant: 'destructive',
            title: t('clue.noClues'),
            description: t('clue.buyMore'),
        });
        return;
    }

    // Decrement the clue count in Firestore without blocking
    updateDoc(playerStatDocRef, {
        purchasedClues: increment(-1)
    }).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
            path: playerStatDocRef.path,
            operation: 'update',
            requestResourceData: { purchasedClues: increment(-1) }
        });
        errorEmitter.emit('permission-error', permissionError);
        // This is a non-critical error, the user still gets the clue.
        console.error("Failed to decrement clue balance:", error);
    });

    // Fetch the clue
    startClueTransition(async () => {
        const knownStats = `The player's name is ${footballer.name}. Height: ${footballer.stats.height}, Weight: ${footballer.stats.weight}, Club: ${footballer.stats.club}, Goals: ${footballer.stats.careerGoals}.`;
        const newClue = await getSmartClueAction({
            knownStats,
            clueLevel,
            footballerName: footballer.name,
        });
        setClue(newClue);
        setClueLevel((prev) => prev + 1);
    });
  };

  const attemptsLeft = MAX_ATTEMPTS - guesses.length;
  const isGameOver = attemptsLeft <= 0 || isCorrect;
  const portraitImage = footballer ? PlaceHolderImages.find(p => p.id === footballer.portraitImageUrlId) : undefined;

  const getStatLabel = (label: 'Height' | 'Weight' | 'Career Goals' | 'Club') => {
    switch (label) {
      case 'Height': return t('stat.height');
      case 'Weight': return t('stat.weight');
      case 'Career Goals': return t('stat.careerGoals');
      case 'Club': return t('stat.club');
    }
  }


  if (!footballer) {
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
        <h1 className="font-headline text-xl font-bold">{t('stat.title')}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-center text-2xl">{t('stat.whoAmI')}</CardTitle>
            <CardDescription className="text-center">{t('stat.attemptsLeft', { attemptsLeft, attempts: attemptsLeft })}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <AnimatePresence>
            {revealedStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col items-center justify-center p-4 text-center h-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                  <p className="mt-2 text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{getStatLabel(stat.label)}</p>
                </Card>
              </motion.div>
            ))}
            </AnimatePresence>
             {Array.from({ length: 4 - revealedStats.length }).map((_, index) => (
                <Card key={`placeholder-${index}`} className="flex flex-col items-center justify-center p-4 text-center bg-muted/50 border-dashed">
                  <p className="text-muted-foreground">?</p>
                </Card>
            ))}
          </CardContent>
        </Card>
        
        {!isGameOver && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="guess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">{t('stat.guessPlaceholder')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('stat.guessPlaceholder')} {...field} className="text-center text-lg h-12" autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {filteredFootballers.length > 0 && (
                <Card>
                  <ScrollArea className="h-40">
                    <CardContent className="p-2">
                      {filteredFootballers.map((f) => (
                        <div
                          key={f.id}
                          className="cursor-pointer rounded-md p-2 hover:bg-muted"
                          onClick={() => handleSuggestionClick(f.name)}
                        >
                          {f.name}
                        </div>
                      ))}
                    </CardContent>
                  </ScrollArea>
                </Card>
              )}
              <Button type="submit" className="w-full" size="lg">{t('stat.submitGuess')}</Button>
            </form>
          </Form>
        )}

        <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  {isCorrect ? t('stat.youGotIt') : t('stat.gameOver')}
                </CardTitle>
                <CardDescription>
                  {t('stat.playerWas', { playerName: footballer.name })}
                </CardDescription>
              </CardHeader>
              {portraitImage && (
                <CardContent>
                  <Image src={portraitImage.imageUrl} alt={footballer.name} width={150} height={200} className="mx-auto rounded-lg shadow-lg" data-ai-hint={portraitImage.imageHint} />
                </CardContent>
              )}
              <CardFooter>
                 <Button onClick={handleNextPlayer} className="w-full" size="lg">{t('stat.playAgain')}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        </AnimatePresence>

        <div className="mt-6 space-y-4">
           {guesses.length > 0 && !isGameOver && (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-headline">{t('stat.yourGuesses')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {guesses.map((g, i) => (
                        <div key={i} className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                             g.toLowerCase() === footballer.name.toLowerCase() ? 'bg-green-500/20 text-green-200' : 'bg-destructive/20 text-destructive-foreground'
                        )}>
                            {g}
                        </div>
                    ))}
                </CardContent>
            </Card>
           )}

          <Button
            variant="outline"
            className="w-full border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground"
            onClick={handleGetClue}
            disabled={isClueLoading || isGameOver || (userStat?.purchasedClues || 0) <= 0}
          >
            {isClueLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {t('stat.getClue', { clueLevel })} ({userStat?.purchasedClues || 0} {t('clue.left')})
          </Button>

          {clue && (
            <Alert className="bg-accent/5 border-accent/20">
              <Lightbulb className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent font-headline">{t('clue.smartClue')}</AlertTitle>
              <AlertDescription>
                {clue.isVisualClue && clue.visualClueDataUri ? (
                  <Image
                    src={clue.visualClueDataUri}
                    alt="Visual Clue"
                    width={300}
                    height={300}
                    className="mt-2 rounded-md"
                  />
                ) : (
                  clue.clue
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(StatDetectivePage);
