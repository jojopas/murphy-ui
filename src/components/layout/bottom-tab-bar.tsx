import { MessageSquare, Music, Sliders, Settings, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import type { TabId } from '@/lib/types';

const tabs: { id: TabId; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'show', label: 'Show', icon: Music },
  { id: 'channels', label: 'Channels', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'export', label: 'Export', icon: Download },
];

export function BottomTabBar() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <nav className="flex shrink-0 border-t border-border bg-gradient-to-t from-[#0e0e10] to-card pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            'relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-murphy',
            activeTab === id
              ? 'text-primary before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-[2px] before:rounded-full before:bg-primary before:shadow-[0_0_8px_var(--color-glow-primary)]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
