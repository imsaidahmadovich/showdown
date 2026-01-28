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
