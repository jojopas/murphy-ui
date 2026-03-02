import { useRef } from 'react';
import type { ShowConfig, ChannelConfig, SettingsConfig } from '../types';
import { uploadScene, uploadInputList } from '../api';

interface Props {
  show: ShowConfig;
  setShow: (s: ShowConfig) => void;
  channels: ChannelConfig[];
  setChannels: (c: ChannelConfig[]) => void;
  settings: SettingsConfig;
}

export function ShowTab({ show, setShow, channels, setChannels, settings }: Props) {
  const scnRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const handleScnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadScene(settings.murphyApiHost, settings.murphyApiPort, file);
      if (data.channels) setChannels(data.channels as ChannelConfig[]);
      alert(`Scene loaded — ${data.channels?.length || 0} channels imported.`);
    } catch {
      alert('Scene upload failed. Check that the Murphy API is running.');
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadInputList(settings.murphyApiHost, settings.murphyApiPort, file);
      if (data.channels) setChannels(data.channels as ChannelConfig[]);
      alert(`Input list loaded — ${data.channels?.length || 0} channels imported.`);
    } catch {
      alert('Input list upload failed. Check that the Murphy API is running.');
    }
  };

  return (
    <div className="tab-section">
      <h2>Show Setup</h2>

      <section className="settings-group">
        <h3>Show Info</h3>
        <label>Band / Show Name
          <input value={show.name} onChange={e => setShow({ ...show, name: e.target.value })} placeholder="Yaleo Santana" />
        </label>
        <label>Date
          <input type="date" value={show.date} onChange={e => setShow({ ...show, date: e.target.value })} />
        </label>
        <label>Venue
          <input value={show.venue} onChange={e => setShow({ ...show, venue: e.target.value })} placeholder="Venue name" />
        </label>
        <label>Notes
          <textarea value={show.notes} onChange={e => setShow({ ...show, notes: e.target.value })} rows={3} placeholder="Stage notes, special instructions..." />
        </label>
      </section>

      <section className="settings-group">
        <h3>Load from Console</h3>
        <div className="upload-row">
          <div className="upload-card" onClick={() => scnRef.current?.click()}>
            <div className="upload-icon">📁</div>
            <div className="upload-label">Upload .scn Scene File</div>
            <div className="upload-hint">Imports EQ, dynamics, channel names from X32 scene</div>
            <input ref={scnRef} type="file" accept=".scn" style={{ display: 'none' }} onChange={handleScnUpload} />
          </div>
          <div className="upload-card" onClick={() => csvRef.current?.click()}>
            <div className="upload-icon">📋</div>
            <div className="upload-label">Upload Input List</div>
            <div className="upload-hint">CSV with channel numbers, names, instruments</div>
            <input ref={csvRef} type="file" accept=".csv,.json" style={{ display: 'none' }} onChange={handleCsvUpload} />
          </div>
        </div>
        {channels.length > 0 && (
          <p className="hint success">✓ {channels.length} channels loaded</p>
        )}
      </section>
    </div>
  );
}
