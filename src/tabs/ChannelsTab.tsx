import type { Channel } from '../types';
import { INSTRUMENT_MAP } from '../instrumentMap';

interface Props {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
}

const INSTRUMENTS = Object.keys(INSTRUMENT_MAP);

function newChannel(ch: number): Channel {
  return {
    ch,
    name: '',
    instrument: 'other',
    mic: '',
    color: 'WHITE',
    phantom: false,
    gain_db: 0,
    group: 'misc',
    bus_sends: [],
    template: 'default',
    muted: false,
  };
}

export function ChannelsTab({ channels, setChannels }: Props) {
  const update = (idx: number, field: keyof Channel, value: Channel[keyof Channel]) => {
    const updated = channels.map((ch, i) => {
      if (i !== idx) return ch;
      if (field === 'instrument') {
        const inst = value as string;
        const map = INSTRUMENT_MAP[inst] || INSTRUMENT_MAP['other'];
        return { ...ch, instrument: inst, color: map.color, template: map.template, group: map.group };
      }
      return { ...ch, [field]: value };
    });
    setChannels(updated);
  };

  const addChannel = () => {
    const ch = channels.length > 0 ? Math.max(...channels.map(c => c.ch)) + 1 : 1;
    setChannels([...channels, newChannel(ch)]);
  };

  const removeChannel = (idx: number) => setChannels(channels.filter((_, i) => i !== idx));

  return (
    <div className="tab-panel">
      <div className="tab-header">
        <h2>Channels</h2>
        <button className="btn-accent" onClick={addChannel}>+ Add Channel</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ch#</th>
              <th>Name</th>
              <th>Instrument</th>
              <th>Mic</th>
              <th>Phantom</th>
              <th>Gain dB</th>
              <th>Group</th>
              <th>Bus Sends</th>
              <th>Muted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch, i) => (
              <tr key={i}>
                <td>
                  <input type="number" value={ch.ch} style={{ width: 50 }}
                    onChange={e => update(i, 'ch', parseInt(e.target.value) || 1)} />
                </td>
                <td>
                  <input value={ch.name} placeholder="Name"
                    onChange={e => update(i, 'name', e.target.value)} />
                </td>
                <td>
                  <select value={ch.instrument} onChange={e => update(i, 'instrument', e.target.value)}>
                    {INSTRUMENTS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                  </select>
                </td>
                <td>
                  <input value={ch.mic} placeholder="Mic model"
                    onChange={e => update(i, 'mic', e.target.value)} />
                </td>
                <td className="center">
                  <input type="checkbox" checked={ch.phantom}
                    onChange={e => update(i, 'phantom', e.target.checked)} />
                </td>
                <td>
                  <input type="number" min={-20} max={80} value={ch.gain_db} style={{ width: 60 }}
                    onChange={e => update(i, 'gain_db', parseInt(e.target.value) || 0)} />
                </td>
                <td>
                  <input value={ch.group}
                    onChange={e => update(i, 'group', e.target.value)} />
                </td>
                <td>
                  <input value={ch.bus_sends.join(',')} placeholder="bus1,bus2"
                    onChange={e => update(i, 'bus_sends', e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])} />
                </td>
                <td className="center">
                  <input type="checkbox" checked={ch.muted}
                    onChange={e => update(i, 'muted', e.target.checked)} />
                </td>
                <td>
                  <button className="btn-remove" onClick={() => removeChannel(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {channels.length === 0 && <p className="empty">No channels. Click + Add Channel.</p>}
      </div>
    </div>
  );
}
