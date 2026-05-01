'use client';

import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export default function PageShell({
  children,
  showTopBar = true,
  showBottomNav = true,
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showTopBar && <TopBar />}

      <main
        className={cn(
          'flex-1',
          showBottomNav && 'pb-20 lg:pb-0',
          className
        )}
      >
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
