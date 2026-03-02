import type { MixerConfig, OscProtocol } from '../types';

interface Props {
  mixer: MixerConfig;
  setMixer: (mixer: MixerConfig) => void;
}

export function MixerTab({ mixer, setMixer }: Props) {
  const update = <K extends keyof MixerConfig>(field: K, value: MixerConfig[K]) =>
    setMixer({ ...mixer, [field]: value });

  return (
    <div className="tab-panel">
      <h2>Mixer</h2>
      <div className="form-grid">
        <label>Model
          <input value={mixer.model} onChange={e => update('model', e.target.value)} placeholder="X32" />
        </label>
        <label>IP Address
          <input value={mixer.ip} onChange={e => update('ip', e.target.value)} placeholder="192.168.1.x" />
        </label>
        <label>Port
          <input type="number" value={mixer.port} onChange={e => update('port', parseInt(e.target.value) || 10023)} />
        </label>
        <label>OSC Protocol
          <select value={mixer.osc_protocol} onChange={e => update('osc_protocol', e.target.value as OscProtocol)}>
            <option value="udp">UDP</option>
            <option value="tcp">TCP</option>
          </select>
        </label>
      </div>
    </div>
  );
}
