import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateOscCommands } from '@/lib/osc-validation';
import { cn } from '@/lib/utils';

interface OscCommandBlockProps {
  commands: string[];
  path?: 'fast' | 'slow';
}

export function OscCommandBlock({ commands, path }: OscCommandBlockProps) {
  const validated = validateOscCommands(commands);

  return (
    <div className="mt-2 flex flex-col gap-1 rounded-md bg-[#0c0c0e] inset-panel border border-border/30 p-3">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        OSC Commands
      </span>
      {validated.map(({ command, valid }, i) => (
        <div key={i} className="flex items-center gap-2">
          {valid ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-status-green" />
          ) : (
            <X className="h-3.5 w-3.5 shrink-0 text-status-red" />
          )}
          <code
            className={cn(
              'font-mono text-sm',
              valid ? 'text-primary drop-shadow-[0_0_4px_rgba(245,130,11,0.4)]' : 'text-status-red'
            )}
          >
            {command}
          </code>
        </div>
      ))}
      {path && (
        <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
          {path}
        </Badge>
      )}
    </div>
  );
}
