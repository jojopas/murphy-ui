import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChannelCard } from './channel-card';
import { BusSection } from './bus-section';
import { useAppStore } from '@/store';
import { INSTRUMENT_MAP } from '@/lib/instrument-map';
import { postChannelOverride } from '@/lib/api';
import type { ChannelConfig } from '@/lib/types';

function newChannel(ch: number): ChannelConfig {
  return {
    ch,
    name: '',
    instrument: 'other',
    mic: '',
    color: 'WHITE',
    phantom: false,
    gain_db: 0,
    group: 'misc',
    bus_sends: [],
    template: 'default',
    muted: false,
  };
}

export function ChannelsView() {
  const channels = useAppStore((s) => s.channels);
  const setChannels = useAppStore((s) => s.setChannels);
  const channelSource = useAppStore((s) => s.channelSource);
  const overriddenChannels = useAppStore((s) => s.overriddenChannels);
  const markOverridden = useAppStore((s) => s.markOverridden);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);

  const addChannel = () => {
    const ch = channels.length > 0 ? Math.max(...channels.map((c) => c.ch)) + 1 : 1;
    setChannels([...channels, newChannel(ch)]);
  };

  const updateChannel = (
    idx: number,
    field: keyof ChannelConfig,
    value: ChannelConfig[keyof ChannelConfig]
  ) => {
    const updated = channels.map((ch, i) => {
      if (i !== idx) return ch;
      if (field === 'instrument') {
        const inst = value as string;
        const map = INSTRUMENT_MAP[inst] || INSTRUMENT_MAP['other'];
        return { ...ch, instrument: inst, color: map.color, template: map.template, group: map.group };
      }
      return { ...ch, [field]: value };
    });
    setChannels(updated);
  };

  const removeChannel = (idx: number) => {
    setChannels(channels.filter((_, i) => i !== idx));
  };

  const handleOverride = (
    ch: ChannelConfig,
    field: keyof ChannelConfig,
    oldValue: ChannelConfig[keyof ChannelConfig],
    newValue: ChannelConfig[keyof ChannelConfig]
  ) => {
    if (channelSource !== 'ai') return;
    markOverridden(ch.ch);
    addEvent({
      severity: 'info',
      message: `Ch ${ch.ch} override: ${String(field)} "${String(oldValue)}" → "${String(newValue)}"`,
      channel: ch.ch,
    });
    // Fire-and-forget — non-blocking
    postChannelOverride(settings.murphyApiHost, settings.murphyApiPort, ch.ch, {
      param_type: String(field),
      ai_value: String(oldValue ?? ''),
      engineer_value: String(newValue ?? ''),
    }).catch(() => {
      // Silently fail — override is logged locally regardless
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-4">
        <BusSection />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Channels ({channels.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={addChannel}
            className="min-h-[44px] gap-1 text-primary"
          >
            <Plus className="h-4 w-4" />
            Add Channel
          </Button>
        </div>

        {channels.map((ch, i) => (
          <ChannelCard
            key={i}
            channel={ch}
            onUpdate={(field, value) => updateChannel(i, field, value)}
            onRemove={() => removeChannel(i)}
            isOverridden={overriddenChannels.has(ch.ch)}
            onOverride={
              channelSource === 'ai'
                ? (field, oldValue, newValue) => handleOverride(ch, field, oldValue, newValue)
                : undefined
            }
          />
        ))}

        {channels.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No channels. Tap + Add Channel or upload a scene file from the Show tab.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
