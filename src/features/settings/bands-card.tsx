import { useEffect, useState } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { fetchBands, createBand } from '@/lib/api';

export function BandsCard() {
  const bands = useAppStore((s) => s.bands);
  const setBands = useAppStore((s) => s.setBands);
  const bandsLoading = useAppStore((s) => s.bandsLoading);
  const setBandsLoading = useAppStore((s) => s.setBandsLoading);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', genre: '', notes: '' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setBandsLoading(true);
      try {
        const data = await fetchBands(settings.murphyApiHost, settings.murphyApiPort);
        if (!cancelled) setBands(data);
      } catch {
        if (!cancelled) addEvent({ severity: 'error', message: 'Failed to load bands' });
      } finally {
        if (!cancelled) setBandsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const band = await createBand(settings.murphyApiHost, settings.murphyApiPort, {
        name: form.name.trim(),
        genre: form.genre || undefined,
        notes: form.notes || undefined,
      });
      setBands([...bands, band]);
      setForm({ name: '', genre: '', notes: '' });
      setShowForm(false);
      addEvent({ severity: 'success', message: `Band "${band.name}" added` });
    } catch {
      addEvent({ severity: 'error', message: 'Failed to create band' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
          Bands
        </CardTitle>
        {!showForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
            className="min-h-[44px] gap-1 text-primary"
          >
            <Plus className="h-4 w-4" />
            Add Band
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {bandsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : bands.length === 0 && !showForm ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No bands yet.</p>
        ) : (
          <ScrollArea className="max-h-[240px]">
            <div className="space-y-2">
              {bands.map((band) => (
                <div
                  key={band.id}
                  className="flex min-h-[44px] items-center gap-3 rounded-md bg-[#0e0e10] px-3 py-2 inset-panel"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{band.name}</p>
                    {band.notes && (
                      <p className="truncate text-xs text-muted-foreground">{band.notes}</p>
                    )}
                  </div>
                  {band.genre && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {band.genre}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {showForm && (
          <div className="space-y-3 rounded-md bg-[#0e0e10] p-3 inset-panel">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Band name"
                  className="text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Genre</Label>
                <Input
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  placeholder="Rock, Jazz..."
                  className="text-base"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Preferences, rider notes..."
                className="text-base"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[44px]"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: '', genre: '', notes: '' });
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="min-h-[44px]"
                onClick={handleSave}
                disabled={!form.name.trim() || saving}
              >
                {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
