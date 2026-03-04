import { useState } from 'react';
import { Undo2, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ConnectionBadge } from '@/components/shared/connection-badge';
import { useAppStore } from '@/store';
import { sendOsc } from '@/lib/api';

export function TopBar() {
  const bridgeStatus = useAppStore((s) => s.bridgeStatus);
  const oscHistory = useAppStore((s) => s.oscHistory);
  const popOscHistory = useAppStore((s) => s.popOscHistory);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);
  const eventLogOpen = useAppStore((s) => s.eventLogOpen);
  const setEventLogOpen = useAppStore((s) => s.setEventLogOpen);
  const [undoOpen, setUndoOpen] = useState(false);

  const canUndo = oscHistory.length > 0;
  const lastEntry = oscHistory[oscHistory.length - 1];

  const handleUndo = async () => {
    const entry = popOscHistory();
    if (!entry) return;
    if (entry.inverseCommands?.length) {
      try {
        await sendOsc(settings.murphyApiHost, settings.murphyApiPort, entry.inverseCommands);
        addEvent({ severity: 'warn', message: `Undid: ${entry.description}` });
      } catch {
        addEvent({ severity: 'error', message: 'Undo failed — could not send inverse OSC commands' });
      }
    } else {
      addEvent({ severity: 'warn', message: `Removed from history: ${entry.description} (no inverse available)` });
    }
    setUndoOpen(false);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-gradient-to-b from-[#161618] to-[#111113] px-4">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif", filter: 'drop-shadow(0 0 6px rgba(245, 130, 11, 0.4))' }}>Murphy</span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">AI FOH Engineer</span>
      </div>

      <ConnectionBadge status={bridgeStatus} className="hidden sm:flex" />

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px]"
              disabled={!canUndo}
              onClick={() => setUndoOpen(true)}
            >
              <Undo2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {canUndo ? 'Undo last OSC command' : 'No commands to undo'}
          </TooltipContent>
        </Tooltip>

        <AlertDialog open={undoOpen} onOpenChange={setUndoOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Undo last OSC action?</AlertDialogTitle>
              <AlertDialogDescription>
                {lastEntry
                  ? `This will undo: "${lastEntry.description}" (${lastEntry.commands.length} command${lastEntry.commands.length === 1 ? '' : 's'})`
                  : 'No actions to undo.'}
                {lastEntry && !lastEntry.inverseCommands?.length && (
                  <span className="mt-1 block text-status-yellow">
                    No inverse commands available — this will only remove from history.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUndo} className="min-h-[44px]">
                Undo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={eventLogOpen ? 'secondary' : 'ghost'}
              size="icon"
              className="min-h-[44px] min-w-[44px]"
              onClick={() => setEventLogOpen(!eventLogOpen)}
            >
              <ScrollText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Event Log</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
