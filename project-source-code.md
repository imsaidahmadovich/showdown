# Pixel Soccer Showdown - Loyiha Manba Kodi

Ushbu fayl loyihadagi barcha manba kodlarini o'z ichiga oladi. Har bir faylni o'z joyiga va nomiga mos ravishda kompyuteringizda yaratib, loyihani qayta tiklashingiz mumkin.

---

### `.env`

```

```

---

### `README.md`

```md
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

```

---

### `apphosting.yaml`

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1

```

---

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

### `docs/backend.json`

```json
{
  "entities": {
    "User": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "User",
      "type": "object",
      "description": "Represents a user of the Pixel Soccer Showdown app.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the User entity. Matches Firebase Auth UID."
        },
        "email": {
          "type": "string",
          "description": "Email address of the user.",
          "format": "email"
        },
        "displayName": {
          "type": "string",
          "description": "The user's display name."
        },
        "photoURL": {
          "type": "string",
          "description": "URL of the user's profile photo, obtained from google sign in.",
          "format": "uri"
        },
        "creationTimestamp": {
          "type": "string",
          "description": "Timestamp indicating when the user account was created.",
          "format": "date-time"
        }
      },
      "required": [
        "id",
        "email",
        "displayName",
        "creationTimestamp"
      ]
    },
    "PlayerStatistic": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "PlayerStatistic",
      "type": "object",
      "description": "Represents a user's statistics and progress within the game.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the PlayerStatistic entity."
        },
        "userId": {
          "type": "string",
          "description": "Reference to User. (Relationship: User 1:1 PlayerStatistic)"
        },
        "clubGuessrGamesPlayed": {
          "type": "number",
          "description": "Number of Club Guessr games played by the user."
        },
        "clubGuessrGamesWon": {
          "type": "number",
          "description": "Number of Club Guessr games won by the user."
        },
        "statDetectiveGamesPlayed": {
          "type": "number",
          "description": "Number of stat detective games played by the user."
        },
        "statDetectiveGamesWon": {
          "type": "number",
          "description": "Number of stat detective games won by the user."
        },
        "footballerFaceoffGamesPlayed": {
          "type": "number",
          "description": "Number of footballer face-off games played by the user."
        },
        "footballerFaceoffGamesWon": {
          "type": "number",
          "description": "Number of footballer face-off games won by the user."
        },
        "coins": {
          "type": "number",
          "description": "The user's total coins earned from winning games."
        },
        "purchasedThemes": {
            "type": "array",
            "description": "An array of theme IDs that the user has purchased.",
            "items": {
                "type": "string"
            }
        },
        "purchasedAvatars": {
            "type": "array",
            "description": "An array of avatar image URLs that the user has purchased.",
            "items": {
                "type": "string",
                "format": "uri"
            }
        },
        "purchasedClues": {
            "type": "number",
            "description": "The number of clues the user has purchased and has available."
        }
      },
      "required": [
        "id",
        "userId"
      ]
    }
  },
  "auth": {
    "providers": [
      "google.com"
    ]
  },
  "firestore": {
    "structure": [
      {
        "path": "/users/{userId}",
        "definition": {
          "entityName": "User",
          "schema": {
            "$ref": "#/backend/entities/User"
          },
          "description": "Stores user profile information. Publicly readable for leaderboards, but only the authenticated user can modify their own profile.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier of the user."
            }
          ]
        }
      },
      {
        "path": "/users/{userId}/playerStatistics/{playerStatisticId}",
        "definition": {
          "entityName": "PlayerStatistic",
          "schema": {
            "$ref": "#/backend/entities/PlayerStatistic"
          },
          "description": "Stores player statistics related to a specific user. This is now a legacy collection and new data should be written to the top-level playerStatistics collection.",
          "params": [
            {
              "name": "userId",
              "description": "The unique identifier of the user."
            },
            {
              "name": "playerStatisticId",
              "description": "The unique identifier of the statistic document."
            }
          ]
        }
      },
      {
        "path": "/playerStatistics/{playerStatisticId}",
        "definition": {
          "entityName": "PlayerStatistic",
          "schema": {
            "$ref": "#/backend/entities/PlayerStatistic"
          },
          "description": "A denormalized, top-level collection of all player statistics, optimized for efficient querying of leaderboards. This collection is publicly readable by all authenticated users. Each user can only write to their own document within this collection.",
          "params": [
            {
              "name": "playerStatisticId",
              "description": "The unique identifier of the statistic document, which must match the authenticated user's UID."
            }
          ]
        }
      }
    ],
    "reasoning": "This Firestore data structure is designed to support the Pixel Soccer Showdown app, focusing on user authentication, player statistics, and a scalable leaderboard. The structure prioritizes Authorization Independence and supports the required Queryability, Atomicity, and Predictability (QAPs). \n\n**Authorization & Access:**\n\n*   **User Data (`/users/{userId}`):** User profiles are publicly readable to fetch display names and avatars for the leaderboard. However, write access is strictly limited to the user themselves (`isOwner(userId)`), ensuring data privacy and integrity.\n*   **Leaderboard Collection (`/playerStatistics`):** A denormalized, top-level collection `playerStatistics` is the primary source for leaderboard data. This is crucial for performance and security. It allows for efficient, indexed queries (`orderBy('coins').limit(10)`) without needing to scan all user documents. This collection is publicly readable by any authenticated user, but users can only write to their own document (where the document ID matches their UID), preventing cheating.\n\n**QAPs (Rules are not Filters):**\n\n*   The top-level `playerStatistics` collection is designed for secure `list` operations. Security rules can allow any signed-in user to `read` this collection, and the queries for the top 10 players are efficient and don't require filtering sensitive data.\n\n**Invariants:**\n\n*   Ownership is enforced by the path for all write operations in the `/users/{userId}` path. For the `/playerStatistics/{statisticId}` path, ownership is enforced by a rule checking `request.auth.uid == statisticId`."
  }
}
```

---

### `firestore.rules`

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create, update: if isOwner(userId);
      allow delete: if false;

      match /playerStatistics/{playerStatisticId} {
        allow read: if isSignedIn();
        allow write: if isOwner(userId);
      }
    }

     match /playerStatistics/{statisticId} {
        allow read: if isSignedIn();
        allow write: if isOwner(statisticId);
     }
  }
}
```

---

### `next.config.ts`

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

### `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "NODE_ENV=production next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/google-genai": "^1.20.0",
    "@genkit-ai/next": "^1.20.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "framer-motion": "^11.3.19",
    "genkit": "^1.20.0",
    "lucide-react": "^0.475.0",
    "next": "15.5.9",
    "patch-package": "^8.0.0",
    "react": "^19.2.1",
    "react-day-picker": "^9.11.3",
    "react-dom": "^19.2.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19.2.1",
    "@types/react-dom": "^19.2.1",
    "genkit-cli": "^1.20.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

### `src/ai/dev.ts`

```ts
import { config } from 'dotenv';
config();

import '@/ai/flows/smart-clue-generation.ts';
```

---

### `src/ai/flows/smart-clue-generation.ts`

```ts
'use server';

/**
 * @fileOverview A flow that provides increasingly detailed clues about a footballer.
 *
 * - generateSmartClue - A function that generates a clue about a footballer based on available information.
 * - SmartClueInput - The input type for the generateSmartClue function.
 * - SmartClueOutput - The return type for the generateSmartClue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const searchFootballerInfo = ai.defineTool(
  {
    name: 'searchFootballerInfo',
    description: 'Search for interesting facts about a footballer.',
    inputSchema: z.object({
      query: z.string().describe('The name of the footballer to search for.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // In a real app, this would perform a web search.
    // For this prototype, we'll return a mock fact.
    return `The player is known for their iconic goal celebrations.`;
  }
);


const SmartClueInputSchema = z.object({
  knownStats: z
    .string()
    .describe('Known statistics about the footballer, such as weight, height, career goals, club.'),
  clueLevel: z
    .number()
    .describe('The level of clue to provide, with higher numbers indicating more detailed clues.'),
  footballerName: z
    .string()
    .describe('The name of the footballer to generate a clue for.'),
});
export type SmartClueInput = z.infer<typeof SmartClueInputSchema>;

const SmartClueOutputSchema = z.object({
  clue: z.string().describe('A clue about the footballer.'),
  isVisualClue: z
    .boolean()
    .describe('Whether the clue is visual (e.g., silhouette) or textual.'),
  visualClueDataUri: z
    .string()
    .optional()
    .describe(
      'If the clue is visual, this is the data URI of the image. Should be a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type SmartClueOutput = z.infer<typeof SmartClueOutputSchema>;

export async function generateSmartClue(input: SmartClueInput): Promise<SmartClueOutput> {
  return smartClueGenerationFlow(input);
}

const smartCluePrompt = ai.definePrompt({
  name: 'smartCluePrompt',
  input: {schema: SmartClueInputSchema},
  output: {schema: SmartClueOutputSchema},
  tools: [searchFootballerInfo],
  prompt: `You are an AI assistant designed to provide clues about a footballer.

  Based on the known statistics and the requested clue level, generate a helpful clue for the footballer: {{{footballerName}}}.

  Known Stats: {{{knownStats}}}
  Clue Level: {{{clueLevel}}}

  - For clue level 1, provide a vague hint about their play style or position.
  - For clue level 2, use the searchFootballerInfo tool to find an interesting fact.
  - For clue level 3, give a more direct clue about a famous team they played for or a major award they won.
  - For clue level 4 or higher, you can generate a visual clue. Generate an image of the footballer's national team jersey, but without the name or number. Set isVisualClue to true. If you generate a visual clue, you MUST also set the visualClueDataUri. For the textual clue field, briefly describe the image.

  The output should be structured as follows:
  - If you generate a visual clue, set isVisualClue to true and provide the image data URI in visualClueDataUri.
  - If the clue is textual, set isVisualClue to false and provide the clue in the 'clue' field.
  `,
});

const smartClueGenerationFlow = ai.defineFlow(
  {
    name: 'smartClueGenerationFlow',
    inputSchema: SmartClueInputSchema,
    outputSchema: SmartClueOutputSchema,
  },
  async input => {
    if (input.clueLevel < 4) {
        const {output} = await smartCluePrompt(input);
        return output!;
    }
    
    // For visual clues, we generate an image
    const llmResponse = await smartCluePrompt(input);
    const generationRequest = llmResponse.toolRequest('generateImage');

    if (generationRequest) {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: generationRequest.input.prompt,
      });

      generationRequest.resolve({
        media: {
          url: media.url!,
          contentType: media.contentType
        }
      });
      
      const finalResponse = await llmResponse.continue();
      return finalResponse.output!;
    }

    return llmResponse.output!;
  }
);
```

---

### `src/ai/genkit.ts`

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

---

### `src/app/actions.ts`

```ts
'use server';

import {
  generateSmartClue,
  type SmartClueInput,
  type SmartClueOutput,
} from '@/ai/flows/smart-clue-generation';

export async function getSmartClueAction(
  input: SmartClueInput
): Promise<SmartClueOutput> {
  // In a real app, you would add validation, authentication, and error handling here.
  try {
    const output = await generateSmartClue(input);
    return output;
  } catch (error) {
    console.error('Error generating smart clue:', error);
    // Return a structured error to the client
    return {
      clue: 'Sorry, I couldn\'t think of a clue right now. Please try again.',
      isVisualClue: false,
    };
  }
}
```

---

### `src/app/club-guessr/page.tsx`

```tsx
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
  CardFooter,
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

  const portraitImage = PlaceHolderImages.find(p => p.id === footballer?.portraitImageUrlId);

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

export default withAuth(ClubGuessrPage);
```

---

### `src/app/face-off/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { footballers, getRandomFootballer, type Footballer, type PlayerStatistic } from '@/lib/data';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useLanguage } from '@/context/language-context';
import { doc, increment, runTransaction, DocumentReference } from 'firebase/firestore';


const PlayerCard = ({
  name,
  score,
  avatarUrl,
  isUser,
  avatarHint,
}: {
  name: string;
  score: number;
  avatarUrl: string;
  isUser?: boolean;
  avatarHint?: string;
}) => {
  const { t } = useLanguage();
  return (
    <div
      className={cn('flex items-center gap-3', isUser ? 'flex-row-reverse' : '')}
    >
      <Avatar>
        <AvatarImage src={avatarUrl} data-ai-hint={avatarHint} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn('flex flex-col', isUser ? 'text-right' : 'text-left')}
      >
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">
          {t('faceOff.score')}: {score}
        </p>
      </div>
    </div>
  );
};

const GAME_ROUNDS = 5;

function FaceOffPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();

  const [gameStage, setGameStage] = useState<'starting' | 'playing' | 'finished'>('starting');
  const [questions, setQuestions] = useState<Footballer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roundResult, setRoundResult] = useState<'user' | 'rival' | 'draw' | 'none'>('none');

    const getPlayerStatDocRef = (userId: string): DocumentReference<PlayerStatistic> | null => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'playerStatistics', userId) as DocumentReference<PlayerStatistic>;
    };
    const playerStatDocRef = useMemoFirebase(() => getPlayerStatDocRef(user?.uid ?? ''), [firestore, user]);


 const setupGame = async () => {
    let selectedQuestions: Footballer[] = [];
    let usedIds: number[] = [];
    while (selectedQuestions.length < GAME_ROUNDS) {
      const newFootballer = getRandomFootballer(usedIds);
      selectedQuestions.push(newFootballer);
      usedIds.push(newFootballer.id);
    }
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setRivalScore(0);
    setGameStage('playing');

    if (user && firestore && playerStatDocRef) {
      runTransaction(firestore, async (transaction) => {
          const statDoc = await transaction.get(playerStatDocRef);
          const initialData = {
              userId: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              statDetectiveGamesPlayed: 0,
              statDetectiveGamesWon: 0,
              footballerFaceoffGamesPlayed: 1,
              footballerFaceoffGamesWon: 0,
              clubGuessrGamesPlayed: 0,
              clubGuessrGamesWon: 0,
              coins: 0,
          };
          if (!statDoc.exists()) {
              transaction.set(playerStatDocRef, initialData);
          } else {
              transaction.update(playerStatDocRef, {
                  footballerFaceoffGamesPlayed: increment(1)
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
    const timer = setTimeout(() => {
      if (gameStage === 'starting') {
        setupGame();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [gameStage, user, firestore]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess || isSubmitting) return;

    setIsSubmitting(true);
    const currentFootballer = questions[currentQuestionIndex];
    const isUserCorrect = userGuess.toLowerCase() === currentFootballer.name.toLowerCase();

    // Simple AI opponent logic
    const isRivalCorrect = Math.random() > 0.4; // 60% chance of being correct

    let newUserScore = userScore;
    let newRivalScore = rivalScore;

    if (isUserCorrect) {
      newUserScore += 1;
      setUserScore(newUserScore);
    }
    if (isRivalCorrect) {
      newRivalScore += 1;
      setRivalScore(newRivalScore);
    }

    if(isUserCorrect && !isRivalCorrect) setRoundResult('user');
    else if (!isUserCorrect && isRivalCorrect) setRoundResult('rival');
    else if (isUserCorrect && isRivalCorrect) setRoundResult('draw');
    else setRoundResult('none');


    setTimeout(() => {
      if (currentQuestionIndex < GAME_ROUNDS - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserGuess('');
        setRoundResult('none');
      } else {
        // Game finished
        setGameStage('finished');
        if (user && firestore && playerStatDocRef && newUserScore > newRivalScore) {
           runTransaction(firestore, async (transaction) => {
              const statDoc = await transaction.get(playerStatDocRef);
              if (statDoc.exists()) {
                   transaction.update(playerStatDocRef, {
                      footballerFaceoffGamesWon: increment(1),
                      coins: increment(25),
                   });
              }
           }).catch(async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: playerStatDocRef.path,
                    operation: 'update',
                    requestResourceData: {
                      footballerFaceoffGamesWon: increment(1),
                      coins: increment(25),
                    }
                });
                errorEmitter.emit('permission-error', permissionError);
           });
        }
      }
      setIsSubmitting(false);
    }, 2000);
  };

  const player1Avatar = user?.photoURL;
  const player2Avatar = PlaceHolderImages.find((img) => img.id === 'avatar-2');
  const currentFootballer = questions[currentQuestionIndex];
  const questionImage = currentFootballer
    ? PlaceHolderImages.find((img) => img.id === currentFootballer.portraitImageUrlId)
    : null;

  if (gameStage === 'starting') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-xl text-muted-foreground">{t('faceOff.matchStarting')}</p>
      </div>
    );
  }

  const winner = userScore > rivalScore ? user?.displayName : (rivalScore > userScore ? 'RivalPlayer' : 'draw');


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

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <PlayerCard
              name={user?.displayName || 'You'}
              score={userScore}
              avatarUrl={player1Avatar || ''}
              isUser
            />
            <p className="font-headline text-2xl text-muted-foreground">
              {t('faceOff.vs')}
            </p>
            <PlayerCard
              name="RivalPlayer"
              score={rivalScore}
              avatarUrl={player2Avatar?.imageUrl || ''}
              avatarHint={player2Avatar?.imageHint}
            />
          </div>
          <Progress value={((currentQuestionIndex + 1) / GAME_ROUNDS) * 100} className="mt-4 h-2" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {gameStage === 'finished' ? (
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">
                  {winner === 'draw' ? t('faceOff.draw') : `${winner} ${t('faceOff.wins')}!`}
                </CardTitle>
                <CardDescription>
                  {t('faceOff.finalScore')}: {userScore} - {rivalScore}
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {userScore > rivalScore && <p className="text-lg font-bold text-accent">+25 {t('profile.coins')}</p>}
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button onClick={setupGame} className="w-full" size="lg">{t('stat.playAgain')}</Button>
                 <Button variant="outline" asChild className="w-full">
                  <Link href="/">{t('bottomNav.home')}</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-center">
                  {t('faceOff.whoIsThis')} ({currentQuestionIndex + 1} / {GAME_ROUNDS})
                </CardTitle>
                 {isSubmitting && roundResult !== 'none' && (
                    <CardDescription className={cn(
                        "text-center font-bold",
                        roundResult === 'user' && 'text-green-500',
                        roundResult === 'rival' && 'text-red-500',
                        roundResult === 'draw' && 'text-yellow-500',
                    )}>
                        {
                            roundResult === 'user' ? t('faceOff.pointYou') :
                            roundResult === 'rival' ? t('faceOff.pointRival') :
                            t('faceOff.pointBoth')
                        }
                    </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {questionImage ? (
                  <div className="relative aspect-[4/3] w-full bg-muted">
                     <Image
                      src={questionImage.imageUrl}
                      alt="Portrait of a footballer"
                      data-ai-hint={questionImage.imageHint}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Loader2 className="h-32 w-full animate-spin text-primary" />
                )}
              </CardContent>
            </Card>
          )}
        </div>
        {gameStage === 'playing' && (
          <div className="mt-auto border-t bg-card/80 p-4 backdrop-blur-sm">
            <form onSubmit={handleGuessSubmit} className="flex items-center gap-2">
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder={t('faceOff.guessPlaceholder')}
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button type="submit" size="icon" className="shrink-0 bg-accent hover:bg-accent/90" disabled={isSubmitting || !userGuess}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(FaceOffPage);
```

---

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
}

@layer base {
  :root {
    --background: 140 80% 95%;
    --foreground: 140 10% 20%;
    --card: 140 80% 98%;
    --card-foreground: 140 10% 15%;
    --popover: 140 80% 98%;
    --popover-foreground: 140 10% 15%;
    --primary: 136 65% 40%;
    --primary-foreground: 140 20% 98%;
    --secondary: 140 30% 85%;
    --secondary-foreground: 140 10% 20%;
    --muted: 140 30% 90%;
    --muted-foreground: 140 10% 45%;
    --accent: 120 100% 30%;
    --accent-foreground: 120 20% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 140 30% 80%;
    --input: 140 30% 88%;
    --ring: 136 65% 40%;
    --chart-1: 136 65% 40%;
    --chart-2: 120 100% 30%;
    --chart-3: 136 40% 30%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 140 30% 10%;
    --foreground: 140 20% 90%;
    --card: 140 30% 15%;
    --card-foreground: 140 20% 90%;
    --popover: 140 30% 15%;
    --popover-foreground: 140 20% 90%;
    --primary: 136 75% 55%;
    --primary-foreground: 140 10% 10%;
    --secondary: 140 30% 25%;
    --secondary-foreground: 140 20% 90%;
    --muted: 140 30% 25%;
    --muted-foreground: 140 20% 60%;
    --accent: 120 100% 35%;
    --accent-foreground: 140 10% 10%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 140 30% 25%;
    --input: 140 30% 25%;
    --ring: 136 75% 55%;
    --chart-1: 136 75% 55%;
    --chart-2: 120 100% 35%;
    --chart-3: 136 50% 40%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }

  .theme-golden-goal {
    --background: 45 100% 95%;
    --foreground: 35 100% 15%;
    --card: 45 90% 98%;
    --card-foreground: 35 90% 10%;
    --popover: 45 90% 98%;
    --popover-foreground: 35 90% 10%;
    --primary: 40 85% 50%;
    --primary-foreground: 40 100% 98%;
    --secondary: 40 50% 85%;
    --secondary-foreground: 40 10% 20%;
    --muted: 40 50% 90%;
    --muted-foreground: 40 10% 45%;
    --accent: 35 95% 55%;
    --accent-foreground: 35 20% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 40 50% 80%;
    --input: 40 50% 88%;
    --ring: 40 85% 50%;
  }

  .dark.theme-golden-goal {
    --background: 35 50% 10%;
    --foreground: 45 50% 90%;
    --card: 35 50% 15%;
    --card-foreground: 45 50% 90%;
    --popover: 35 50% 15%;
    --popover-foreground: 45 50% 90%;
    --primary: 40 75% 60%;
    --primary-foreground: 35 10% 10%;
    --secondary: 35 50% 25%;
    --secondary-foreground: 45 50% 90%;
    --muted: 35 50% 25%;
    --muted-foreground: 45 50% 60%;
    --accent: 40 85% 55%;
    --accent-foreground: 35 10% 10%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 35 50% 25%;
    --input: 35 50% 25%;
    --ring: 40 75% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### `src/app/layout.tsx`

```tsx
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
```

---

### `src/app/leaderboard/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { withAuth } from '@/components/auth/with-auth';
import { cn } from '@/lib/utils';

type LeaderboardPlayer = PlayerStatistic & {
  rank: number;
  totalWins: number;
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
            {leaderboard.map((player) => (
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
                  <p className="font-bold">{player.displayName}</p>
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(LeaderboardPage);
```

---

### `src/app/login/page.tsx`

```tsx
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { useAuth, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a user document in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        creationTimestamp: serverTimestamp(),
      };
      
      setDoc(
        userRef,
        userData,
        { merge: true }
      ).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'write',
            requestResourceData: userData
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      router.replace('/');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setIsSigningIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <AppLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="font-headline text-3xl">{t('login.welcome')}</CardTitle>
          <CardDescription>
            {t('login.signInMessage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              // You might want to add a Google icon here
              t('login.signInButton')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### `src/app/page.tsx`

```tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { HelpCircle, List, Swords } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useLanguage();

  const gameModes = [
    {
      title: t('game.club-guessr.title'),
      description: t('game.club-guessr.description'),
      href: '/club-guessr',
      icon: <HelpCircle className="size-8 text-primary" />,
    },
    {
      title: t('game.stat-detective.title'),
      description: t('game.stat-detective.description'),
      href: '/stat-detective',
      icon: <List className="size-8 text-primary" />,
    },
    {
      title: t('game.face-off.title'),
      description: t('game.face-off.description'),
      href: '/face-off',
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
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          {t('app.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('app.description')}
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-6">
          {gameModes.map((mode) => (
            <Card
              key={mode.title}
              className="group transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
            >
              <Link href={mode.href} className="block h-full">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  {mode.icon}
                  <CardTitle className="font-headline text-2xl">
                    {mode.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mode.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>{t('home.footer')}</p>
      </footer>
    </div>
  );
}
```

---

### `src/app/profile/page.tsx`

```tsx
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
import { ArrowLeft, BarChart2, Award, Star, LogOut, Loader2, Settings, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '@/components/auth/with-auth';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

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
            <h2 className="font-headline text-2xl font-bold">{user?.displayName}</h2>
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
```

---

### `src/app/shop/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Palette, Star, CheckCircle2, ShoppingCart, User, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, useTheme } from '@/context/language-context';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, updateDoc, arrayUnion, increment, setDoc } from 'firebase/firestore';
import type { PlayerStatistic } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ShopItem = {
    id: string;
    name: string;
    price: number;
    icon: React.ElementType;
    type: 'theme' | 'avatar' | 'consumable';
    imageUrl?: string;
    imageHint?: string;
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

    const userQuery = useMemoFirebase(() => {
        if(!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const shopItems: ShopItem[] = [
        {
            id: 'theme-golden-goal',
            name: t('shop.theme.golden'),
            price: 1000,
            icon: Palette,
            type: 'theme',
        },
        {
            id: 'avatar-pixel-pro',
            name: t('shop.avatar.pixel'),
            price: 500,
            icon: User,
            type: 'avatar',
            imageUrl: PlaceHolderImages.find(i => i.id === 'avatar-1')?.imageUrl,
            imageHint: 'pixel art avatar'
        },
        {
            id: 'avatar-legend',
            name: t('shop.avatar.legend'),
            price: 750,
            icon: User,
            type: 'avatar',
            imageUrl: PlaceHolderImages.find(i => i.id === 'avatar-2')?.imageUrl,
            imageHint: 'legendary avatar'
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
        } else if (item.type === 'avatar') {
            updates.purchasedAvatars = arrayUnion(item.imageUrl);
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
        if (!user || !userQuery) return;

        if(item.type === 'theme') {
            setTheme(item.id);
        } else if (item.type === 'avatar' && item.imageUrl) {
            updateDoc(userQuery, {
                photoURL: item.imageUrl
            }).then(() => {
                 toast({
                    title: 'Profile picture updated!',
                });
            }).catch(async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: userQuery.path,
                    operation: 'update',
                    requestResourceData: { photoURL: item.imageUrl }
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
                                <Card key={item.id} className={cn("flex flex-col md:flex-row items-center justify-between p-4 gap-4", isEquipped && "border-primary")}>
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
                                            <Button disabled variant="outline" className="w-full md:w-auto">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {t('shop.equipped')}
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEquip(item)} className="w-full md:w-auto">
                                                {t('shop.equip')}
                                            </Button>
                                        )
                                    ) : (
                                        <Button 
                                            onClick={() => handlePurchase(item)} 
                                            disabled={isStatsLoading || (userStat?.coins || 0) < item.price}
                                            className="w-full md:w-auto"
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
                           <User className="h-6 w-6" /> {t('shop.avatars')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shopItems.filter(i => i.type === 'avatar').map((item) => {
                             const isPurchased = userStat?.purchasedAvatars?.includes(item.imageUrl!);
                             const isEquipped = user?.photoURL === item.imageUrl;

                             return(
                                <Card key={item.id} className={cn("flex flex-col items-center p-4 gap-4", isEquipped && "border-primary")}>
                                     <Image src={item.imageUrl!} alt={item.name} width={80} height={80} className="rounded-full border-4 border-muted" data-ai-hint={item.imageHint} />
                                     <div className="text-center">
                                        <p className="font-bold">{item.name}</p>
                                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span>{item.price}</span>
                                        </div>
                                    </div>
                                    
                                    {isPurchased ? (
                                        isEquipped ? (
                                            <Button disabled variant="outline" className="w-full">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {t('shop.equipped')}
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEquip(item)} className="w-full">
                                                {t('shop.equip')}
                                            </Button>
                                        )
                                    ) : (
                                        <Button 
                                            onClick={() => handlePurchase(item)} 
                                            disabled={isStatsLoading || (userStat?.coins || 0) < item.price}
                                            className="w-full"
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
                                <Card key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
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
                                        className="w-full md:w-auto"
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
```

---

### `src/app/stat-detective/page.tsx`

```tsx
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
import { useUser, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, increment, runTransaction, DocumentReference } from 'firebase/firestore';


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
    if (!footballer) return;
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
  const portraitImage = PlaceHolderImages.find(p => p.id === footballer?.portraitImageUrlId);

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
            disabled={isClueLoading || isGameOver}
          >
            {isClueLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {t('stat.getClue', { clueLevel })}
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
```

---

### `src/components/FirebaseErrorListener.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It throws any received error to be caught by Next.js's global-error.tsx.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render.
      setError(error);
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // On re-render, if an error exists in state, throw it.
  if (error) {
    throw error;
  }

  // This component renders nothing.
  return null;
}
```

---

### `src/components/auth/with-auth.tsx`

```tsx
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, type ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isUserLoading && !user) {
        router.replace('/login');
      }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
```

---

### `src/components/icons.tsx`

```tsx
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Pixel Soccer Showdown Logo</title>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M7 7h2v2H7z" fill="hsl(var(--primary-foreground))" stroke="none" />
      <path d="M15 7h2v2h-2z" fill="hsl(var(--primary-foreground))" stroke="none" />
      <path d="M11 14h2v2h-2z" fill="hsl(var(--primary-foreground))" stroke="none" />
      <path d="M7 11h10v2H7z" fill="hsl(var(--primary-foreground))" stroke="none" />
      <path d="m14 17 1-1" stroke="hsl(var(--accent))" strokeWidth="2.5" />
      <path d="m9 17-1-1" stroke="hsl(var(--accent))" strokeWidth="2.5" />
    </svg>
  );
}
```

---

### `src/components/layout/bottom-nav.tsx`

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, User, Store, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('bottomNav.home'), icon: Home },
    { href: '/leaderboard', label: t('bottomNav.leaderboard'), icon: Trophy },
    { href: '/shop', label: t('bottomNav.shop'), icon: Store },
    { href: '/profile', label: t('bottomNav.profile'), icon: User },
  ];

  return (
    <nav className="mt-auto border-t bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <item.icon
                className="size-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

### `src/components/layout/mobile-container.tsx`

```tsx
'use client';
import { useLanguage } from '@/context/language-context';
import { BottomNav } from './bottom-nav';

export function MobileContainer({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <div dir={language === 'uz' ? 'ltr' : 'ltr'} className="relative flex h-[844px] w-full max-w-[390px] flex-col overflow-hidden rounded-3xl border-8 border-gray-800 bg-card shadow-2xl dark:border-gray-900">
      <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-800 dark:bg-gray-900"></div>
      <div className="relative flex-1 overflow-y-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
```

---

### `src/components/ui/accordion.tsx`

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

---

### `src/components/ui/alert-dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

---

### `src/components/ui/alert.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

---

### `src/components/ui/avatar.tsx`

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

---

### `src/components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---

### `src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

### `src/components/ui/calendar.tsx`

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

---

### `src/components/ui/card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

### `src/components/ui/carousel.tsx`

```tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

---

### `src/components/ui/chart.tsx`

```tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

---

### `src/components/ui/checkbox.tsx`

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

---

### `src/components/ui/collapsible.tsx`

```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

---

### `src/components/ui/dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

---

### `src/components/ui/dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

---

### `src/components/ui/form.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

---

### `src/components/ui/input.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

---

### `src/components/ui/label.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

### `src/components/ui/menubar.tsx`

```tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

---

### `src/components/ui/popover.tsx`

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

---

### `src/components/ui/progress.tsx`

```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

---

### `src/components/ui/radio-group.tsx`

```tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

---

### `src/components/ui/scroll-area.tsx`

```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

---

### `src/components/ui/select.tsx`

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

---

### `src/components/ui/separator.tsx`

```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

---

### `src/components/ui/sheet.tsx`

```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

---

### `src/components/ui/skeleton.tsx`

```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

---

### `src/components/ui/slider.tsx`

```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

---

### `src/components/ui/switch.tsx`

```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

---

### `src/components/ui/table.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

---

### `src/components/ui/tabs.tsx`

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

---

### `src/components/ui/textarea.tsx`

```tsx
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
```

---

### `src/components/ui/toast.tsx`

```tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

---

### `src/components/ui/toaster.tsx`

```tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

---

### `src/components/ui/tooltip.tsx`

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

---

### `src/context/language-context.tsx`

```tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Translations } from '@/lib/data';

type Language = 'en' | 'ru' | 'uz';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: {[key: string]: string | number}) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz'); // Default to Uzbek
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'ru', 'uz'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setTheme = (themeName: string) => {
    // remove all theme classes
    document.documentElement.classList.remove('theme-golden-goal');

    if (themeName !== 'dark' && themeName !== 'light') {
        document.documentElement.classList.add(themeName);
    }
    setThemeState(themeName);
    localStorage.setItem('theme', themeName);
  }

  const t = (key: string, params?: {[key: string]: string | number}): string => {
    const langTranslations = translations[language] || translations.uz;
    let translation = langTranslations[key] || key;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }

    // Handle basic pluralization for attemptsLeft
    if (key === 'stat.attemptsLeft' && params && typeof params.attempts === 'number') {
        const count = params.attempts;
        if (language === 'ru') {
            if (count === 1) {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попытка');
            } else if (count > 1 && count < 5) {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попытки');
            } else {
                translation = translation.replace('{attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}', 'попыток');
            }
        } else { // English and Uzbek simple plural
             translation = translation.replace('{attempts, plural, one {attempt} other {attempts}}', count === 1 ? 'attempt' : 'attempts');
        }
    }


    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
```

---

### `src/firebase/client-provider.tsx`

```tsx
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
```

---

### `src/firebase/config.ts`

```ts
export const firebaseConfig = {
  "projectId": "studio-3972923309-b3295",
  "appId": "1:66666918760:web:753da1c7d54d5e5e905cdd",
  "apiKey": "AIzaSyCGDOEjfApQkHFTQ9fhwtAkI7o5yOGBYEk",
  "authDomain": "studio-3972923309-b3295.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "66666918760"
};
```

---

### `src/firebase/error-emitter.ts`

```ts
'use client';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Defines the shape of all possible events and their corresponding payload types.
 * This centralizes event definitions for type safety across the application.
 */
export interface AppEvents {
  'permission-error': FirestorePermissionError;
}

// A generic type for a callback function.
type Callback<T> = (data: T) => void;

/**
 * A strongly-typed pub/sub event emitter.
 * It uses a generic type T that extends a record of event names to payload types.
 */
function createEventEmitter<T extends Record<string, any>>() {
  // The events object stores arrays of callbacks, keyed by event name.
  // The types ensure that a callback for a specific event matches its payload type.
  const events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  return {
    /**
     * Subscribe to an event.
     * @param eventName The name of the event to subscribe to.
     * @param callback The function to call when the event is emitted.
     */
    on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName]?.push(callback);
    },

    /**
     * Unsubscribe from an event.
     * @param eventName The name of the event to unsubscribe from.
     * @param callback The specific callback to remove.
     */
    off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        return;
      }
      events[eventName] = events[eventName]?.filter(cb => cb !== callback);
    },

    /**
     * Publish an event to all subscribers.
     * @param eventName The name of the event to emit.
     * @param data The data payload that corresponds to the event's type.
     */
    emit<K extends keyof T>(eventName: K, data: T[K]) {
      if (!events[eventName]) {
        return;
      }
      events[eventName]?.forEach(callback => callback(data));
    },
  };
}

// Create and export a singleton instance of the emitter, typed with our AppEvents interface.
export const errorEmitter = createEventEmitter<AppEvents>();
```

---

### `src/firebase/errors.ts`

```ts
'use client';
import { getAuth, type User } from 'firebase/auth';

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface FirebaseAuthToken {
  name: string | null;
  email: string | null;
  email_verified: boolean;
  phone_number: string | null;
  sub: string;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
    tenant: string | null;
  };
}

interface FirebaseAuthObject {
  uid: string;
  token: FirebaseAuthToken;
}

interface SecurityRuleRequest {
  auth: FirebaseAuthObject | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */
function buildAuthObject(currentUser: User | null): FirebaseAuthObject | null {
  if (!currentUser) {
    return null;
  }

  const token: FirebaseAuthToken = {
    name: currentUser.displayName,
    email: currentUser.email,
    email_verified: currentUser.emailVerified,
    phone_number: currentUser.phoneNumber,
    sub: currentUser.uid,
    firebase: {
      identities: currentUser.providerData.reduce((acc, p) => {
        if (p.providerId) {
          acc[p.providerId] = [p.uid];
        }
        return acc;
      }, {} as Record<string, string[]>),
      sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
      tenant: currentUser.tenantId,
    },
  };

  return {
    uid: currentUser.uid,
    token: token,
  };
}

/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */
function buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest {
  let authObject: FirebaseAuthObject | null = null;
  try {
    // Safely attempt to get the current user.
    const firebaseAuth = getAuth();
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      authObject = buildAuthObject(currentUser);
    }
  } catch {
    // This will catch errors if the Firebase app is not yet initialized.
    // In this case, we'll proceed without auth information.
  }

  return {
    auth: authObject,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
  };
}

/**
 * Builds the final, formatted error message for the LLM.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message and the JSON payload.
 */
function buildErrorMessage(requestObject: SecurityRuleRequest): string {
  return `Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`;
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * It structures the error information to mimic the request object
 * available in Firestore Security Rules.
 */
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject = buildRequestObject(context);
    super(buildErrorMessage(requestObject));
    this.name = 'FirebaseError';
    this.request = requestObject;
  }
}
```

---

### `src/firebase/firestore/use-collection.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Directly use memoizedTargetRefOrQuery as it's assumed to be the final query
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        // This logic extracts the path from either a ref or a query
        const path: string =
          memoizedTargetRefOrQuery.type === 'collection'
            ? (memoizedTargetRefOrQuery as CollectionReference).path
            : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString()

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]); // Re-run if the target query/reference changes.
  
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    console.warn('The query passed to useCollection was not memoized with useMemoFirebase. This can lead to performance issues.', memoizedTargetRefOrQuery);
  }

  return { data, isLoading, error };
}
```

---

### `src/firebase/firestore/use-doc.tsx`

```tsx
'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Optional: setData(null); // Clear previous data instantly

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          // Document does not exist
          setData(null);
        }
        setError(null); // Clear any previous error on successful snapshot (even if doc doesn't exist)
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]); // Re-run if the memoizedDocRef changes.

  return { data, isLoading, error };
}
```

---

### `src/firebase/index.ts`

```ts
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
```

---

### `src/firebase/non-blocking-login.tsx`

```tsx
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
```

---

### `src/firebase/non-blocking-updates.tsx`

```tsx
'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      )
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
```

---

### `src/firebase/provider.tsx`

```tsx
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { // Auth state determined
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); // Cleanup
  }, [auth]); // Depends on the auth instance

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => { // Renamed from useAuthUser
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
```

---

### `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

### `src/lib/data.ts`

```ts
export type Stat = {
    label: 'Height' | 'Weight' | 'Career Goals' | 'Club';
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
};

export type PlayerStatistic = {
  id: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  clubGuessrGamesPlayed?: number;
  clubGuessrGamesWon?: number;
  statDetectiveGamesPlayed?: number;
  statDetectiveGamesWon?: number;
  footballerFaceoffGamesPlayed?: number;
  footballerFaceoffGamesWon?: number;
  coins?: number;
  purchasedThemes?: string[];
  purchasedAvatars?: string[];
  purchasedClues?: number;
  totalWins?: number;
};

export type UserProfile = {
  id: string;
  displayName: string;
  photoURL: string;
};


export type Footballer = {
  id: number;
  name: string;
  stats: {
    height: string;
    weight: string;
    careerGoals: number;
    club: string;
  };
  portraitImageUrlId: string;
};

export const footballers: Footballer[] = [
  { id: 1, name: 'Alex Johnson', stats: { height: '185cm', weight: '80kg', careerGoals: 250, club: 'FC Dynamos' }, portraitImageUrlId: 'portrait-1' },
  { id: 2, name: 'Ben Carter', stats: { height: '178cm', weight: '75kg', careerGoals: 180, club: 'United Strikers' }, portraitImageUrlId: 'portrait-2' },
  { id: 3, name: 'Chris Lee', stats: { height: '192cm', weight: '88kg', careerGoals: 95, club: 'Titans FC' }, portraitImageUrlId: 'portrait-3' },
  { id: 4, name: 'Lionel Messi', stats: { height: '170cm', weight: '72kg', careerGoals: 837, club: 'Inter Miami' }, portraitImageUrlId: 'portrait-4' },
  { id: 5, name: 'Cristiano Ronaldo', stats: { height: '187cm', weight: '83kg', careerGoals: 895, club: 'Al Nassr' }, portraitImageUrlId: 'portrait-5' },
  { id: 6, name: 'Neymar Jr', stats: { height: '175cm', weight: '68kg', careerGoals: 439, club: 'Al Hilal' }, portraitImageUrlId: 'portrait-6' },
  { id: 7, name: 'Kylian Mbappé', stats: { height: '178cm', weight: '73kg', careerGoals: 330, club: 'Real Madrid' }, portraitImageUrlId: 'portrait-7' },
  { id: 8, name: 'Mohamed Salah', stats: { height: '175cm', weight: '71kg', careerGoals: 357, club: 'Liverpool' }, portraitImageUrlId: 'portrait-8' },
  { id: 9, name: 'Zinedine Zidane', stats: { height: '185cm', weight: '80kg', careerGoals: 125, club: 'Retired' }, portraitImageUrlId: 'portrait-9' },
  { id: 10, name: 'Ronaldo Nazario', stats: { height: '183cm', weight: '90kg', careerGoals: 414, club: 'Retired' }, portraitImageUrlId: 'portrait-10' },
  { id: 11, name: 'Ronaldinho', stats: { height: '181cm', weight: '80kg', careerGoals: 313, club: 'Retired' }, portraitImageUrlId: 'portrait-11' },
  { id: 12, name: 'Pelé', stats: { height: '173cm', weight: '73kg', careerGoals: 767, club: 'Retired' }, portraitImageUrlId: 'portrait-12' },
  { id: 13, name: 'Diego Maradona', stats: { height: '165cm', weight: '70kg', careerGoals: 345, club: 'Retired' }, portraitImageUrlId: 'portrait-13' },
  { id: 14, name: 'Johan Cruyff', stats: { height: '180cm', weight: '75kg', careerGoals: 425, club: 'Retired' }, portraitImageUrlId: 'portrait-14' },
  { id: 15, name: 'Franz Beckenbauer', stats: { height: '181cm', weight: '76kg', careerGoals: 111, club: 'Retired' }, portraitImageUrlId: 'portrait-15' },
  { id: 16, name: 'Michel Platini', stats: { height: '179cm', weight: '73kg', careerGoals: 353, club: 'Retired' }, portraitImageUrlId: 'portrait-16' },
  { id: 17, name: 'Gerd Müller', stats: { height: '176cm', weight: '78kg', careerGoals: 735, club: 'Retired' }, portraitImageUrlId: 'portrait-17' },
  { id: 18, name: 'Alfredo Di Stéfano', stats: { height: '178cm', weight: '76kg', careerGoals: 510, club: 'Retired' }, portraitImageUrlId: 'portrait-18' },
  { id: 19, name: 'Ferenc Puskás', stats: { height: '172cm', weight: '75kg', careerGoals: 746, club: 'Retired' }, portraitImageUrlId: 'portrait-19' },
  { id: 20, name: 'Lev Yashin', stats: { height: '189cm', weight: '82kg', careerGoals: 0, club: 'Retired' }, portraitImageUrlId: 'portrait-20' },
  { id: 21, name: 'Eusébio', stats: { height: '175cm', weight: '73kg', careerGoals: 623, club: 'Retired' }, portraitImageUrlId: 'portrait-21' },
  { id: 22, name: 'George Best', stats: { height: '175cm', weight: '65kg', careerGoals: 257, club: 'Retired' }, portraitImageUrlId: 'portrait-22' },
  { id: 23, name: 'Bobby Charlton', stats: { height: '173cm', weight: '72kg', careerGoals: 309, club: 'Retired' }, portraitImageUrlId: 'portrait-23' },
  { id: 24, name: 'Paolo Maldini', stats: { height: '186cm', weight: '85kg', careerGoals: 33, club: 'Retired' }, portraitImageUrlId: 'portrait-24' },
  { id: 25, name: 'Franco Baresi', stats: { height: '176cm', weight: '70kg', careerGoals: 17, club: 'Retired' }, portraitImageUrlId: 'portrait-25' },
  { id: 26, name: 'Cafu', stats: { height: '176cm', weight: '75kg', careerGoals: 23, club: 'Retired' }, portraitImageUrlId: 'portrait-26' },
  { id: 27, name: 'Roberto Carlos', stats: { height: '168cm', weight: '70kg', careerGoals: 102, club: 'Retired' }, portraitImageUrlId: 'portrait-27' },
  { id: 28, name: 'Zlatan Ibrahimović', stats: { height: '195cm', weight: '95kg', careerGoals: 573, club: 'Retired' }, portraitImageUrlId: 'portrait-28' },
  { id: 29, name: 'Thierry Henry', stats: { height: '188cm', weight: '83kg', careerGoals: 411, club: 'Retired' }, portraitImageUrlId: 'portrait-29' },
  { id: 30, name: 'Dennis Bergkamp', stats: { height: '183cm', weight: '78kg', careerGoals: 303, club: 'Retired' }, portraitImageUrlId: 'portrait-30' },
  { id: 31, name: 'Patrick Vieira', stats: { height: '193cm', weight: '83kg', careerGoals: 57, club: 'Retired' }, portraitImageUrlId: 'portrait-31' },
  { id: 32, name: 'Roy Keane', stats: { height: '180cm', weight: '76kg', careerGoals: 76, club: 'Retired' }, portraitImageUrlId: 'portrait-32' },
  { id: 33, name: 'Paul Scholes', stats: { height: '168cm', weight: '70kg', careerGoals: 155, club: 'Retired' }, portraitImageUrlId: 'portrait-33' },
  { id: 34, name: 'Ryan Giggs', stats: { height: '179cm', weight: '71kg', careerGoals: 168, club: 'Retired' }, portraitImageUrlId: 'portrait-34' },
  { id: 35, name: 'David Beckham', stats: { height: '183cm', weight: '76kg', careerGoals: 146, club: 'Retired' }, portraitImageUrlId: 'portrait-35' },
  { id: 36, name: 'Steven Gerrard', stats: { height: '183cm', weight: '83kg', careerGoals: 212, club: 'Retired' }, portraitImageUrlId: 'portrait-36' },
  { id: 37, name: 'Frank Lampard', stats: { height: '184cm', weight: '89kg', careerGoals: 303, club: 'Retired' }, portraitImageUrlId: 'portrait-37' },
  { id: 38, name: 'John Terry', stats: { height: '187cm', weight: '90kg', careerGoals: 73, club: 'Retired' }, portraitImageUrlId: 'portrait-38' },
  { id: 39, name: 'Didier Drogba', stats: { height: '188cm', weight: '91kg', careerGoals: 368, club: 'Retired' }, portraitImageUrlId: 'portrait-39' },
  { id: 40, name: 'Andrés Iniesta', stats: { height: '171cm', weight: '68kg', careerGoals: 104, club: 'Emirates Club' }, portraitImageUrlId: 'portrait-40' },
  { id: 41, name: 'Xavi Hernandez', stats: { height: '170cm', weight: '68kg', careerGoals: 122, club: 'Retired' }, portraitImageUrlId: 'portrait-41' },
  { id: 42, name: 'Carles Puyol', stats: { height: '178cm', weight: '80kg', careerGoals: 24, club: 'Retired' }, portraitImageUrlId: 'portrait-42' },
  { id: 43, name: 'Sergio Busquets', stats: { height: '189cm', weight: '76kg', careerGoals: 20, club: 'Inter Miami' }, portraitImageUrlId: 'portrait-43' },
  { id: 44, name: 'Gerard Piqué', stats: { height: '194cm', weight: '85kg', careerGoals: 68, club: 'Retired' }, portraitImageUrlId: 'portrait-44' },
  { id: 45, name: 'Sergio Ramos', stats: { height: '184cm', weight: '82kg', careerGoals: 141, club: 'Sevilla' }, portraitImageUrlId: 'portrait-45' },
  { id: 46, name: 'Iker Casillas', stats: { height: '185cm', weight: '84kg', careerGoals: 0, club: 'Retired' }, portraitImageUrlId: 'portrait-46' },
  { id: 47, name: 'Manuel Neuer', stats: { height: '193cm', weight: '93kg', careerGoals: 0, club: 'Bayern Munich' }, portraitImageUrlId: 'portrait-47' },
  { id: 48, name: 'Gianluigi Buffon', stats: { height: '192cm', weight: '92kg', careerGoals: 0, club: 'Retired' }, portraitImageUrlId: 'portrait-48' },
  { id: 49, name: 'Oliver Kahn', stats: { height: '188cm', weight: '91kg', careerGoals: 0, club: 'Retired' }, portraitImageUrlId: 'portrait-49' },
  { id: 50, name: 'Peter Schmeichel', stats: { height: '193cm', weight: '92kg', careerGoals: 11, club: 'Retired' }, portraitImageUrlId: 'portrait-50' },
  { id: 51, name: 'Edwin van der Sar', stats: { height: '197cm', weight: '83kg', careerGoals: 1, club: 'Retired' }, portraitImageUrlId: 'portrait-51' },
  { id: 52, name: 'Petr Čech', stats: { height: '196cm', weight: '90kg', careerGoals: 0, club: 'Retired' }, portraitImageUrlId: 'portrait-52' },
  { id: 53, name: 'Fabio Cannavaro', stats: { height: '176cm', weight: '75kg', careerGoals: 16, club: 'Retired' }, portraitImageUrlId: 'portrait-53' },
  { id: 54, name: 'Alessandro Nesta', stats: { height: '187cm', weight: '79kg', careerGoals: 11, club: 'Retired' }, portraitImageUrlId: 'portrait-54' },
  { id: 55, name: 'Lilian Thuram', stats: { height: '185cm', weight: '80kg', careerGoals: 17, club: 'Retired' }, portraitImageUrlId: 'portrait-55' },
  { id: 56, name: 'Marcel Desailly', stats: { height: '185cm', weight: '88kg', careerGoals: 43, club: 'Retired' }, portraitImageUrlId: 'portrait-56' },
  { id: 57, name: 'Laurent Blanc', stats: { height: '192cm', weight: '82kg', careerGoals: 153, club: 'Retired' }, portraitImageUrlId: 'portrait-57' },
  { id: 58, name: 'Fernando Hierro', stats: { height: '187cm', weight: '84kg', careerGoals: 163, club: 'Retired' }, portraitImageUrlId: 'portrait-58' },
  { id: 59, name: 'Ruud Gullit', stats: { height: '191cm', weight: '88kg', careerGoals: 233, club: 'Retired' }, portraitImageUrlId: 'portrait-59' },
  { id: 60, name: 'Marco van Basten', stats: { height: '188cm', weight: '80kg', careerGoals: 301, club: 'Retired' }, portraitImageUrlId: 'portrait-60' },
  { id: 61, name: 'Frank Rijkaard', stats: { height: '190cm', weight: '85kg', careerGoals: 104, club: 'Retired' }, portraitImageUrlId: 'portrait-61' },
  { id: 62, name: 'Lothar Matthäus', stats: { height: '174cm', weight: '71kg', careerGoals: 227, club: 'Retired' }, portraitImageUrlId: 'portrait-62' },
  { id: 63, name: 'Jürgen Klinsmann', stats: { height: '181cm', weight: '77kg', careerGoals: 299, club: 'Retired' }, portraitImageUrlId: 'portrait-63' },
  { id: 64, name: 'Karl-Heinz Rummenigge', stats: { height: '182cm', weight: '79kg', careerGoals: 309, club: 'Retired' }, portraitImageUrlId: 'portrait-64' },
  { id: 65, name: 'Hristo Stoichkov', stats: { height: '178cm', weight: '76kg', careerGoals: 301, club: 'Retired' }, portraitImageUrlId: 'portrait-65' },
  { id: 66, name: 'Gheorghe Hagi', stats: { height: '174cm', weight: '72kg', careerGoals: 283, club: 'Retired' }, portraitImageUrlId: 'portrait-66' },
  { id: 67, name: 'Michael Laudrup', stats: { height: '183cm', weight: '78kg', careerGoals: 167, club: 'Retired' }, portraitImageUrlId: 'portrait-67' },
  { id: 68, name: 'Brian Laudrup', stats: { height: '186cm', weight: '80kg', careerGoals: 129, club: 'Retired' }, portraitImageUrlId: 'portrait-68' },
  { id: 69, name: 'Roberto Baggio', stats: { height: '174cm', weight: '73kg', careerGoals: 318, club: 'Retired' }, portraitImageUrlId: 'portrait-69' },
  { id: 70, name: 'Alessandro Del Piero', stats: { height: '174cm', weight: '73kg', careerGoals: 346, club: 'Retired' }, portraitImageUrlId: 'portrait-70' },
  { id: 71, name: 'Francesco Totti', stats: { height: '180cm', weight: '82kg', careerGoals: 307, club: 'Retired' }, portraitImageUrlId: 'portrait-71' },
  { id: 72, name: 'Gabriel Batistuta', stats: { height: '185cm', weight: '78kg', careerGoals: 356, club: 'Retired' }, portraitImageUrlId: 'portrait-72' },
  { id: 73, name: 'Hernán Crespo', stats: { height: '184cm', weight: '81kg', careerGoals: 323, club: 'Retired' }, portraitImageUrlId: 'portrait-73' },
  { id: 74, name: 'Pavel Nedvěd', stats: { height: '177cm', weight: '73kg', careerGoals: 178, club: 'Retired' }, portraitImageUrlId: 'portrait-74' },
  { id: 75, name: 'Andriy Shevchenko', stats: { height: '183cm', weight: '73kg', careerGoals: 373, club: 'Retired' }, portraitImageUrlId: 'portrait-75' },
  { id: 76, name: 'Kaká', stats: { height: '186cm', weight: '82kg', careerGoals: 237, club: 'Retired' }, portraitImageUrlId: 'portrait-76' },
  { id: 77, name: 'Luís Figo', stats: { height: '180cm', weight: '75kg', careerGoals: 176, club: 'Retired' }, portraitImageUrlId: 'portrait-77' },
  { id: 78, name: 'Rui Costa', stats: { height: '180cm', weight: '74kg', careerGoals: 110, club: 'Retired' }, portraitImageUrlId: 'portrait-78' },
  { id: 79, name: 'Deco', stats: { height: '174cm', weight: '73kg', careerGoals: 121, club: 'Retired' }, portraitImageUrlId: 'portrait-79' },
  { id: 80, name: 'Clarence Seedorf', stats: { height: '176cm', weight: '80kg', careerGoals: 172, club: 'Retired' }, portraitImageUrlId: 'portrait-80' },
  { id: 81, name: 'Edgar Davids', stats: { height: '169cm', weight: '68kg', careerGoals: 53, club: 'Retired' }, portraitImageUrlId: 'portrait-81' },
  { id: 82, name: 'Jaap Stam', stats: { height: '191cm', weight: '90kg', careerGoals: 19, club: 'Retired' }, portraitImageUrlId: 'portrait-82' },
  { id: 83, name: 'Raúl González', stats: { height: '180cm', weight: '68kg', careerGoals: 432, club: 'Retired' }, portraitImageUrlId: 'portrait-83' },
  { id: 84, name: 'Fernando Morientes', stats: { height: '186cm', weight: '79kg', careerGoals: 250, club: 'Retired' }, portraitImageUrlId: 'portrait-84' },
  { id: 85, name: 'Guti', stats: { height: '183cm', weight: '76kg', careerGoals: 99, club: 'Retired' }, portraitImageUrlId: 'portrait-85' },
  { id: 86, name: 'Míchel Salgado', stats: { height: '174cm', weight: '73kg', careerGoals: 10, club: 'Retired' }, portraitImageUrlId: 'portrait-86' },
  { id: 87, name: 'Christian Vieri', stats: { height: '185cm', weight: '82kg', careerGoals: 259, club: 'Retired' }, portraitImageUrlId: 'portrait-87' },
  { id: 88, name: 'Filippo Inzaghi', stats: { height: '181cm', weight: '74kg', careerGoals: 313, club: 'Retired' }, portraitImageUrlId: 'portrait-88' },
  { id: 89, name: 'David Trezeguet', stats: { height: '190cm', weight: '80kg', careerGoals: 308, club: 'Retired' }, portraitImageUrlId: 'portrait-89' },
  { id: 90, name: 'Michael Owen', stats: { height: '173cm', weight: '70kg', careerGoals: 262, club: 'Retired' }, portraitImageUrlId: 'portrait-90' },
  { id: 91, name: 'Alan Shearer', stats: { height: '183cm', weight: '82kg', careerGoals: 409, club: 'Retired' }, portraitImageUrlId: 'portrait-91' },
  { id: 92, name: 'Ian Wright', stats: { height: '175cm', weight: '73kg', careerGoals: 313, club: 'Retired' }, portraitImageUrlId: 'portrait-92' },
  { id: 93, name: 'Robbie Fowler', stats: { height: '175cm', weight: '73kg', careerGoals: 254, club: 'Retired' }, portraitImageUrlId: 'portrait-93' },
  { id: 94, name: 'Wayne Rooney', stats: { height: '176cm', weight: '83kg', careerGoals: 366, club: 'Retired' }, portraitImageUrlId: 'portrait-94' },
  { id: 95, name: 'Robin van Persie', stats: { height: '183cm', weight: '71kg', careerGoals: 322, club: 'Retired' }, portraitImageUrlId: 'portrait-95' },
  { id: 96, name: 'Ruud van Nistelrooy', stats: { height: '188cm', weight: '80kg', careerGoals: 382, club: 'Retired' }, portraitImageUrlId: 'portrait-96' },
  { id: 97, name: 'Arjen Robben', stats: { height: '180cm', weight: '80kg', careerGoals: 246, club: 'Retired' }, portraitImageUrlId: 'portrait-97' },
  { id: 98, name: 'Wesley Sneijder', stats: { height: '170cm', weight: '67kg', careerGoals: 186, club: 'Retired' }, portraitImageUrlId: 'portrait-98' },
  { id: 99, name: 'Andrea Pirlo', stats: { height: '177cm', weight: '68kg', careerGoals: 115, club: 'Retired' }, portraitImageUrlId: 'portrait-99' },
  { id: 100, name: 'Gennaro Gattuso', stats: { height: '177cm', weight: '77kg', careerGoals: 17, club: 'Retired' }, portraitImageUrlId: 'portrait-100' },
  { id: 101, name: 'Daniele De Rossi', stats: { height: '184cm', weight: '83kg', careerGoals: 87, club: 'Retired' }, portraitImageUrlId: 'portrait-101' },
  { id: 102, name: 'Miroslav Klose', stats: { height: '184cm', weight: '84kg', careerGoals: 332, club: 'Retired' }, portraitImageUrlId: 'portrait-102' },
  { id: 103, name: 'Lukas Podolski', stats: { height: '182cm', weight: '83kg', careerGoals: 323, club: 'Górnik Zabrze' }, portraitImageUrlId: 'portrait-103' },
  { id: 104, name: 'Bastian Schweinsteiger', stats: { height: '183cm', weight: '79kg', careerGoals: 109, club: 'Retired' }, portraitImageUrlId: 'portrait-104' },
  { id: 105, name: 'Philipp Lahm', stats: { height: '170cm', weight: '66kg', careerGoals: 25, club: 'Retired' }, portraitImageUrlId: 'portrait-105' },
  { id: 106, name: 'Thomas Müller', stats: { height: '185cm', weight: '76kg', careerGoals: 310, club: 'Bayern Munich' }, portraitImageUrlId: 'portrait-106' },
  { id: 107, name: 'Robert Lewandowski', stats: { height: '185cm', weight: '81kg', careerGoals: 650, club: 'Barcelona' }, portraitImageUrlId: 'portrait-107' },
  { id: 108, name: 'Erling Haaland', stats: { height: '194cm', weight: '88kg', careerGoals: 260, club: 'Manchester City' }, portraitImageUrlId: 'portrait-108' },
];

export const clubs = [
  "FC Dynamos", "United Strikers", "Titans FC", "Inter Miami", "Al Nassr", 
  "Al Hilal", "Real Madrid", "Liverpool", "Retired", "Emirates Club", 
  "Sevilla", "Bayern Munich", "Barcelona", "Manchester City", "Górnik Zabrze",
  "Manchester United", "Chelsea", "Arsenal", "AC Milan", "Inter Milan", "Juventus"
];


export function getRandomFootballer(excludeIds: number[] | number = []): Footballer {
  const excluded = Array.isArray(excludeIds) ? excludeIds : [excludeIds];
  const available = footballers.filter((f) => !excluded.includes(f.id));
  if (available.length === 0) return footballers[0];
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}


export type Translations = {
    [key: string]: string;
}

export const translations: {[lang: string]: Translations} = {
    en: {
        'app.title': 'Pixel Soccer Showdown',
        'app.description': 'Choose your challenge and prove you\'re the ultimate fan!',
        'game.club-guessr.title': 'Club Guessr',
        'game.club-guessr.description': 'Guess the player\'s current or most famous club.',
        'game.stat-detective.title': 'Stat Detective',
        'game.stat-detective.description': 'Identify the footballer by their stats.',
        'game.face-off.title': 'Footballer Face-off',
        'game.face-off.description': 'Challenge others in a 1v1 showdown.',
        'home.footer': 'Ready to climb the ranks?',
        'login.welcome': 'Welcome Back!',
        'login.signInMessage': 'Sign in to continue your soccer journey.',
        'login.signInButton': 'Sign In with Google',
        'profile.title': 'Your Profile',
        'profile.joined': 'Joined',
        'profile.totalWins': 'Total Wins',
        'profile.winRate': 'Win Rate',
        'profile.coins': 'Coins',
        'profile.performance': 'Performance',
        'profile.winsPerGame': 'Your wins per game mode',
        'profile.signOut': 'Sign Out',
        'profile.settings': 'Settings',
        'profile.language': 'Language',
        'profile.purchasedClues': 'Clues',
        'bottomNav.home': 'Home',
        'bottomNav.faceOff': 'Face-off',
        'bottomNav.profile': 'Profile',
        'bottomNav.shop': 'Shop',
        'bottomNav.leaderboard': 'Leaderboard',
        'faceOff.title': 'Footballer Face-off',
        'faceOff.vs': 'VS',
        'faceOff.score': 'Score',
        'faceOff.whoIsThis': 'Who is this?',
        'faceOff.guessPlaceholder': 'Type your guess...',
        'faceOff.matchStarting': 'Finding opponent... Match will begin shortly!',
        'faceOff.pointYou': 'Point for you!',
        'faceOff.pointRival': 'Point for the rival!',
        'faceOff.pointBoth': 'You both got it!',
        'faceOff.draw': 'It\'s a Draw!',
        'faceOff.wins': 'wins',
        'faceOff.finalScore': 'Final Score',
        'clubGuessr.title': 'Club Guessr',
        'clubGuessr.guessPlaceholder': 'Who is this?',
        'clubGuessr.submitGuess': 'Submit Guess',
        'clubGuessr.correctToast.title': 'Correct!',
        'clubGuessr.correctToast.description': 'You guessed {playerName}!',
        'clubGuessr.coinsAdded': '+10 Coins!',
        'clubGuessr.incorrectToast.title': 'Incorrect!',
        'clubGuessr.incorrectToast.description': 'That\'s not the right club. Try again!',
        'clubGuessr.youGotIt': 'You got it!',
        'clubGuessr.niceTry': 'Nice try!',
        'clubGuessr.playerWas': 'The player was {playerName}',
        'clubGuessr.nextPlayer': 'Next Player',
        'clubGuessr.getClue': 'Get a Clue (Reveal Stat)',
        'clue.smartClue': 'Smart Clue',
        'stat.title': 'Stat Detective',
        'stat.attemptsLeft': 'You have {attemptsLeft} {attempts, plural, one {attempt} other {attempts}} left.',
        'stat.whoAmI': 'Who Am I?',
        'stat.guessPlaceholder': 'Enter player\'s name',
        'stat.submitGuess': 'Submit Guess',
        'stat.correctToast.title': 'Correct!',
        'stat.correctToast.description': 'You guessed {playerName}!',
        'stat.coinsAdded': '+10 Coins!',
        'stat.incorrectToast.title': 'Incorrect!',
        'stat.incorrectToast.description': 'That\'s not the right player. Try again!',
        'stat.gameOver': 'Game Over!',
        'stat.youGotIt': 'You got it!',
        'stat.playerWas': 'The player was {playerName}',
        'stat.playAgain': 'Play Again',
        'stat.yourGuesses': 'Your Guesses',
        'stat.getClue': 'Get a Clue (Level {clueLevel})',
        'stat.height': 'Height',
        'stat.weight': 'Weight',
        'stat.club': 'Club',
        'stat.careerGoals': 'Career Goals',
        'lang.en': 'English',
        'lang.ru': 'Russian',
        'lang.uz': 'Uzbek',
        'shop.title': 'Shop',
        'shop.themes': 'Themes',
        'shop.avatars': 'Profile Pictures',
        'shop.consumables': 'Consumables',
        'shop.cluePack': 'Clue Pack (5 Clues)',
        'shop.avatar.pixel': 'Pixelated Pro',
        'shop.avatar.legend': 'Golden Legend',
        'shop.avatar.classic': 'Classic Kit',
        'shop.theme.golden': 'Golden Goal Theme',
        'shop.buy': 'Buy',
        'shop.equip': 'Equip',
        'shop.equipped': 'Equipped',
        'shop.insufficientCoins': 'Insufficient coins!',
        'shop.purchaseSuccess': 'Purchase successful!',
        'leaderboard.title': 'Leaderboard',
        'leaderboard.rank': 'Rank',
        'leaderboard.player': 'Player',
        'leaderboard.wins': 'Wins',
        'leaderboard.coins': 'Coins',
        'leaderboard.totalWins': 'Total Wins',
        'leaderboard.loading': 'Loading top players...',
        'leaderboard.noPlayers': 'No players on the leaderboard yet. Be the first!',
    },
    ru: {
        'app.title': 'Пиксельный Футбольный Поединок',
        'app.description': 'Выберите испытание и докажите, что вы лучший фанат!',
        'game.club-guessr.title': 'Угадай клуб',
        'game.club-guessr.description': 'Угадайте текущий или самый известный клуб игрока.',
        'game.stat-detective.title': 'Статистический детектив',
        'game.stat-detective.description': 'Определите футболиста по его статистике.',
        'game.face-off.title': 'Футбольный поединок',
        'game.face-off.description': 'Соревнуйтесь с другими в поединке 1 на 1.',
        'home.footer': 'Готовы подняться в рейтинге?',
        'login.welcome': 'С возвращением!',
        'login.signInMessage': 'Войдите, чтобы продолжить свой футбольный путь.',
        'login.signInButton': 'Войти через Google',
        'profile.title': 'Ваш профиль',
        'profile.joined': 'Присоединился',
        'profile.totalWins': 'Всего побед',
        'profile.winRate': 'Процент побед',
        'profile.coins': 'Монеты',
        'profile.performance': 'Производительность',
        'profile.winsPerGame': 'Ваши победы в каждом режиме игры',
        'profile.signOut': 'Выйти',
        'profile.settings': 'Настройки',
        'profile.language': 'Язык',
        'profile.purchasedClues': 'Подсказки',
        'bottomNav.home': 'Главная',
        'bottomNav.faceOff': 'Поединок',
        'bottomNav.profile': 'Профиль',
        'bottomNav.shop': 'Магазин',
        'bottomNav.leaderboard': 'Рейтинг',
        'faceOff.title': 'Футбольный поединок',
        'faceOff.vs': 'ПРОТИВ',
        'faceOff.score': 'Счет',
        'faceOff.whoIsThis': 'Кто это?',
        'faceOff.guessPlaceholder': 'Введите вашу догадку...',
        'faceOff.matchStarting': 'Поиск соперника... Матч скоро начнется!',
        'faceOff.pointYou': 'Очко вам!',
        'faceOff.pointRival': 'Очко сопернику!',
        'faceOff.pointBoth': 'Вы оба угадали!',
        'faceOff.draw': 'Ничья!',
        'faceOff.wins': 'победил',
        'faceOff.finalScore': 'Итоговый счет',
        'clubGuessr.title': 'Угадай клуб',
        'clubGuessr.guessPlaceholder': 'Кто это?',
        'clubGuessr.submitGuess': 'Отправить догадку',
        'clubGuessr.correctToast.title': 'Правильно!',
        'clubGuessr.correctToast.description': 'Вы угадали {playerName}!',
        'clubGuessr.coinsAdded': '+10 Монет!',
        'clubGuessr.incorrectToast.title': 'Неправильно!',
        'clubGuessr.incorrectToast.description': 'Это не тот клуб. Попробуйте еще раз!',
        'clubGuessr.youGotIt': 'Вы угадали!',
        'clubGuessr.niceTry': 'Хорошая попытка!',
        'clubGuessr.playerWas': 'Игроком был {playerName}',
        'clubGuessr.nextPlayer': 'Следующий игрок',
        'clubGuessr.getClue': 'Получить подсказку (раскрыть стату)',
        'clue.smartClue': 'Умная подсказка',
        'stat.title': 'Статистический детектив',
        'stat.attemptsLeft': 'У вас осталось {attemptsLeft} {attempts, plural, one {попытка} few {попытки} many {попыток} other {попытки}}.',
        'stat.whoAmI': 'Кто я?',
        'stat.guessPlaceholder': 'Введите имя игрока',
        'stat.submitGuess': 'Отправить догадку',
        'stat.correctToast.title': 'Правильно!',
        'stat.correctToast.description': 'Вы угадали {playerName}!',
        'stat.coinsAdded': '+10 Монет!',
        'stat.incorrectToast.title': 'Неправильно!',
        'stat.incorrectToast.description': 'Это не тот игрок. Попробуйте еще раз!',
        'stat.gameOver': 'Игра окончена!',
        'stat.youGotIt': 'Вы угадали!',
        'stat.playerWas': 'Игроком был {playerName}',
        'stat.playAgain': 'Играть снова',
        'stat.yourGuesses': 'Ваши догадки',
        'stat.getClue': 'Получить подсказку (уровень {clueLevel})',
        'stat.height': 'Рост',
        'stat.weight': 'Вес',
        'stat.club': 'Клуб',
        'stat.careerGoals': 'Голы за карьеру',
        'lang.en': 'Английский',
        'lang.ru': 'Русский',
        'lang.uz': 'Узбекский',
        'shop.title': 'Магазин',
        'shop.themes': 'Темы',
        'shop.avatars': 'Изображения профиля',
        'shop.consumables': 'Расходные материалы',
        'shop.cluePack': 'Набор подсказок (5 шт.)',
        'shop.avatar.pixel': 'Пиксельный профи',
        'shop.avatar.legend': 'Золотая легенда',
        'shop.avatar.classic': 'Классический комплект',
        'shop.theme.golden': 'Тема "Золотой гол"',
        'shop.buy': 'Купить',
        'shop.equip': 'Применить',
        'shop.equipped': 'Применено',
        'shop.insufficientCoins': 'Недостаточно монет!',
        'shop.purchaseSuccess': 'Покупка совершена успешно!',
        'leaderboard.title': 'Рейтинг',
        'leaderboard.rank': 'Ранг',
        'leaderboard.player': 'Игрок',
        'leaderboard.wins': 'Победы',
        'leaderboard.coins': 'Монеты',
        'leaderboard.totalWins': 'Всего побед',
        'leaderboard.loading': 'Загрузка лучших игроков...',
        'leaderboard.noPlayers': 'В рейтинге пока нет игроков. Будьте первым!',
    },
    uz: {
        'app.title': 'Piksel Futbol To\'qnashuvi',
        'app.description': 'O\'z chaqirig\'ingizni tanlang va eng zo\'r muxlis ekanligingizni isbotlang!',
        'game.club-guessr.title': 'Klubni Top',
        'game.club-guessr.description': 'O\'yinchining hozirgi yoki eng mashhur klubini toping.',
        'game.stat-detective.title': 'Statistik Detektiv',
        'game.stat-detective.description': 'Futbolchini statistik ma\'lumotlariga qarab aniqlang.',
        'game.face-off.title': 'Futbolchilar Janggi',
        'game.face-off.description': 'Boshqalar bilan 1v1 bahsda kuch sinashing.',
        'home.footer': 'Reytingda ko\'tarilishga tayyormisiz?',
        'login.welcome': 'Xush kelibsiz!',
        'login.signInMessage': 'Futbol sayohatingizni davom ettirish uchun tizimga kiring.',
        'login.signInButton': 'Google orqali kirish',
        'profile.title': 'Sizning profilingiz',
        'profile.joined': 'Qo\'shildi',
        'profile.totalWins': 'Jami g\'alabalar',
        'profile.winRate': 'G\'alaba darajasi',
        'profile.coins': 'Tangalar',
        'profile.performance': 'Natijadorlik',
        'profile.winsPerGame': 'Har bir o\'yin rejimidagi g\'alabalaringiz',
        'profile.signOut': 'Chiqish',
        'profile.settings': 'Sozlamalar',
        'profile.language': 'Til',
        'profile.purchasedClues': 'Maslahatlar',
        'bottomNav.home': 'Bosh sahifa',
        'bottomNav.faceOff': 'Jang',
        'bottomNav.profile': 'Profil',
        'bottomNav.shop': 'Do\'kon',
        'bottomNav.leaderboard': 'Reyting',
        'faceOff.title': 'Futbolchilar Janggi',
        'faceOff.vs': 'VS',
        'faceOff.score': 'Hisob',
        'faceOff.whoIsThis': 'Bu kim?',
        'faceOff.guessPlaceholder': 'Taxminingizni yozing...',
        'faceOff.matchStarting': 'Raqib qidirilmoqda... O\'yin tez orada boshlanadi!',
        'faceOff.pointYou': 'Ochko sizga!',
        'faceOff.pointRival': 'Ochko raqibga!',
        'faceOff.pointBoth': 'Ikkalangiz ham topdingiz!',
        'faceOff.draw': 'Durrang!',
        'faceOff.wins': 'g\'alaba qozondi',
        'faceOff.finalScore': 'Yakuniy hisob',
        'clubGuessr.title': 'Klubni Top',
        'clubGuessr.guessPlaceholder': 'Bu kim?',
        'clubGuessr.submitGuess': 'Taxminni yuborish',
        'clubGuessr.correctToast.title': 'To\'g\'ri!',
        'clubGuessr.correctToast.description': 'Siz {playerName}ni topdingiz!',
        'clubGuessr.coinsAdded': '+10 Tanga!',
        'clubGuessr.incorrectToast.title': 'Noto\'g\'ri!',
        'clubGuessr.incorrectToast.description': 'Bu klub emas. Yana bir bor urinib ko\'ring!',
        'clubGuessr.youGotIt': 'Siz topdingiz!',
        'clubGuessr.niceTry': 'Yaxshi urinish!',
        'clubGuessr.playerWas': 'Futbolchi {playerName} edi',
        'clubGuessr.nextPlayer': 'Keyingi futbolchi',
        'clubGuessr.getClue': 'Yordam olish (Statistikani ochish)',
        'clue.smartClue': 'Aqlli yordam',
        'stat.title': 'Statistik Detektiv',
        'stat.attemptsLeft': 'Sizda {attemptsLeft} ta urinish qoldi.',
        'stat.whoAmI': 'Men kimman?',
        'stat.guessPlaceholder': 'Futbolchi nomini kiriting',
        'stat.submitGuess': 'Taxminni yuborish',
        'stat.correctToast.title': 'To\'g\'ri!',
        'stat.correctToast.description': 'Siz {playerName}ni topdingiz!',
        'stat.coinsAdded': '+10 Tanga!',
        'stat.incorrectToast.title': 'Noto\'g\'ri!',
        'stat.incorrectToast.description': 'Bu boshqa futbolchi. Yana bir bor urinib ko\'ring!',
        'stat.gameOver': 'O\'yin tugadi!',
        'stat.youGotIt': 'Siz topdingiz!',
        'stat.playerWas': 'Futbolchi {playerName} edi',
        'stat.playAgain': 'Qayta o\'ynash',
        'stat.yourGuesses': 'Sizning taxminlaringiz',
        'stat.getClue': 'Yordam olish (Daraja {clueLevel})',
        'stat.height': 'Bo\'yi',
        'stat.weight': 'Vazni',
        'stat.club': 'Klub',
        'stat.careerGoals': 'Karyerasidagi gollar',
        'lang.en': 'Inglizcha',
        'lang.ru': 'Ruscha',
        'lang.uz': 'O\'zbekcha',
        'shop.title': 'Do\'kon',
        'shop.themes': 'Mavzular',
        'shop.avatars': 'Profil Rasmlari',
        'shop.consumables': 'Sarf materiallari',
        'shop.cluePack': 'Maslahatlar to\'plami (5 ta)',
        'shop.avatar.pixel': 'Piksel Pro',
        'shop.avatar.legend': 'Oltin Afsona',
        'shop.avatar.classic': 'Klassik Forma',
        'shop.theme.golden': '"Oltin To\'p" mavzusi',
        'shop.buy': 'Sotib olish',
        'shop.equip': 'Qo\'llash',
        'shop.equipped': 'Qo\'llanilgan',
        'shop.insufficientCoins': 'Tangalar yetarli emas!',
        'shop.purchaseSuccess': 'Muvaffaqiyatli xarid qilindi!',
        'leaderboard.title': 'Reyting',
        'leaderboard.rank': 'O\'rin',
        'leaderboard.player': 'O\'yinchi',
        'leaderboard.wins': 'G\'alabalar',
        'leaderboard.coins': 'Tangalar',
        'leaderboard.totalWins': 'Jami G\'alabalar',
        'leaderboard.loading': 'Eng yaxshi o\'yinchilar yuklanmoqda...',
        'leaderboard.noPlayers': 'Hozircha reytingda o\'yinchilar yo\'q. Birinchi bo\'ling!',
    },
};
```

---

### `src/lib/placeholder-images.json`

```json
{
  "placeholderImages": [
    {
      "id": "portrait-1",
      "description": "Portrait of Alex Johnson",
      "imageUrl": "https://images.unsplash.com/photo-1598550872633-b4a350e090f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmb290YmFsbGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzE5NDMyOTg3fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "imageHint": "footballer portrait"
    },
    {
      "id": "portrait-2",
      "description": "Portrait of Ben Carter",
      "imageUrl": "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdHxlbnwwfHx8fDE3MTk0MzMwMTJ8MA&ixlib=rb-4.0.3&q=80&w=1080",
      "imageHint": "footballer portrait"
    },
    {
      "id": "portrait-3",
      "description": "Portrait of Chris Lee",
      "imageUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwb3J0cmFpdCUyMG1hbGV8ZW58MHx8fHwxNzE5NDMzMDI4fDA&ixlib=rb-4.0.3&q=80&w=1080",
      "imageHint": "footballer portrait"
    },
    {
      "id": "portrait-4",
      "description": "Portrait of Lionel Messi",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
      "imageHint": "messi portrait"
    },
    {
      "id": "portrait-5",
      "description": "Portrait of Cristiano Ronaldo",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_in_2023.jpg",
      "imageHint": "ronaldo portrait"
    },
    {
      "id": "portrait-6",
      "description": "Portrait of Neymar Jr",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Neymar_Jr._with_Al_Hilal_in_2023.jpg",
      "imageHint": "neymar portrait"
    },
    {
      "id": "portrait-7",
      "description": "Portrait of Kylian Mbappé",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/57/2023-03-24_UEFA_Euro_2024_Qualifying_Round_Group_B%2C_France_vs._Netherlands_-_Kylian_Mbapp%C3%A9_-_21.jpg",
      "imageHint": "mbappe portrait"
    },
    {
      "id": "portrait-8",
      "description": "Portrait of Mohamed Salah",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2023.jpg",
      "imageHint": "salah portrait"
    },
    {
      "id": "portrait-9",
      "description": "Portrait of Zinedine Zidane",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg",
      "imageHint": "zidane portrait"
    },
    {
      "id": "portrait-10",
      "description": "Portrait of Ronaldo Nazario",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/82/Ronaldo_in_2018.jpg",
      "imageHint": "ronaldo nazario"
    },
    {
      "id": "portrait-11",
      "description": "Portrait of Ronaldinho",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Ronaldinho_13_November_2018.jpg",
      "imageHint": "ronaldinho portrait"
    },
    {
      "id": "portrait-12",
      "description": "Portrait of Pelé",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pel%C3%A9_in_New_York_in_1976.jpg",
      "imageHint": "pele portrait"
    },
    {
      "id": "portrait-13",
      "description": "Portrait of Diego Maradona",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Maradona-Mundial_86_con_la_copa.jpg",
      "imageHint": "maradona portrait"
    },
    {
      "id": "portrait-14",
      "description": "Portrait of Johan Cruyff",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Johan_Cruijff_1974c.jpg",
      "imageHint": "cruyff portrait"
    },
    {
      "id": "portrait-15",
      "description": "Portrait of Franz Beckenbauer",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Franz_Beckenbauer_1973_original.jpg",
      "imageHint": "beckenbauer portrait"
    },
    {
      "id": "portrait-16",
      "description": "Portrait of Michel Platini",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/da/Platini_EURO_1984.jpg",
      "imageHint": "platini portrait"
    },
    {
      "id": "portrait-17",
      "description": "Portrait of Gerd Müller",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Gerd_M%C3%BCller_1970s.jpg",
      "imageHint": "muller portrait"
    },
    {
      "id": "portrait-18",
      "description": "Portrait of Alfredo Di Stéfano",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/06/Alfredo_di_St%C3%A9fano_-_1962.jpg",
      "imageHint": "stefano portrait"
    },
    {
      "id": "portrait-19",
      "description": "Portrait of Ferenc Puskás",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Puskas_Ferenc_1953.jpg",
      "imageHint": "puskas portrait"
    },
    {
      "id": "portrait-20",
      "description": "Portrait of Lev Yashin",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/Lev_Yashin_in_1963.jpg",
      "imageHint": "yashin portrait"
    },
    {
      "id": "portrait-21",
      "description": "Portrait of Eusébio",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/35/Eus%C3%A9bio_Benfica_1968.jpg",
      "imageHint": "eusebio portrait"
    },
    {
      "id": "portrait-22",
      "description": "Portrait of George Best",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9c/George_Best_in_1973.jpg",
      "imageHint": "best portrait"
    },
    {
      "id": "portrait-23",
      "description": "Portrait of Bobby Charlton",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Bobby_Charlton_in_1965.jpg",
      "imageHint": "charlton portrait"
    },
    {
      "id": "portrait-24",
      "description": "Portrait of Paolo Maldini",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Paolo_Maldini_2005.jpg",
      "imageHint": "maldini portrait"
    },
    {
      "id": "portrait-25",
      "description": "Portrait of Franco Baresi",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/73/Franco_Baresi_1990.jpg",
      "imageHint": "baresi portrait"
    },
    {
      "id": "portrait-26",
      "description": "Portrait of Cafu",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/2002_FIFA_World_Cup_Final_Line-up_of_Brazil.jpg",
      "imageHint": "cafu worldcup"
    },
    {
      "id": "portrait-27",
      "description": "Portrait of Roberto Carlos",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Roberto_Carlos_2017.jpg",
      "imageHint": "roberto carlos"
    },
    {
      "id": "portrait-28",
      "description": "Portrait of Zlatan Ibrahimović",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/Zlatan_Ibrahimovi%C4%87_in_2018.jpg",
      "imageHint": "zlatan portrait"
    },
    {
      "id": "portrait-29",
      "description": "Portrait of Thierry Henry",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Thierry_Henry_2007.jpg",
      "imageHint": "henry portrait"
    },
    {
      "id": "portrait-30",
      "description": "Portrait of Dennis Bergkamp",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Dennis_Bergkamp_1998.jpg",
      "imageHint": "bergkamp portrait"
    },
    {
      "id": "portrait-31",
      "description": "Portrait of Patrick Vieira",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Patrick_Vieira_at_the_2018_FIFA_World_Cup.jpg",
      "imageHint": "vieira portrait"
    },
    {
      "id": "portrait-32",
      "description": "Portrait of Roy Keane",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Roy_Keane_2005.jpg",
      "imageHint": "keane portrait"
    },
    {
      "id": "portrait-33",
      "description": "Portrait of Paul Scholes",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Paul_Scholes_2013.jpg",
      "imageHint": "scholes portrait"
    },
    {
      "id": "portrait-34",
      "description": "Portrait of Ryan Giggs",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Ryan_Giggs_at_Soccer_Aid_2012.jpg",
      "imageHint": "giggs portrait"
    },
    {
      "id": "portrait-35",
      "description": "Portrait of David Beckham",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/David_Beckham_2007.jpg",
      "imageHint": "beckham portrait"
    },
    {
      "id": "portrait-36",
      "description": "Portrait of Steven Gerrard",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Steven_Gerrard_2008.jpg",
      "imageHint": "gerrard portrait"
    },
    {
      "id": "portrait-37",
      "description": "Portrait of Frank Lampard",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Frank_Lampard_2009.jpg",
      "imageHint": "lampard portrait"
    },
    {
      "id": "portrait-38",
      "description": "Portrait of John Terry",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/John_Terry_2011.jpg",
      "imageHint": "terry portrait"
    },
    {
      "id": "portrait-39",
      "description": "Portrait of Didier Drogba",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Didier_Drogba_2010.jpg",
      "imageHint": "drogba portrait"
    },
    {
      "id": "portrait-40",
      "description": "Portrait of Andrés Iniesta",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Andr%C3%A9s_Iniesta_2017.jpg",
      "imageHint": "iniesta portrait"
    },
    {
      "id": "portrait-41",
      "description": "Portrait of Xavi Hernandez",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Xavi_at_the_2018_FIFA_World_Cup.jpg",
      "imageHint": "xavi portrait"
    },
    {
      "id": "portrait-42",
      "description": "Portrait of Carles Puyol",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Carles_Puyol_2010.jpg",
      "imageHint": "puyol portrait"
    },
    {
      "id": "portrait-43",
      "description": "Portrait of Sergio Busquets",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Sergio_Busquets_2019.jpg",
      "imageHint": "busquets portrait"
    },
    {
      "id": "portrait-44",
      "description": "Portrait of Gerard Piqué",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Gerard_Piqu%C3%A9_2018.jpg",
      "imageHint": "pique portrait"
    },
    {
      "id": "portrait-45",
      "description": "Portrait of Sergio Ramos",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Sergio_Ramos_2018.jpg",
      "imageHint": "ramos portrait"
    },
    {
      "id": "portrait-46",
      "description": "Portrait of Iker Casillas",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Iker_Casillas_2017.jpg",
      "imageHint": "casillas portrait"
    },
    {
      "id": "portrait-47",
      "description": "Portrait of Manuel Neuer",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/Manuel_Neuer_2018.jpg",
      "imageHint": "neuer portrait"
    },
    {
      "id": "portrait-48",
      "description": "Portrait of Gianluigi Buffon",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Gianluigi_Buffon_2018.jpg",
      "imageHint": "buffon portrait"
    },
    {
      "id": "portrait-49",
      "description": "Portrait of Oliver Kahn",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Oliver_Kahn_2017.jpg",
      "imageHint": "kahn portrait"
    },
    {
      "id": "portrait-50",
      "description": "Portrait of Peter Schmeichel",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/99/Peter_Schmeichel_2008.jpg",
      "imageHint": "schmeichel portrait"
    },
    {
      "id": "portrait-51",
      "description": "Portrait of Edwin van der Sar",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Edwin_van_der_Sar_2011.jpg",
      "imageHint": "sar portrait"
    },
    {
      "id": "portrait-52",
      "description": "Portrait of Petr Čech",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Petr_%C4%8Cech_2018.jpg",
      "imageHint": "cech portrait"
    },
    {
      "id": "portrait-53",
      "description": "Portrait of Fabio Cannavaro",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Fabio_Cannavaro_2010.jpg",
      "imageHint": "cannavaro portrait"
    },
    {
      "id": "portrait-54",
      "description": "Portrait of Alessandro Nesta",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Alessandro_Nesta_2007.jpg",
      "imageHint": "nesta portrait"
    },
    {
      "id": "portrait-55",
      "description": "Portrait of Lilian Thuram",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Lilian_Thuram_2006.jpg",
      "imageHint": "thuram portrait"
    },
    {
      "id": "portrait-56",
      "description": "Portrait of Marcel Desailly",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Marcel_Desailly_2008.jpg",
      "imageHint": "desailly portrait"
    },
    {
      "id": "portrait-57",
      "description": "Portrait of Laurent Blanc",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Laurent_Blanc_2012.jpg",
      "imageHint": "blanc portrait"
    },
    {
      "id": "portrait-58",
      "description": "Portrait of Fernando Hierro",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Fernando_Hierro_2018.jpg",
      "imageHint": "hierro portrait"
    },
    {
      "id": "portrait-59",
      "description": "Portrait of Ruud Gullit",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ruud_Gullit_2011.jpg",
      "imageHint": "gullit portrait"
    },
    {
      "id": "portrait-60",
      "description": "Portrait of Marco van Basten",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Marco_van_Basten_1988.jpg",
      "imageHint": "basten portrait"
    },
    {
      "id": "portrait-61",
      "description": "Portrait of Frank Rijkaard",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Frank_Rijkaard_2006.jpg",
      "imageHint": "rijkaard portrait"
    },
    {
      "id": "portrait-62",
      "description": "Portrait of Lothar Matthäus",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Lothar_Matth%C3%A4us_2018.jpg",
      "imageHint": "matthaus portrait"
    },
    {
      "id": "portrait-63",
      "description": "Portrait of Jürgen Klinsmann",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/J%C3%BCrgen_Klinsmann_2018.jpg",
      "imageHint": "klinsmann portrait"
    },
    {
      "id": "portrait-64",
      "description": "Portrait of Karl-Heinz Rummenigge",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Karl-Heinz_Rummenigge_2018.jpg",
      "imageHint": "rummenigge portrait"
    },
    {
      "id": "portrait-65",
      "description": "Portrait of Hristo Stoichkov",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Hristo_Stoichkov_2010.jpg",
      "imageHint": "stoichkov portrait"
    },
    {
      "id": "portrait-66",
      "description": "Portrait of Gheorghe Hagi",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Gheorghe_Hagi_2018.jpg",
      "imageHint": "hagi portrait"
    },
    {
      "id": "portrait-67",
      "description": "Portrait of Michael Laudrup",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Michael_Laudrup_2012.jpg",
      "imageHint": "laudrup portrait"
    },
    {
      "id": "portrait-68",
      "description": "Portrait of Brian Laudrup",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Brian_Laudrup_2011.jpg",
      "imageHint": "laudrup portrait"
    },
    {
      "id": "portrait-69",
      "description": "Portrait of Roberto Baggio",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/27/Roberto_Baggio_2001.jpg",
      "imageHint": "baggio portrait"
    },
    {
      "id": "portrait-70",
      "description": "Portrait of Alessandro Del Piero",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Alessandro_Del_Piero_2012.jpg",
      "imageHint": "piero portrait"
    },
    {
      "id": "portrait-71",
      "description": "Portrait of Francesco Totti",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/60/Francesco_Totti_2012.jpg",
      "imageHint": "totti portrait"
    },
    {
      "id": "portrait-72",
      "description": "Portrait of Gabriel Batistuta",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Gabriel_Batistuta_2011.jpg",
      "imageHint": "batistuta portrait"
    },
    {
      "id": "portrait-73",
      "description": "Portrait of Hernán Crespo",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Hern%C3%A1n_Crespo_2011.jpg",
      "imageHint": "crespo portrait"
    },
    {
      "id": "portrait-74",
      "description": "Portrait of Pavel Nedvěd",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Pavel_Nedv%C4%9Bd_2012.jpg",
      "imageHint": "nedved portrait"
    },
    {
      "id": "portrait-75",
      "description": "Portrait of Andriy Shevchenko",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Andriy_Shevchenko_2012.jpg",
      "imageHint": "shevchenko portrait"
    },
    {
      "id": "portrait-76",
      "description": "Portrait of Kaká",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Kak%C3%A1_2012.jpg",
      "imageHint": "kaka portrait"
    },
    {
      "id": "portrait-77",
      "description": "Portrait of Luís Figo",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Lu%C3%ADs_Figo_2012.jpg",
      "imageHint": "figo portrait"
    },
    {
      "id": "portrait-78",
      "description": "Portrait of Rui Costa",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Rui_Costa_2012.jpg",
      "imageHint": "costa portrait"
    },
    {
      "id": "portrait-79",
      "description": "Portrait of Deco",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Deco_2012.jpg",
      "imageHint": "deco portrait"
    },
    {
      "id": "portrait-80",
      "description": "Portrait of Clarence Seedorf",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Clarence_Seedorf_2012.jpg",
      "imageHint": "seedorf portrait"
    },
    {
      "id": "portrait-81",
      "description": "Portrait of Edgar Davids",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Edgar_Davids_2012.jpg",
      "imageHint": "davids portrait"
    },
    {
      "id": "portrait-82",
      "description": "Portrait of Jaap Stam",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Jaap_Stam_2012.jpg",
      "imageHint": "stam portrait"
    },
    {
      "id": "portrait-83",
      "description": "Portrait of Raúl González",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Ra%C3%BAl_Gonz%C3%A1lez_2012.jpg",
      "imageHint": "raul portrait"
    },
    {
      "id": "portrait-84",
      "description": "Portrait of Fernando Morientes",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Fernando_Morientes_2012.jpg",
      "imageHint": "morientes portrait"
    },
    {
      "id": "portrait-85",
      "description": "Portrait of Guti",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Guti_2012.jpg",
      "imageHint": "guti portrait"
    },
    {
      "id": "portrait-86",
      "description": "Portrait of Míchel Salgado",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2e/M%C3%ADchel_Salgado_2012.jpg",
      "imageHint": "salgado portrait"
    },
    {
      "id": "portrait-87",
      "description": "Portrait of Christian Vieri",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Christian_Vieri_2012.jpg",
      "imageHint": "vieri portrait"
    },
    {
      "id": "portrait-88",
      "description": "Portrait of Filippo Inzaghi",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Filippo_Inzaghi_2012.jpg",
      "imageHint": "inzaghi portrait"
    },
    {
      "id": "portrait-89",
      "description": "Portrait of David Trezeguet",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f5/David_Trezeguet_2012.jpg",
      "imageHint": "trezeguet portrait"
    },
    {
      "id": "portrait-90",
      "description": "Portrait of Michael Owen",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Michael_Owen_2012.jpg",
      "imageHint": "owen portrait"
    },
    {
      "id": "portrait-91",
      "description": "Portrait of Alan Shearer",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Alan_Shearer_2012.jpg",
      "imageHint": "shearer portrait"
    },
    {
      "id": "portrait-92",
      "description": "Portrait of Ian Wright",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Ian_Wright_2012.jpg",
      "imageHint": "wright portrait"
    },
    {
      "id": "portrait-93",
      "description": "Portrait of Robbie Fowler",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Robbie_Fowler_2012.jpg",
      "imageHint": "fowler portrait"
    },
    {
      "id": "portrait-94",
      "description": "Portrait of Wayne Rooney",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/80/Wayne_Rooney_2012.jpg",
      "imageHint": "rooney portrait"
    },
    {
      "id": "portrait-95",
      "description": "Portrait of Robin van Persie",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Robin_van_Persie_2012.jpg",
      "imageHint": "persie portrait"
    },
    {
      "id": "portrait-96",
      "description": "Portrait of Ruud van Nistelrooy",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/58/Ruud_van_Nistelrooy_2012.jpg",
      "imageHint": "nistelrooy portrait"
    },
    {
      "id": "portrait-97",
      "description": "Portrait of Arjen Robben",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Arjen_Robben_2012.jpg",
      "imageHint": "robben portrait"
    },
    {
      "id": "portrait-98",
      "description": "Portrait of Wesley Sneijder",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Wesley_Sneijder_2012.jpg",
      "imageHint": "sneijder portrait"
    },
    {
      "id": "portrait-99",
      "description": "Portrait of Andrea Pirlo",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Andrea_Pirlo_2012.jpg",
      "imageHint": "pirlo portrait"
    },
    {
      "id": "portrait-100",
      "description": "Portrait of Gennaro Gattuso",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Gennaro_Gattuso_2012.jpg",
      "imageHint": "gattuso portrait"
    },
    {
      "id": "portrait-101",
      "description": "Portrait of Daniele De Rossi",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Daniele_De_Rossi_2012.jpg",
      "imageHint": "rossi portrait"
    },
    {
      "id": "portrait-102",
      "description": "Portrait of Miroslav Klose",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Miroslav_Klose_2012.jpg",
      "imageHint": "klose portrait"
    },
    {
      "id": "portrait-103",
      "description": "Portrait of Lukas Podolski",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/41/Lukas_Podolski_2012.jpg",
      "imageHint": "podolski portrait"
    },
    {
      "id": "portrait-104",
      "description": "Portrait of Bastian Schweinsteiger",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Bastian_Schweinsteiger_2012.jpg",
      "imageHint": "schweinsteiger portrait"
    },
    {
      "id": "portrait-105",
      "description": "Portrait of Philipp Lahm",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Philipp_Lahm_2012.jpg",
      "imageHint": "lahm portrait"
    },
    {
      "id": "portrait-106",
      "description": "Portrait of Thomas Müller",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Thomas_M%C3%BCller_2012.jpg",
      "imageHint": "muller portrait"
    },
    {
      "id": "portrait-107",
      "description": "Portrait of Robert Lewandowski",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Robert_Lewandowski_2012.jpg",
      "imageHint": "lewandowski portrait"
    },
    {
      "id": "portrait-108",
      "description": "Portrait of Erling Haaland",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/Erling_Haaland_2023.jpg",
      "imageHint": "haaland portrait"
    },
    {
      "id": "avatar-1",
      "description": "Avatar for player 1",
      "imageUrl": "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXJ8ZW58MHx8fHwxNzY2NjMwMTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "person avatar"
    },
    {
      "id": "avatar-2",
      "description": "Avatar for player 2",
      "imageUrl": "https://images.unsplash.com/photo-1724435811349-32d27f4d5806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBhdmF0YXJ8ZW58MHx8fHwxNzY2NjMwMTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "person avatar"
    },
    {
      "id": "user-avatar",
      "description": "Avatar for the main user profile",
      "imageUrl": "https://images.unsplash.com/photo-1641288883869-c463bc6c2a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBhdmF0YXJ8ZW58MHx8fHwxNzY2NjMwMTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "person avatar"
    }
  ]
}
```

---

### `src/lib/placeholder-images.ts`

```ts
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
```

---

### `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```