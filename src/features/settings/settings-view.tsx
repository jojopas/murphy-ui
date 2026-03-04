import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConnectionBadge } from '@/components/shared/connection-badge';
import { VenuesCard } from './venues-card';
import { BandsCard } from './bands-card';
import { useAppStore } from '@/store';
import { checkOscStatus } from '@/lib/api';

export function SettingsView() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const mixer = useAppStore((s) => s.mixer);
  const setMixer = useAppStore((s) => s.setMixer);
  const bridgeStatus = useAppStore((s) => s.bridgeStatus);
  const setBridgeStatus = useAppStore((s) => s.setBridgeStatus);

  const testConnection = async () => {
    setBridgeStatus('checking');
    const ok = await checkOscStatus(settings.murphyApiHost, settings.murphyApiPort);
    setBridgeStatus(ok ? 'connected' : 'disconnected');
  };

  useEffect(() => {
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backendHint: Record<string, string> = {
    local: 'Runs on Mac Mini — fast, offline, zero cost.',
    cloud: 'Calls Anthropic — requires internet and API key.',
    hybrid: 'Local first, cloud fallback on low confidence.',
  };

  return (
    <div className="space-y-4 p-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {/* Murphy API */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Murphy API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Host</Label>
            <Input
              value={settings.murphyApiHost}
              onChange={(e) => setSettings({ ...settings, murphyApiHost: e.target.value })}
              placeholder="192.168.1.x or murphy.local"
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label>Port</Label>
            <Input
              type="number"
              value={settings.murphyApiPort}
              onChange={(e) => setSettings({ ...settings, murphyApiPort: +e.target.value })}
              className="text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* X32 Bridge + Mixer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            X32 Bridge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>X32 IP</Label>
              <Input
                value={mixer.ip}
                onChange={(e) => setMixer({ ...mixer, ip: e.target.value })}
                placeholder="192.168.1.x"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label>X32 Port</Label>
              <Input
                type="number"
                value={mixer.port}
                onChange={(e) => setMixer({ ...mixer, port: +e.target.value })}
                className="text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={mixer.model}
                onChange={(e) => setMixer({ ...mixer, model: e.target.value })}
                placeholder="X32"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label>Protocol</Label>
              <Select
                value={mixer.osc_protocol}
                onValueChange={(v) =>
                  setMixer({ ...mixer, osc_protocol: v as 'udp' | 'tcp' })
                }
              >
                <SelectTrigger className="min-h-[44px] text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionBadge status={bridgeStatus} />
            <Button
              variant="secondary"
              size="sm"
              onClick={testConnection}
              className="min-h-[44px]"
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inference Backend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Inference Backend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleGroup
            type="single"
            value={settings.inferenceBackend}
            onValueChange={(v) => {
              if (v) setSettings({ ...settings, inferenceBackend: v as typeof settings.inferenceBackend });
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="local" className="min-h-[44px]">
              Local
            </ToggleGroupItem>
            <ToggleGroupItem value="cloud" className="min-h-[44px]">
              Cloud
            </ToggleGroupItem>
            <ToggleGroupItem value="hybrid" className="min-h-[44px]">
              Hybrid
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">
            {backendHint[settings.inferenceBackend]}
          </p>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
            Anthropic API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={settings.anthropicApiKey}
              onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
              placeholder="sk-ant-..."
              className="text-base"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Required for Cloud and Hybrid modes.
          </p>
        </CardContent>
      </Card>

      <VenuesCard />
      <BandsCard />
    </div>
  );
}
