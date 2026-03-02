import type { Bus } from '../types';

interface Props {
  buses: Bus[];
  setBuses: (buses: Bus[]) => void;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function newBus(bus: number): Bus {
  return { bus, name: '', id: '' };
}

export function BusesTab({ buses, setBuses }: Props) {
  const update = (idx: number, field: keyof Bus, value: string | number) => {
    const updated = buses.map((b, i) => {
      if (i !== idx) return b;
      if (field === 'name') {
        return { ...b, name: value as string, id: slugify(value as string) };
      }
      return { ...b, [field]: value };
    });
    setBuses(updated);
  };

  const addBus = () => {
    const num = buses.length > 0 ? Math.max(...buses.map(b => b.bus)) + 1 : 1;
    setBuses([...buses, newBus(num)]);
  };

  const removeBus = (idx: number) => setBuses(buses.filter((_, i) => i !== idx));

  return (
    <div className="tab-panel">
      <div className="tab-header">
        <h2>Buses</h2>
        <button className="btn-accent" onClick={addBus}>+ Add Bus</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bus #</th>
              <th>Name</th>
              <th>ID (slug)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b, i) => (
              <tr key={i}>
                <td>
                  <input type="number" value={b.bus} style={{ width: 60 }}
                    onChange={e => update(i, 'bus', parseInt(e.target.value) || 1)} />
                </td>
                <td>
                  <input value={b.name} placeholder="Bus name"
                    onChange={e => update(i, 'name', e.target.value)} />
                </td>
                <td>
                  <input value={b.id} placeholder="auto-slug"
                    onChange={e => update(i, 'id', e.target.value)} />
                </td>
                <td>
                  <button className="btn-remove" onClick={() => removeBus(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && <p className="empty">No buses. Click + Add Bus.</p>}
      </div>
    </div>
  );
}
