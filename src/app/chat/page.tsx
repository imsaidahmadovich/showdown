'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { withAuth } from '@/components/auth/with-auth';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useLanguage } from '@/context/language-context';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/data';
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
const ChatMessage = ({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) => {
    return (
        <div className={cn("flex items-start gap-3", isCurrentUser && "flex-row-reverse")}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={message.photoURL} />
                <AvatarFallback>{message.displayName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className={cn(
                "max-w-[75%] rounded-lg p-3 text-sm",
                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                {!isCurrentUser && <p className="text-xs font-bold mb-1">{message.displayName}</p>}
                <p>{message.text}</p>
            </div>
        </div>
    )
}

function ChatPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { t } = useLanguage();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesCollection = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'messages');
    }, [firestore]);

    const messagesQuery = useMemoFirebase(() => {
        if (!messagesCollection) return null;
        return query(messagesCollection, orderBy('createdAt', 'asc'), limit(50));
    }, [messagesCollection]);

    const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !messagesCollection) return;

        setIsSending(true);

        const messageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
        };

        try {
            await addDoc(messagesCollection, messageData);
            setNewMessage('');
        } catch (error) {
             const permissionError = new FirestorePermissionError({
                path: messagesCollection.path,
                operation: 'create',
                requestResourceData: messageData
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsSending(false);
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
                <h1 className="font-headline text-xl font-bold">{t('chat.title')}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {isLoading && (
                        <div className="flex justify-center pt-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {messages?.map(msg => (
                        <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.userId === user?.uid} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="border-t p-4 bg-card/80 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
                </form>
            </footer>
        </div>
    );
}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6493634839455307"
     crossorigin="anonymous"></script>
export default withAuth(ChatPage);
