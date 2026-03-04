import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChannelConfig } from '@/lib/types';
import { INSTRUMENT_MAP } from '@/lib/instrument-map';

const INSTRUMENTS = Object.keys(INSTRUMENT_MAP);

const STRIP_COLORS: Record<string, string> = {
  RED: 'border-l-strip-red',
  YELLOW: 'border-l-strip-yellow',
  GREEN: 'border-l-strip-green',
  CYAN: 'border-l-strip-cyan',
  BLUE: 'border-l-strip-blue',
  MAGENTA: 'border-l-strip-magenta',
  WHITE: 'border-l-strip-white',
};

interface ChannelCardProps {
  channel: ChannelConfig;
  onUpdate: (field: keyof ChannelConfig, value: ChannelConfig[keyof ChannelConfig]) => void;
  onRemove: () => void;
  isOverridden?: boolean;
  onOverride?: (field: keyof ChannelConfig, oldValue: ChannelConfig[keyof ChannelConfig], newValue: ChannelConfig[keyof ChannelConfig]) => void;
}

export function ChannelCard({ channel, onUpdate, onRemove, isOverridden, onOverride }: ChannelCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleUpdate = (field: keyof ChannelConfig, value: ChannelConfig[keyof ChannelConfig]) => {
    if (onOverride) {
      onOverride(field, channel[field], value);
    }
    onUpdate(field, value);
  };

  const handleInstrumentChange = (inst: string) => {
    const map = INSTRUMENT_MAP[inst] || INSTRUMENT_MAP['other'];
    if (onOverride) {
      onOverride('instrument', channel.instrument, inst);
    }
    onUpdate('instrument', inst);
    onUpdate('color', map.color);
    onUpdate('template', map.template);
    onUpdate('group', map.group);
  };

  const stripColor = STRIP_COLORS[channel.color ?? 'WHITE'] || 'border-l-strip-white';

  return (
    <Card className={cn('border-l-[3px]', stripColor, expanded && 'glow-primary')}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="inline-flex h-7 w-8 shrink-0 items-center justify-center rounded bg-[#0c0c0e] font-mono text-sm text-primary inset-panel">
          {channel.ch}
        </span>
        <span className="flex-1 truncate text-sm font-medium">
          {channel.name || 'Unnamed'}
        </span>
        <Badge variant="secondary" className="text-xs">
          {channel.instrument}
        </Badge>
        {isOverridden && (
          <Badge variant="outline" className="border-status-yellow text-status-yellow text-xs">
            Corrected
          </Badge>
        )}
        {channel.muted && (
          <Badge variant="destructive" className="text-xs shadow-[0_0_8px_var(--color-glow-red)]">
            MUTE
          </Badge>
        )}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && (
        <CardContent className="animate-in fade-in-0 slide-in-from-top-1 space-y-4 border-t border-border pt-4 duration-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Channel #</Label>
              <Input
                type="number"
                value={channel.ch}
                onChange={(e) => handleUpdate('ch', parseInt(e.target.value) || 1)}
                className="text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                value={channel.name}
                onChange={(e) => handleUpdate('name', e.target.value)}
                placeholder="Channel name"
                className="text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Instrument</Label>
              <Select
                value={channel.instrument}
                onValueChange={handleInstrumentChange}
              >
                <SelectTrigger className="min-h-[44px] text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENTS.map((inst) => (
                    <SelectItem key={inst} value={inst}>
                      {inst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mic</Label>
              <Input
                value={channel.mic ?? ''}
                onChange={(e) => handleUpdate('mic', e.target.value)}
                placeholder="Mic model"
                className="text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Gain dB</Label>
              <Input
                type="number"
                min={-20}
                max={80}
                value={channel.gain_db ?? 0}
                onChange={(e) => handleUpdate('gain_db', parseInt(e.target.value) || 0)}
                className="text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Group</Label>
              <Input
                value={channel.group ?? ''}
                onChange={(e) => handleUpdate('group', e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bus Sends</Label>
              <Input
                value={(channel.bus_sends ?? []).join(', ')}
                onChange={(e) =>
                  handleUpdate(
                    'bus_sends',
                    e.target.value
                      ? e.target.value.split(',').map((s) => s.trim())
                      : []
                  )
                }
                placeholder="bus1, bus2"
                className="text-base"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`phantom-${channel.ch}`}
                  checked={channel.phantom ?? false}
                  onCheckedChange={(checked) => handleUpdate('phantom', !!checked)}
                />
                <Label htmlFor={`phantom-${channel.ch}`} className="text-xs">
                  48V
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`mute-${channel.ch}`}
                  checked={channel.muted ?? false}
                  onCheckedChange={(checked) => handleUpdate('muted', !!checked)}
                />
                <Label htmlFor={`mute-${channel.ch}`} className="text-xs">
                  Muted
                </Label>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
