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

export type TabId = 'chat' | 'show' | 'channels' | 'settings' | 'export';

export type EventSeverity = 'info' | 'warn' | 'error' | 'success';

export interface EventLogEntry {
  id: string;
  timestamp: number;
  severity: EventSeverity;
  message: string;
  channel?: number;
  oscPath?: string;
}

export interface OscHistoryEntry {
  id: string;
  timestamp: number;
  commands: string[];
  inverseCommands?: string[];
  description: string;
}

// DB entities (returned by API — have server-assigned id)
export interface Show {
  id: number;
  date: string;
  band: string;
  venue: string;
  room_type?: string;
  pa_system?: string;
  notes?: string;
  scn_path?: string;
  channel_count?: number;
}

export interface Venue {
  id: number;
  name: string;
  room_type?: string;
  capacity?: number;
  pa_system?: string;
  known_problem_freqs?: string;
}

export interface Band {
  id: number;
  name: string;
  genre?: string;
  notes?: string;
}
