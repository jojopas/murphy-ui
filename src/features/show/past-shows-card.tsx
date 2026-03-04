import { useState } from 'react';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store';
import { fetchShow, deleteShow } from '@/lib/api';

export function PastShowsCard() {
  const shows = useAppStore((s) => s.shows);
  const showsLoading = useAppStore((s) => s.showsLoading);
  const setShow = useAppStore((s) => s.setShow);
  const setChannels = useAppStore((s) => s.setChannels);
  const setActiveShowId = useAppStore((s) => s.setActiveShowId);
  const setChannelSource = useAppStore((s) => s.setChannelSource);
  const clearOverrides = useAppStore((s) => s.clearOverrides);
  const setShows = useAppStore((s) => s.setShows);
  const settings = useAppStore((s) => s.settings);
  const addEvent = useAppStore((s) => s.addEvent);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleLoad = async (id: number) => {
    setLoadingId(id);
    try {
      const data = await fetchShow(settings.murphyApiHost, settings.murphyApiPort, id);
      setShow({
        name: data.show.band,
        date: data.show.date,
        venue: data.show.venue,
        notes: data.show.notes ?? '',
      });
      setChannels(data.channels);
      setActiveShowId(id);
      setChannelSource('ai');
      clearOverrides();
      addEvent({ severity: 'success', message: `Loaded show: ${data.show.band} @ ${data.show.venue}` });
    } catch {
      addEvent({ severity: 'error', message: `Failed to load show #${id}` });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteShow(settings.murphyApiHost, settings.murphyApiPort, id);
      setShows(shows.filter((s) => s.id !== id));
      addEvent({ severity: 'info', message: `Deleted show #${id}` });
    } catch {
      addEvent({ severity: 'error', message: `Failed to delete show #${id}` });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
          Past Shows
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : shows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No past shows found.
          </p>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {shows.map((show) => (
                <div
                  key={show.id}
                  className="flex min-h-[44px] items-center gap-3 rounded-md bg-[#0e0e10] px-3 py-2 inset-panel"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{show.band}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {show.venue} &middot; {show.date}
                    </p>
                  </div>
                  {show.channel_count != null && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {show.channel_count} ch
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] text-primary"
                    onClick={() => handleLoad(show.id)}
                    disabled={loadingId !== null}
                  >
                    {loadingId === show.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete show?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{show.band} @ {show.venue}" and its channel data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDelete(show.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
