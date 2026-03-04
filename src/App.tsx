import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShell } from '@/components/layout/app-shell';
import { ChatView } from '@/features/chat/chat-view';
import { ShowView } from '@/features/show/show-view';
import { ChannelsView } from '@/features/channels/channels-view';
import { SettingsView } from '@/features/settings/settings-view';
import { ExportView } from '@/features/export/export-view';
import { EventLogSheet } from '@/features/event-log/event-log-sheet';
import { useAppStore } from '@/store';

function ActiveView() {
  const activeTab = useAppStore((s) => s.activeTab);

  switch (activeTab) {
    case 'chat':
      return <ChatView />;
    case 'show':
      return <ShowView />;
    case 'channels':
      return <ChannelsView />;
    case 'settings':
      return <SettingsView />;
    case 'export':
      return <ExportView />;
  }
}

export default function App() {
  return (
    <TooltipProvider>
      <AppShell>
        <ActiveView />
      </AppShell>
      <EventLogSheet />
    </TooltipProvider>
  );
}
