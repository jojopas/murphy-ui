import { useState } from 'react';
import type { MurphyConfig } from './types';
import { ShowTab } from './tabs/ShowTab';
import { MixerTab } from './tabs/MixerTab';
import { ChannelsTab } from './tabs/ChannelsTab';
import { BusesTab } from './tabs/BusesTab';
import { ExportTab } from './tabs/ExportTab';
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
};

const TABS = ['Show', 'Mixer', 'Channels', 'Buses', 'Export'] as const;
type Tab = typeof TABS[number];

export default function App() {
  const [config, setConfig] = useState<MurphyConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>('Show');

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">🎛 Murphy Config UI</span>
      </header>
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <main className="main-content">
        {activeTab === 'Show' && (
          <ShowTab show={config.show} setShow={show => setConfig({ ...config, show })} />
        )}
        {activeTab === 'Mixer' && (
          <MixerTab mixer={config.mixer} setMixer={mixer => setConfig({ ...config, mixer })} />
        )}
        {activeTab === 'Channels' && (
          <ChannelsTab channels={config.channels} setChannels={channels => setConfig({ ...config, channels })} />
        )}
        {activeTab === 'Buses' && (
          <BusesTab buses={config.buses} setBuses={buses => setConfig({ ...config, buses })} />
        )}
        {activeTab === 'Export' && (
          <ExportTab config={config} />
        )}
      </main>
    </div>
  );
}
