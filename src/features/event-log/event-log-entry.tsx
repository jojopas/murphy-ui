import { cn } from '@/lib/utils';
import type { EventLogEntry, EventSeverity } from '@/lib/types';

const severityStyles: Record<EventSeverity, string> = {
  info: 'text-muted-foreground',
  warn: 'text-status-yellow',
  error: 'text-status-red',
  success: 'text-status-green',
};

interface EventLogEntryRowProps {
  entry: EventLogEntry;
}

export function EventLogEntryRow({ entry }: EventLogEntryRowProps) {
  const time = new Date(entry.timestamp).toLocaleTimeString();
  return (
    <div className="flex items-start gap-3 px-4 py-2 text-sm">
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground/60">
        {time}
      </span>
      <span
        className={cn(
          'flex-1',
          severityStyles[entry.severity]
        )}
      >
        {entry.message}
      </span>
      {entry.oscPath && (
        <code className="shrink-0 font-mono text-xs text-primary drop-shadow-[0_0_4px_rgba(245,130,11,0.4)]">
          {entry.oscPath}
        </code>
      )}
    </div>
  );
}
