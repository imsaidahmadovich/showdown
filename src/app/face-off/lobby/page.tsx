'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PlusCircle, Swords, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useLanguage } from '@/context/language-context';
import { collection, addDoc, updateDoc, serverTimestamp, query, where, doc, arrayUnion, runTransaction, increment } from 'firebase/firestore';
import { getRandomFootballer, type Footballer } from '@/lib/data';
import type { PlayerStatistic } from '@/lib/data';

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
  createdAt: any;
};

function FaceOffLobbyPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  const gamesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'faceOffGames');
  }, [firestore]);

  const waitingGamesQuery = useMemoFirebase(() => {
    if (!gamesCollection) return null;
    // Query for games with only one player waiting
    return query(gamesCollection, where('status', '==', 'waiting'));
  }, [gamesCollection]);

  const { data: waitingGames, isLoading } = useCollection<FaceOffGame>(waitingGamesQuery);

  const handleCreateGame = async () => {
    if (!user || !gamesCollection) return;
    setIsCreating(true);

    let questions: number[] = [];
    let usedIds: number[] = [];
    while(questions.length < GAME_ROUNDS) {
      const newFootballer = getRandomFootballer(usedIds);
      questions.push(newFootballer.id);
      usedIds.push(newFootballer.id);
    }

    const gameData = {
      playerIds: [user.uid],
      players: {
        [user.uid]: {
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      },
      status: 'waiting',
      createdAt: serverTimestamp(),
      questions,
      currentRound: 0,
      rounds: Array(GAME_ROUNDS).fill({ guesses: {}, results: {} }),
      scores: {
        [user.uid]: 0
      }
    };

    try {
      const gameRef = await addDoc(gamesCollection, gameData);
      router.push(`/face-off/${gameRef.id}`);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
          path: gamesCollection.path,
          operation: 'create',
          requestResourceData: gameData
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsCreating(false);
    }
  };
  
  const handleJoinGame = async (gameId: string) => {
    if (!user || !firestore || !waitingGames) return;
    setIsJoining(gameId);

    // The player joining the game is responsible for updating the 'gamesPlayed'
    // stat for BOTH players to ensure it only happens once when the game starts.
    const gameToJoin = waitingGames.find(g => g.id === gameId);
    if (gameToJoin && gameToJoin.playerIds.length === 1) {
        const creatorId = gameToJoin.playerIds[0];

        const creatorStatRef = doc(firestore, 'playerStatistics', creatorId);
        updateDoc(creatorStatRef, { footballerFaceoffGamesPlayed: increment(1) }).catch(console.error);

        const joinerStatRef = doc(firestore, 'playerStatistics', user.uid);
        runTransaction(firestore, async (transaction) => {
            const statDoc = await transaction.get(joinerStatRef);
            const initialData = {
                userId: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                footballerFaceoffGamesPlayed: 1,
            };
            if (!statDoc.exists()) {
                transaction.set(joinerStatRef, initialData);
            } else {
                transaction.update(joinerStatRef, { footballerFaceoffGamesPlayed: increment(1) });
            }
        }).catch(console.error);
    } else {
        console.error("Game is no longer available or already full.");
        setIsJoining(null);
        // Optionally, add a toast to inform the user
        return;
    }

    const gameRef = doc(firestore, 'faceOffGames', gameId);
    
    const updates = {
      status: 'playing',
      playerIds: arrayUnion(user.uid),
      [`players.${user.uid}`]: {
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      [`scores.${user.uid}`]: 0,
    };

    try {
      await updateDoc(gameRef, updates);
      router.push(`/face-off/${gameId}`);
    } catch (error) {
       const permissionError = new FirestorePermissionError({
          path: gameRef.path,
          operation: 'update',
          requestResourceData: updates
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsJoining(null);
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
        <h1 className="font-headline text-xl font-bold">{t('faceOff.title')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <Button onClick={handleCreateGame} disabled={isCreating} size="lg" className="w-full">
          {isCreating ? <Loader2 className="animate-spin" /> : <PlusCircle />}
          Create New Game
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Join a Game</CardTitle>
            <CardDescription>Click on a game to join and play against someone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
            {!isLoading && waitingGames?.filter(g => g.playerIds.length === 1).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No waiting games. Create one!</p>
            )}
            {waitingGames?.filter(g => g.playerIds.length === 1).map(game => (
                <Card key={game.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={game.players[game.playerIds[0]].photoURL} />
                            <AvatarFallback>{game.players[game.playerIds[0]].displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold">{game.players[game.playerIds[0]].displayName}</p>
                            <p className="text-sm text-muted-foreground">Waiting for opponent...</p>
                        </div>
                    </div>
                    <Button onClick={() => handleJoinGame(game.id)} disabled={isJoining === game.id || user?.uid === game.playerIds[0]}>
                        {isJoining === game.id ? <Loader2 className="animate-spin" /> : 'Join'}
                    </Button>
                </Card>
            ))}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
export default withAuth(FaceOffLobbyPage);
