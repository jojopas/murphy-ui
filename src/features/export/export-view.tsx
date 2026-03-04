import { useState } from 'react';
import { Download, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store';
import type { MurphyConfig } from '@/lib/types';

export function ExportView() {
  const show = useAppStore((s) => s.show);
  const mixer = useAppStore((s) => s.mixer);
  const channels = useAppStore((s) => s.channels);
  const buses = useAppStore((s) => s.buses);
  const settings = useAppStore((s) => s.settings);

  const [host, setHost] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const config: MurphyConfig = { show, mixer, channels, buses, settings };
  const effectiveHost = host || mixer.ip || 'localhost';
  const json = JSON.stringify(config, null, 2);

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const push = async () => {
    setStatus(null);
    try {
      const res = await fetch(`http://${effectiveHost}:8765/api/config/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      });
      if (res.ok) {
        setStatus({ ok: true, msg: `Pushed to ${effectiveHost} — ${res.status} ${res.statusText}` });
      } else {
        setStatus({ ok: false, msg: `Server returned ${res.status} ${res.statusText}` });
      }
    } catch (err) {
      setStatus({ ok: false, msg: `${err instanceof Error ? err.message : String(err)}` });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Download
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={download} className="min-h-[44px] gap-2">
            <Download className="h-4 w-4" />
            Download config.json
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Push to Murphy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Murphy Host</Label>
            <Input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder={mixer.ip || 'e.g. 192.168.1.50'}
              className="text-base"
            />
          </div>
          <Button
            onClick={push}
            variant="secondary"
            className="min-h-[44px] gap-2"
          >
            <Send className="h-4 w-4" />
            Push to Murphy
          </Button>

          {status && (
            <Alert variant={status.ok ? 'default' : 'destructive'}>
              <AlertDescription>{status.msg}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Config Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 rounded-md bg-[#0c0c0e] inset-panel border border-border/30 p-3">
            <pre className="font-mono text-xs text-primary/70">{json}</pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
