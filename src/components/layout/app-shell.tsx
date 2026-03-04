import type { ReactNode } from 'react';
import { TopBar } from './top-bar';
import { BottomTabBar } from './bottom-tab-bar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-[100dvh] flex-col pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <TopBar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-[#0d0d0e]">{children}</main>
      <BottomTabBar />
    </div>
  );
}
