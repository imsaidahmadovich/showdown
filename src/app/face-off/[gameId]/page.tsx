'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { footballers, type Footballer } from '@/lib/data';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useLanguage } from '@/context/language-context';
import { doc, updateDoc, increment, runTransaction, DocumentReference, serverTimestamp } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
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
const GAME_ROUNDS = 5;

type GameStatus = 'waiting' | 'playing' | 'finished';

type FaceOffGame = {
  id: string;
  playerIds: string[];
  players: {
    [uid: string]: {
      displayName: string;
      photoURL: string;
    }
  };
  status: GameStatus;
  questions: number[];
  currentRound: number;
  rounds: {
      guesses?: {[uid: string]: string};
      results?: {[uid: string]: boolean};
  }[];
  scores: {[uid: string]: number};
  winnerId?: string;
  lastUpdate?: any;
};


const PlayerCard = ({ name, score, avatarUrl }: { name: string; score: number; avatarUrl: string; }) => {
  const { t } = useLanguage();
  return (
    <div className={'flex items-center gap-3'}>
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={'flex flex-col text-left'}>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">
          {t('faceOff.score')}: {score}
        </p>
      </div>
    </div>
  );
};

function FaceOffGamePage({ params }: { params: { gameId: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const router = useRouter();
  const gameId = params.gameId;

  const [userGuess, setUserGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredFootballers, setFilteredFootballers] = useState<Footballer[]>([]);
  
  const gameDocRef = useMemoFirebase(() => {
      if (!firestore || !gameId) return null;
      return doc(firestore, 'faceOffGames', gameId);
  }, [firestore, gameId]);

  const {data: game, isLoading: isGameLoading} = useDoc<FaceOffGame>(gameDocRef);

  // Effect to score the round when both players have guessed
  useEffect(() => {
    if (!game || !user || game.status !== 'playing' || !gameDocRef) return;
    
    const currentRoundIndex = game.currentRound;
    const currentRound = game.rounds[currentRoundIndex];
    if (!currentRound) return;

    const playerIds = game.playerIds;
    const guessesExist = playerIds.every(id => currentRound.guesses && currentRound.guesses[id]);
    const resultsExist = currentRound.results && Object.keys(currentRound.results).length > 0;

    if (guessesExist && !resultsExist) {
        // Designate one player to score to prevent race conditions
        const scorerId = [...playerIds].sort()[0];

        if (user.uid === scorerId) {
            const scoreRound = async () => {
                const currentFootballer = footballers.find(f => f.id === game.questions[currentRoundIndex]);
                if (!currentFootballer || !currentRound.guesses) return;

                const updates: any = {};
                let userFinalScore = game.scores[playerIds[0]] || 0;
                let opponentFinalScore = game.scores[playerIds[1]] || 0;

                playerIds.forEach(playerId => {
                    const guess = currentRound.guesses![playerId];
                    const isCorrect = guess.toLowerCase() === currentFootballer.name.toLowerCase();
                    updates[`rounds.${currentRoundIndex}.results.${playerId}`] = isCorrect;
                    if (isCorrect) {
                       updates[`scores.${playerId}`] = increment(1);
                        if(playerId === user.uid) userFinalScore++; else opponentFinalScore++;
                    }
                });

                if (currentRoundIndex < GAME_ROUNDS - 1) {
                    updates.currentRound = increment(1);
                } else {
                    updates.status = 'finished';
                    if (userFinalScore > opponentFinalScore) updates.winnerId = playerIds.find(id => id === user.uid);
                    else if (opponentFinalScore > userFinalScore) updates.winnerId = playerIds.find(id => id !== user.uid);
                    else updates.winnerId = 'draw';
                }
                updates.lastUpdate = serverTimestamp();
                await updateDoc(gameDocRef, updates);
            };
            scoreRound();
        }
    }
  }, [game, user, gameDocRef]);

  // Effect to award coins on game completion
  useEffect(() => {
    if (game && game.status === 'finished' && user && game.winnerId === user.uid) {
        const awardedKey = `game-${game.id}-awarded`;
        if (localStorage.getItem(awardedKey) === 'true') return;

        const playerStatRef = doc(firestore, "playerStatistics", user.uid);
        updateDoc(playerStatRef, { coins: increment(25) })
            .then(() => {
                localStorage.setItem(awardedKey, 'true');
            })
            .catch(console.error);
    }
  }, [game, user, firestore]);

  useEffect(() => {
    if (userGuess && userGuess.length > 1) {
      setFilteredFootballers(
        footballers.filter((f) =>
          f.name.toLowerCase().includes(userGuess.toLowerCase())
        )
      );
    } else {
      setFilteredFootballers([]);
    }
  }, [userGuess]);

  const processGuess = async (guess: string) => {
    if (!guess || isSubmitting || !user || !game || !gameDocRef) return;
    
    setIsSubmitting(true);
    setFilteredFootballers([]);
    setUserGuess('');

    const currentRoundIndex = game.currentRound;
    
    const updates: any = {};
    updates[`rounds.${currentRoundIndex}.guesses.${user.uid}`] = guess;
    updates.lastUpdate = serverTimestamp();
    
    await updateDoc(gameDocRef, updates).catch(e => {
        const permissionError = new FirestorePermissionError({
            path: gameDocRef.path,
            operation: 'update',
            requestResourceData: updates
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    setIsSubmitting(false); // UI will update reactively to show waiting state
  }
  
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processGuess(userGuess);
  };

  const handleSuggestionClick = (name: string) => {
    processGuess(name);
  };
  
  if (isGameLoading || !game || !user) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
  }

  const otherPlayerId = game.playerIds.find(p => p !== user.uid);
  if (game.status === 'waiting' && !otherPlayerId) {
      return (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-xl text-muted-foreground text-center">Waiting for an opponent to join...</p>
          </div>
      );
  }
  
  if(!otherPlayerId) {
       return (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
            <p className="font-headline text-xl text-muted-foreground text-center">Opponent left the game.</p>
             <Button asChild><Link href="/face-off/lobby">Back to Lobby</Link></Button>
          </div>
      );
  }
  
  const opponent = game.players[otherPlayerId];
  const currentUserPlayer = game.players[user.uid];
  const currentFootballer = footballers.find(f => f.id === game.questions[game.currentRound]);
  const questionImage = currentFootballer ? PlaceHolderImages.find((img) => img.id === currentFootballer.portraitImageUrlId) : null;
  const currentRound = game.rounds[game.currentRound];
  const userHasGuessed = !!currentRound?.guesses?.[user.uid];

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/face-off/lobby">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="font-headline text-xl font-bold">{t('faceOff.title')}</h1>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="p-4">
          <div className="grid grid-cols-3 items-center">
            <PlayerCard name={currentUserPlayer.displayName} score={game.scores[user.uid] || 0} avatarUrl={currentUserPlayer.photoURL} />
            <p className="font-headline text-2xl text-muted-foreground text-center">{t('faceOff.vs')}</p>
            <div className="flex justify-end">
              <PlayerCard name={opponent.displayName} score={game.scores[otherPlayerId] || 0} avatarUrl={opponent.photoURL} />
            </div>
          </div>
          <Progress value={((game.currentRound + (game.status === 'finished' ? 1 : 0)) / GAME_ROUNDS) * 100} className="mt-4 h-2" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {game.status === 'finished' ? (
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">
                  {game.winnerId === 'draw' ? t('faceOff.draw') : (game.winnerId === user.uid ? `You Win!` : `You Lose!`)}
                </CardTitle>
                <CardDescription>
                  {t('faceOff.finalScore')}: {game.scores[user.uid]} - {game.scores[otherPlayerId]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {game.winnerId === user.uid && <p className="text-lg font-bold text-accent">+25 {t('profile.coins')}</p>}
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button onClick={() => router.push('/face-off/lobby')} className="w-full" size="lg">Find New Game</Button>
                 <Button variant="outline" asChild className="w-full">
                  <Link href="/">{t('bottomNav.home')}</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-center">
                  {t('faceOff.whoIsThis')} ({game.currentRound + 1} / {GAME_ROUNDS})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {questionImage ? (
                  <div className="relative aspect-[4/3] w-full bg-muted">
                     <Image
                      src={questionImage.imageUrl} alt="Portrait of a footballer" data-ai-hint={questionImage.imageHint} fill className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {game.status === 'playing' && (
          <div className="mt-auto border-t bg-card/80 p-4 backdrop-blur-sm">
            {userHasGuessed ? (
              <div className="text-center text-muted-foreground font-bold p-4">Waiting for opponent...</div>
            ) : (
            <>
              <form onSubmit={handleGuessSubmit} className="flex items-center gap-2">
                <Input
                  type="text" value={userGuess} onChange={(e) => setUserGuess(e.target.value)} placeholder={t('faceOff.guessPlaceholder')}
                  className="flex-1" disabled={isSubmitting} autoComplete='off'
                />
                <Button type="submit" size="icon" className="shrink-0 bg-accent hover:bg-accent/90" disabled={isSubmitting || !userGuess}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              {filteredFootballers.length > 0 && !isSubmitting && (
                  <Card className="mt-2">
                    <ScrollArea className="h-40">
                      <CardContent className="p-2">
                        {filteredFootballers.map((f) => (
                          <div key={f.id} className="cursor-pointer rounded-md p-2 hover:bg-muted" onClick={() => handleSuggestionClick(f.name)}>
                            {f.name}
                          </div>
                        ))}
                      </CardContent>
                    </ScrollArea>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(FaceOffGamePage);
