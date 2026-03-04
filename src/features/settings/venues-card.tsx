import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { fetchVenues, createVenue, deleteVenue } from '@/lib/api';

export function VenuesCard() {
  const venues = useAppStore((s) => s.venues);
  const setVenues = useAppStore((s) => s.setVenues);
  const venuesLoading = useAppStore((s) => s.venuesLoading);
  const setVenuesLoading = useAppStore((s) => s.setVenuesLoading);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', room_type: '', capacity: '', pa_system: '' });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setVenuesLoading(true);
      try {
        const data = await fetchVenues(settings.murphyApiHost, settings.murphyApiPort);
        if (!cancelled) setVenues(data);
      } catch {
        if (!cancelled) addEvent({ severity: 'error', message: 'Failed to load venues' });
      } finally {
        if (!cancelled) setVenuesLoading(false);
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
      const venue = await createVenue(settings.murphyApiHost, settings.murphyApiPort, {
        name: form.name.trim(),
        room_type: form.room_type || undefined,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        pa_system: form.pa_system || undefined,
      });
      setVenues([...venues, venue]);
      setForm({ name: '', room_type: '', capacity: '', pa_system: '' });
      setShowForm(false);
      addEvent({ severity: 'success', message: `Venue "${venue.name}" added` });
    } catch {
      addEvent({ severity: 'error', message: 'Failed to create venue' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVenue(settings.murphyApiHost, settings.murphyApiPort, id);
      setVenues(venues.filter((v) => v.id !== id));
      addEvent({ severity: 'info', message: `Venue deleted` });
    } catch {
      addEvent({ severity: 'error', message: 'Failed to delete venue' });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
          Venues
        </CardTitle>
        {!showForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
            className="min-h-[44px] gap-1 text-primary"
          >
            <Plus className="h-4 w-4" />
            Add Venue
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {venuesLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : venues.length === 0 && !showForm ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No venues yet.</p>
        ) : (
          <ScrollArea className="max-h-[240px]">
            <div className="space-y-2">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="flex min-h-[44px] items-center gap-3 rounded-md bg-[#0e0e10] px-3 py-2 inset-panel"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{venue.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[venue.room_type, venue.capacity && `${venue.capacity} cap`]
                        .filter(Boolean)
                        .join(' · ') || 'No details'}
                    </p>
                  </div>
                  {venue.pa_system && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {venue.pa_system}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(venue.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                  placeholder="Venue name"
                  className="text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Room Type</Label>
                <Input
                  value={form.room_type}
                  onChange={(e) => setForm({ ...form, room_type: e.target.value })}
                  placeholder="Club, theater..."
                  className="text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Capacity</Label>
                <Input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="200"
                  className="text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">PA System</Label>
                <Input
                  value={form.pa_system}
                  onChange={(e) => setForm({ ...form, pa_system: e.target.value })}
                  placeholder="JBL VTX..."
                  className="text-base"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[44px]"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: '', room_type: '', capacity: '', pa_system: '' });
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
