'use client';
import { useLanguage } from '@/context/language-context';
import { BottomNav } from './bottom-nav';

export function MobileContainer({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <div dir={language === 'uz' ? 'ltr' : 'ltr'} className="relative flex h-[740px] w-full max-w-[375px] flex-col overflow-hidden bg-card">
      <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-800 dark:bg-gray-900"></div>
      <div className="relative flex-1 overflow-y-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
