import type { OscBridgeStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConnectionBadgeProps {
  status: OscBridgeStatus;
  className?: string;
}

const statusConfig: Record<OscBridgeStatus, { dot: string; glow: string; label: string; breathe: boolean }> = {
  connected: { dot: 'bg-status-green', glow: 'shadow-[0_0_6px_rgba(74,222,128,0.5)]', label: 'X32 Connected', breathe: true },
  checking: { dot: 'bg-status-yellow', glow: 'shadow-[0_0_6px_rgba(250,204,21,0.5)]', label: 'Checking...', breathe: false },
  disconnected: { dot: 'bg-status-red', glow: 'shadow-[0_0_6px_rgba(248,113,113,0.5)]', label: 'X32 Disconnected', breathe: false },
};

export function ConnectionBadge({ status, className }: ConnectionBadgeProps) {
  const { dot, glow, label, breathe } = statusConfig[status];
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', dot, glow, breathe && 'animate-led-breathe text-status-green')} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
