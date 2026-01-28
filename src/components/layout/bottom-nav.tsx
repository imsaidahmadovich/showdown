'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, User, Store, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('bottomNav.home'), icon: Home },
    { href: '/leaderboard', label: t('bottomNav.leaderboard'), icon: Trophy },
    { href: '/chat', label: t('bottomNav.chat'), icon: MessageSquare },
    { href: '/shop', label: t('bottomNav.shop'), icon: Store },
    { href: '/profile', label: t('bottomNav.profile'), icon: User },
  ];

  return (
    <nav className="mt-auto border-t bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <item.icon
                className="size-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
