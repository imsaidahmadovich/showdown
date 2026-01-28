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
