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
  osc_protocol: 'udp' | 'tcp';
}

export interface ChannelConfig {
  ch: number;
  name: string;
  instrument: string;
  active?: boolean;
  mic?: string;
  phantom?: boolean;
  gain_db?: number;
  group?: string;
  bus_sends?: string[];
  muted?: boolean;
  color?: string;
  template?: string;
}

export interface BusConfig {
  bus: number;
  name: string;
  id: string;
}

export interface SettingsConfig {
  anthropicApiKey: string;
  inferenceBackend: 'local' | 'cloud' | 'hybrid';
  murphyApiHost: string;
  murphyApiPort: number;
}

export interface MurphyConfig {
  show: ShowConfig;
  mixer: MixerConfig;
  channels: ChannelConfig[];
  buses: BusConfig[];
  settings: SettingsConfig;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'murphy';
  text: string;
  oscCommands?: string[];
  confidence?: 'high' | 'medium' | 'low';
  path?: 'fast' | 'slow';
  status?: 'pending' | 'approved' | 'skipped' | 'fired';
  timestamp: number;
}

export type ApproveMode = 'auto' | 'approve';
export type OscBridgeStatus = 'connected' | 'disconnected' | 'checking';

// Legacy aliases
export type Bus = BusConfig;
export type Channel = ChannelConfig;
export type OscProtocol = 'udp' | 'tcp';
