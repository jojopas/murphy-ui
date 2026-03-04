import { create } from 'zustand';
import type {
  ShowConfig,
  MixerConfig,
  ChannelConfig,
  BusConfig,
  SettingsConfig,
  ChatMessage,
  ApproveMode,
  OscBridgeStatus,
  TabId,
  EventLogEntry,
  OscHistoryEntry,
  Show,
  Venue,
  Band,
} from '@/lib/types';

interface AppState {
  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Config — Show
  show: ShowConfig;
  setShow: (show: ShowConfig) => void;

  // Config — Mixer
  mixer: MixerConfig;
  setMixer: (mixer: MixerConfig) => void;

  // Config — Channels
  channels: ChannelConfig[];
  setChannels: (channels: ChannelConfig[]) => void;

  // Config — Buses
  buses: BusConfig[];
  setBuses: (buses: BusConfig[]) => void;

  // Config — Settings
  settings: SettingsConfig;
  setSettings: (settings: SettingsConfig) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
  approveMode: ApproveMode;
  setApproveMode: (mode: ApproveMode) => void;
  chatLoading: boolean;
  setChatLoading: (loading: boolean) => void;

  // Bridge
  bridgeStatus: OscBridgeStatus;
  setBridgeStatus: (status: OscBridgeStatus) => void;

  // Event Log
  eventLog: EventLogEntry[];
  addEvent: (entry: Omit<EventLogEntry, 'id' | 'timestamp'>) => void;
  eventLogOpen: boolean;
  setEventLogOpen: (open: boolean) => void;

  // OSC History (for undo)
  oscHistory: OscHistoryEntry[];
  pushOscHistory: (entry: Omit<OscHistoryEntry, 'id' | 'timestamp'>) => void;
  popOscHistory: () => OscHistoryEntry | undefined;

  // Shows list
  shows: Show[];
  setShows: (shows: Show[]) => void;
  activeShowId: number | null;
  setActiveShowId: (id: number | null) => void;
  showsLoading: boolean;
  setShowsLoading: (loading: boolean) => void;

  // Venues & Bands
  venues: Venue[];
  setVenues: (venues: Venue[]) => void;
  venuesLoading: boolean;
  setVenuesLoading: (loading: boolean) => void;
  bands: Band[];
  setBands: (bands: Band[]) => void;
  bandsLoading: boolean;
  setBandsLoading: (loading: boolean) => void;

  // Override tracking
  channelSource: 'ai' | 'manual' | 'scene' | null;
  setChannelSource: (source: 'ai' | 'manual' | 'scene' | null) => void;
  overriddenChannels: Set<number>;
  markOverridden: (ch: number) => void;
  clearOverrides: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTab: 'chat',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Config — Show
  show: { name: '', date: '', venue: '', notes: '' },
  setShow: (show) => set({ show }),

  // Config — Mixer
  mixer: { model: 'X32', ip: '', port: 10023, osc_protocol: 'udp' },
  setMixer: (mixer) => set({ mixer }),

  // Config — Channels
  channels: [],
  setChannels: (channels) => set({ channels }),

  // Config — Buses
  buses: [
    { bus: 1, name: 'Drum Bus', id: 'drum_bus' },
    { bus: 2, name: 'Guitar Bus', id: 'guitar_bus' },
    { bus: 3, name: 'Vox Bus', id: 'vox_bus' },
    { bus: 4, name: 'Main LR', id: 'main_lr' },
  ],
  setBuses: (buses) => set({ buses }),

  // Config — Settings
  settings: {
    anthropicApiKey: '',
    inferenceBackend: 'cloud',
    murphyApiHost: 'murphy.local',
    murphyApiPort: 8765,
  },
  setSettings: (settings) => set({ settings }),

  // Chat
  messages: [
    {
      id: '0',
      role: 'murphy',
      text: "Ready. Tell me what you're hearing.",
      timestamp: Date.now(),
      status: 'fired',
    },
  ],
  addMessage: (msg) => {
    const id = Date.now().toString();
    set((s) => ({
      messages: [...s.messages, { ...msg, id, timestamp: Date.now() }],
    }));
    return id;
  },
  updateMessage: (id, patch) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  approveMode: 'approve',
  setApproveMode: (mode) => set({ approveMode: mode }),
  chatLoading: false,
  setChatLoading: (loading) => set({ chatLoading: loading }),

  // Bridge
  bridgeStatus: 'checking',
  setBridgeStatus: (status) => set({ bridgeStatus: status }),

  // Event Log
  eventLog: [],
  addEvent: (entry) =>
    set((s) => ({
      eventLog: [
        ...s.eventLog,
        { ...entry, id: Date.now().toString(), timestamp: Date.now() },
      ],
    })),
  eventLogOpen: false,
  setEventLogOpen: (open) => set({ eventLogOpen: open }),

  // OSC History
  oscHistory: [],
  pushOscHistory: (entry) =>
    set((s) => ({
      oscHistory: [
        ...s.oscHistory,
        { ...entry, id: Date.now().toString(), timestamp: Date.now() },
      ],
    })),
  popOscHistory: () => {
    const history = get().oscHistory;
    if (history.length === 0) return undefined;
    const last = history[history.length - 1];
    set({ oscHistory: history.slice(0, -1) });
    return last;
  },

  // Shows list
  shows: [],
  setShows: (shows) => set({ shows }),
  activeShowId: null,
  setActiveShowId: (id) => set({ activeShowId: id }),
  showsLoading: false,
  setShowsLoading: (loading) => set({ showsLoading: loading }),

  // Venues & Bands
  venues: [],
  setVenues: (venues) => set({ venues }),
  venuesLoading: false,
  setVenuesLoading: (loading) => set({ venuesLoading: loading }),
  bands: [],
  setBands: (bands) => set({ bands }),
  bandsLoading: false,
  setBandsLoading: (loading) => set({ bandsLoading: loading }),

  // Override tracking
  channelSource: null,
  setChannelSource: (source) => set({ channelSource: source }),
  overriddenChannels: new Set<number>(),
  markOverridden: (ch) =>
    set((s) => ({ overriddenChannels: new Set(s.overriddenChannels).add(ch) })),
  clearOverrides: () => set({ overriddenChannels: new Set<number>() }),
}));
