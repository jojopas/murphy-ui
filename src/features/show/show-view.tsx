import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadCard } from '@/components/shared/upload-card';
import { PastShowsCard } from './past-shows-card';
import { useAppStore } from '@/store';
import { uploadScene, uploadInputList, fetchShows } from '@/lib/api';

export function ShowView() {
  const show = useAppStore((s) => s.show);
  const setShow = useAppStore((s) => s.setShow);
  const channels = useAppStore((s) => s.channels);
  const setChannels = useAppStore((s) => s.setChannels);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);
  const setShows = useAppStore((s) => s.setShows);
  const setShowsLoading = useAppStore((s) => s.setShowsLoading);
  const setChannelSource = useAppStore((s) => s.setChannelSource);
  const clearOverrides = useAppStore((s) => s.clearOverrides);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setShowsLoading(true);
      try {
        const data = await fetchShows(settings.murphyApiHost, settings.murphyApiPort);
        if (!cancelled) setShows(data);
      } catch {
        if (!cancelled) addEvent({ severity: 'error', message: 'Failed to load past shows' });
      } finally {
        if (!cancelled) setShowsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScnUpload = async (file: File) => {
    try {
      const data = await uploadScene(settings.murphyApiHost, settings.murphyApiPort, file);
      if (data.channels) setChannels(data.channels as typeof channels);
      setChannelSource('scene');
      clearOverrides();
      addEvent({
        severity: 'success',
        message: `Scene loaded — ${data.channels?.length || 0} channels imported`,
      });
    } catch {
      addEvent({ severity: 'error', message: 'Scene upload failed. Check that the Murphy API is running.' });
    }
  };

  const handleCsvUpload = async (file: File) => {
    try {
      const data = await uploadInputList(settings.murphyApiHost, settings.murphyApiPort, file);
      if (data.channels) setChannels(data.channels as typeof channels);
      setChannelSource('scene');
      clearOverrides();
      addEvent({
        severity: 'success',
        message: `Input list loaded — ${data.channels?.length || 0} channels imported`,
      });
    } catch {
      addEvent({ severity: 'error', message: 'Input list upload failed. Check that the Murphy API is running.' });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Show Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="show-name">Band / Show Name</Label>
              <Input
                id="show-name"
                value={show.name}
                onChange={(e) => setShow({ ...show, name: e.target.value })}
                placeholder="Yaleo Santana"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show-date">Date</Label>
              <Input
                id="show-date"
                type="date"
                value={show.date}
                onChange={(e) => setShow({ ...show, date: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show-venue">Venue</Label>
              <Input
                id="show-venue"
                value={show.venue}
                onChange={(e) => setShow({ ...show, venue: e.target.value })}
                placeholder="Venue name"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show-notes">Notes</Label>
              <Textarea
                id="show-notes"
                value={show.notes}
                onChange={(e) => setShow({ ...show, notes: e.target.value })}
                rows={3}
                placeholder="Stage notes, special instructions..."
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Load from Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <UploadCard
                label="Upload .scn Scene"
                hint="Imports EQ, dynamics, channel names from X32 scene"
                accept=".scn"
                onUpload={handleScnUpload}
              />
              <UploadCard
                label="Upload Input List"
                hint="CSV with channel numbers, names, instruments"
                accept=".csv,.json"
                onUpload={handleCsvUpload}
              />
            </div>
            {channels.length > 0 && (
              <p className="text-sm text-status-green">
                {channels.length} channels loaded
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <PastShowsCard />
    </div>
  );
}
