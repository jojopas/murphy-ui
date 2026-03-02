import { useState } from 'react';
import type { MurphyConfig } from './types';
import { ShowTab } from './tabs/ShowTab';
import { ChannelsTab } from './tabs/ChannelsTab';
import { BusesTab } from './tabs/BusesTab';
import { ExportTab } from './tabs/ExportTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ChatTab } from './tabs/ChatTab';
import './App.css';

const DEFAULT_CONFIG: MurphyConfig = {
  show: { name: '', date: '', venue: '', notes: '' },
  mixer: { model: 'X32', ip: '', port: 10023, osc_protocol: 'udp' },
  channels: [],
  buses: [
    { bus: 1, name: 'Drum Bus', id: 'drum_bus' },
    { bus: 2, name: 'Guitar Bus', id: 'guitar_bus' },
    { bus: 3, name: 'Vox Bus', id: 'vox_bus' },
    { bus: 4, name: 'Main LR', id: 'main_lr' },
  ],
  settings: {
    anthropicApiKey: '',
    inferenceBackend: 'cloud',
    murphyApiHost: 'murphy.local',
    murphyApiPort: 8765,
  },
};

const TABS = ['Murphy', 'Show', 'Channels', 'Buses', 'Settings', 'Export'] as const;
type Tab = typeof TABS[number];

export default function App() {
  const [config, setConfig] = useState<MurphyConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>('Murphy');

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">🎛 Murphy</span>
        <span className="logo-sub">AI FOH Engineer</span>
      </header>
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Murphy' ? '💬 Murphy' : tab}
          </button>
        ))}
      </nav>
      <main className="main-content">
        {activeTab === 'Murphy' && <ChatTab settings={config.settings} />}
        {activeTab === 'Show' && (
          <ShowTab
            show={config.show}
            setShow={show => setConfig({ ...config, show })}
            channels={config.channels}
            setChannels={channels => setConfig({ ...config, channels })}
            settings={config.settings}
          />
        )}
        {activeTab === 'Channels' && (
          <ChannelsTab channels={config.channels} setChannels={channels => setConfig({ ...config, channels })} />
        )}
        {activeTab === 'Buses' && (
          <BusesTab buses={config.buses} setBuses={buses => setConfig({ ...config, buses })} />
        )}
        {activeTab === 'Settings' && (
          <SettingsTab
            settings={config.settings}
            setSettings={settings => setConfig({ ...config, settings })}
            mixer={config.mixer}
            setMixer={mixer => setConfig({ ...config, mixer })}
          />
        )}
        {activeTab === 'Export' && <ExportTab config={config} />}
      </main>
    </div>
  );
}
