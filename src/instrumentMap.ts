export const INSTRUMENT_MAP: Record<string, { color: string; template: string; group: string }> = {
  kick: { color: 'RED', template: 'kick', group: 'drums' },
  snare: { color: 'RED', template: 'snare', group: 'drums' },
  hihat: { color: 'RED', template: 'hihat', group: 'drums' },
  toms: { color: 'RED', template: 'toms', group: 'drums' },
  bass: { color: 'YELLOW', template: 'bass', group: 'bass' },
  guitar: { color: 'GREEN', template: 'guitar', group: 'guitar' },
  keys: { color: 'CYAN', template: 'keys', group: 'keys' },
  vocal: { color: 'BLUE', template: 'vocal', group: 'vocals' },
  bgv: { color: 'BLUE', template: 'bgv', group: 'vocals' },
  perc: { color: 'MAGENTA', template: 'perc', group: 'perc' },
  other: { color: 'WHITE', template: 'default', group: 'misc' },
};
