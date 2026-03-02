import { useState, useEffect } from 'react';
import type { SettingsConfig, MixerConfig, OscBridgeStatus } from '../types';
import { checkOscStatus } from '../api';

interface Props {
  settings: SettingsConfig;
  setSettings: (s: SettingsConfig) => void;
  mixer: MixerConfig;
  setMixer: (m: MixerConfig) => void;
}

export function SettingsTab({ settings, setSettings, mixer, setMixer }: Props) {
  const [bridgeStatus, setBridgeStatus] = useState<OscBridgeStatus>('checking');

  const testConnection = async () => {
    setBridgeStatus('checking');
    const ok = await checkOscStatus(settings.murphyApiHost, settings.murphyApiPort);
    setBridgeStatus(ok ? 'connected' : 'disconnected');
  };

  useEffect(() => { testConnection(); }, []);

  const statusColor = bridgeStatus === 'connected' ? '#4ade80' : bridgeStatus === 'checking' ? '#facc15' : '#f87171';
  const statusLabel = bridgeStatus === 'connected' ? '● Connected' : bridgeStatus === 'checking' ? '◌ Checking...' : '○ Disconnected';

  return (
    <div className="tab-section">
      <h2>Settings</h2>

      <section className="settings-group">
        <h3>Murphy API</h3>
        <label>Host
          <input value={settings.murphyApiHost} onChange={e => setSettings({ ...settings, murphyApiHost: e.target.value })} placeholder="192.168.1.x or murphy.local" />
        </label>
        <label>Port
          <input type="number" value={settings.murphyApiPort} onChange={e => setSettings({ ...settings, murphyApiPort: +e.target.value })} />
        </label>
      </section>

      <section className="settings-group">
        <h3>X32 OSC Bridge</h3>
        <label>X32 IP
          <input value={mixer.ip} onChange={e => setMixer({ ...mixer, ip: e.target.value })} placeholder="192.168.1.x" />
        </label>
        <label>X32 Port
          <input type="number" value={mixer.port} onChange={e => setMixer({ ...mixer, port: +e.target.value })} />
        </label>
        <div className="bridge-status">
          <span style={{ color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
          <button className="btn-secondary" onClick={testConnection}>Test Connection</button>
        </div>
      </section>

      <section className="settings-group">
        <h3>Inference Backend</h3>
        <div className="backend-toggle">
          {(['local', 'cloud', 'hybrid'] as const).map(b => (
            <button key={b} className={`toggle-btn ${settings.inferenceBackend === b ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, inferenceBackend: b })}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </button>
          ))}
        </div>
        <p className="hint">
          {settings.inferenceBackend === 'local' && 'Runs on Mac Mini — fast, offline, zero cost.'}
          {settings.inferenceBackend === 'cloud' && 'Calls Anthropic — requires internet and API key.'}
          {settings.inferenceBackend === 'hybrid' && 'Local first, cloud fallback on low confidence.'}
        </p>
      </section>

      <section className="settings-group">
        <h3>Anthropic API Key</h3>
        <label>API Key
          <input type="password" value={settings.anthropicApiKey}
            onChange={e => setSettings({ ...settings, anthropicApiKey: e.target.value })}
            placeholder="sk-ant-..." />
        </label>
        <p className="hint">Required for Cloud and Hybrid modes.</p>
      </section>
    </div>
  );
}
