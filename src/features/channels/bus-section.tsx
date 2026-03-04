import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import type { BusConfig } from '@/lib/types';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export function BusSection() {
  const buses = useAppStore((s) => s.buses);
  const setBuses = useAppStore((s) => s.setBuses);

  const addBus = () => {
    const num = buses.length > 0 ? Math.max(...buses.map((b) => b.bus)) + 1 : 1;
    setBuses([...buses, { bus: num, name: '', id: '' }]);
  };

  const update = (idx: number, field: keyof BusConfig, value: string | number) => {
    const updated = buses.map((b, i) => {
      if (i !== idx) return b;
      if (field === 'name') return { ...b, name: value as string, id: slugify(value as string) };
      return { ...b, [field]: value };
    });
    setBuses(updated);
  };

  const remove = (idx: number) => setBuses(buses.filter((_, i) => i !== idx));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
          Buses
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={addBus}
          className="min-h-[44px] gap-1 text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Bus
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {buses.map((bus, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="number"
              value={bus.bus}
              onChange={(e) => update(i, 'bus', parseInt(e.target.value) || 1)}
              className="w-16 text-base"
            />
            <Input
              value={bus.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Bus name"
              className="flex-1 text-base"
            />
            <span className="w-24 truncate text-xs text-muted-foreground">
              {bus.id || 'auto-slug'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] shrink-0 text-destructive hover:bg-destructive/10"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {buses.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No buses. Tap + Add Bus.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
