import { useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventLogEntryRow } from './event-log-entry';
import { useAppStore } from '@/store';

export function EventLogSheet() {
  const eventLogOpen = useAppStore((s) => s.eventLogOpen);
  const setEventLogOpen = useAppStore((s) => s.setEventLogOpen);
  const eventLog = useAppStore((s) => s.eventLog);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventLogOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [eventLog, eventLogOpen]);

  return (
    <Sheet open={eventLogOpen} onOpenChange={setEventLogOpen}>
      <SheetContent side="bottom" className="h-[50dvh]">
        <SheetHeader>
          <SheetTitle>Event Log ({eventLog.length})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-4 flex-1">
          {eventLog.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No events yet. Events will appear as you interact with Murphy.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {eventLog.map((entry) => (
                <EventLogEntryRow key={entry.id} entry={entry} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
