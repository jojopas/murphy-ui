export type OscProtocol = 'udp' | 'tcp';

export interface ShowConfig {
  name: string;
  date: string;
  venue: string;
  notes: string;
}

export interface MixerConfig {
  model: string;
  ip: string;
  port: number;
  osc_protocol: OscProtocol;
}

export interface Channel {
  ch: number;
  name: string;
  instrument: string;
  mic: string;
  color: string;
  phantom: boolean;
  gain_db: number;
  group: string;
  bus_sends: string[];
  template: string;
  muted: boolean;
}

export interface Bus {
  bus: number;
  name: string;
  id: string;
}

export interface MurphyConfig {
  show: ShowConfig;
  mixer: MixerConfig;
  channels: Channel[];
  buses: Bus[];
}
