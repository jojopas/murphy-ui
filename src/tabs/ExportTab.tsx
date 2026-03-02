import { useState } from 'react';
import type { MurphyConfig } from '../types';

interface Props {
  config: MurphyConfig;
}

export function ExportTab({ config }: Props) {
  const [host, setHost] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const effectiveHost = host || config.mixer.ip || 'localhost';
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
        setStatus({ ok: true, msg: `✓ Pushed to ${effectiveHost} — ${res.status} ${res.statusText}` });
      } else {
        setStatus({ ok: false, msg: `✗ Server returned ${res.status} ${res.statusText}` });
      }
    } catch (err) {
      setStatus({ ok: false, msg: `✗ ${err instanceof Error ? err.message : String(err)}` });
    }
  };

  return (
    <div className="tab-panel">
      <h2>Export</h2>
      <div className="export-actions">
        <button className="btn-accent" onClick={download}>⬇ Download config.json</button>
      </div>
      <div className="push-row">
        <label>Murphy Host
          <input
            value={host}
            onChange={e => setHost(e.target.value)}
            placeholder={config.mixer.ip || 'e.g. 192.168.1.50'}
          />
        </label>
        <button className="btn-accent" onClick={push}>▶ Push to Murphy</button>
      </div>
      {status && (
        <div className={`banner ${status.ok ? 'banner-ok' : 'banner-err'}`}>{status.msg}</div>
      )}
      <h3>Config Preview</h3>
      <pre className="json-preview">{json}</pre>
    </div>
  );
}
