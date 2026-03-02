import type { ShowConfig } from '../types';

interface Props {
  show: ShowConfig;
  setShow: (show: ShowConfig) => void;
}

export function ShowTab({ show, setShow }: Props) {
  const update = (field: keyof ShowConfig, value: string) =>
    setShow({ ...show, [field]: value });

  return (
    <div className="tab-panel">
      <h2>Show</h2>
      <div className="form-grid">
        <label>Show Name
          <input value={show.name} onChange={e => update('name', e.target.value)} placeholder="Show name" />
        </label>
        <label>Date
          <input type="date" value={show.date} onChange={e => update('date', e.target.value)} />
        </label>
        <label>Venue
          <input value={show.venue} onChange={e => update('venue', e.target.value)} placeholder="Venue" />
        </label>
        <label className="full-width">Notes
          <textarea rows={4} value={show.notes} onChange={e => update('notes', e.target.value)} placeholder="Notes..." />
        </label>
      </div>
    </div>
  );
}
