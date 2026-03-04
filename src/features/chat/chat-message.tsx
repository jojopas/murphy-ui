import type { ChatMessage } from '@/lib/types';
import { OscCommandBlock } from '@/components/shared/osc-command-block';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessage;
  onApprove: (msg: ChatMessage) => void;
  onSkip: (msgId: string) => void;
}

export function ChatMessageBubble({ message, onApprove, onSkip }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'max-w-[85%] rounded-xl px-4 py-3',
        isUser
          ? 'self-end bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_2px_8px_rgba(245,130,11,0.25)]'
          : 'self-start border-l-[3px] border-l-primary/60 bg-card raised-panel'
      )}
    >
      <p className="text-[15px] leading-relaxed">{message.text}</p>

      {message.confidence && message.role === 'murphy' && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={cn(
            'inline-block h-2 w-2 rounded-full',
            message.confidence === 'high' ? 'bg-status-green shadow-[0_0_4px_rgba(74,222,128,0.5)]' :
            message.confidence === 'medium' ? 'bg-status-yellow shadow-[0_0_4px_rgba(250,204,21,0.5)]' :
            'bg-status-red shadow-[0_0_4px_rgba(248,113,113,0.5)]'
          )} />
          <span className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            message.confidence === 'high' ? 'bg-status-green/15 text-status-green' :
            message.confidence === 'medium' ? 'bg-status-yellow/15 text-status-yellow' :
            'bg-status-red/15 text-status-red'
          )}>
            {message.confidence}
          </span>
        </div>
      )}

      {message.oscCommands && message.oscCommands.length > 0 && (
        <OscCommandBlock
          commands={message.oscCommands}
          path={message.path}
        />
      )}

      {message.role === 'murphy' && message.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <Button
            onClick={() => onApprove(message)}
            className="min-h-[44px] bg-gradient-to-b from-status-green to-status-green/85 text-black shadow-[0_0_10px_var(--color-glow-green)] hover:from-status-green/95 hover:to-status-green/80"
          >
            Apply
          </Button>
          <Button
            variant="secondary"
            onClick={() => onSkip(message.id)}
            className="min-h-[44px]"
          >
            Skip
          </Button>
        </div>
      )}

      {message.status === 'fired' && message.role === 'murphy' && message.oscCommands?.length ? (
        <p className="mt-1.5 text-xs text-status-green">Applied</p>
      ) : null}
      {message.status === 'skipped' && (
        <p className="mt-1.5 text-xs text-muted-foreground">Skipped</p>
      )}
    </div>
  );
}
