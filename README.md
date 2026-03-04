# Murphy UI

Web interface for **Murphy** — an AI FOH (Front of House) Engineer that controls a Behringer X32 mixing console via OSC commands.

Built iPad-first for use at the mixing console during live shows.

## Stack

- **React 19** + TypeScript
- **Vite 7** with Tailwind CSS v4
- **shadcn/ui** (New York style, Radix primitives)
- **Zustand** for state management
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview production build
```

## Project Structure

```
src/
  components/
    ui/                 # shadcn auto-generated (button, card, input, etc.)
    layout/
      app-shell.tsx     # Root layout: top bar + content + bottom tab bar
      top-bar.tsx       # Logo, connection badge, undo, event log toggle
      bottom-tab-bar.tsx# 5-tab navigation with Lucide icons
    shared/
      connection-badge.tsx  # Green/yellow/red bridge status dot
      osc-command-block.tsx # OSC commands with X32 validation badges
      upload-card.tsx       # Dashed-border file upload target
  features/
    chat/
      chat-view.tsx     # Main chat screen (messages, input, mode toggle)
      chat-message.tsx  # Chat bubble with OSC preview + approve/skip
      chat-input.tsx    # Message input bar
    show/
      show-view.tsx     # Show info form + scene/input-list upload
    channels/
      channels-view.tsx # Expandable channel card list + bus section
      channel-card.tsx  # Single channel: compact & expanded views
      bus-section.tsx   # Bus list with add/remove
    settings/
      settings-view.tsx # Murphy API, X32 Bridge, inference, API key
    export/
      export-view.tsx   # Download config.json + push to Murphy API
    event-log/
      event-log-sheet.tsx   # Bottom sheet (50% height) with event entries
      event-log-entry.tsx   # Single log entry (timestamp, severity, message)
  store/
    index.ts            # Zustand store (config, chat, bridge, eventLog, oscHistory)
  lib/
    utils.ts            # cn() utility (clsx + tailwind-merge)
    api.ts              # Murphy API client (chat, OSC, upload, status)
    types.ts            # All TypeScript interfaces and types
    instrument-map.ts   # Instrument -> color/template/group mapping
    osc-validation.ts   # Validate OSC paths against X32 namespace
  App.tsx               # Root component (TooltipProvider + AppShell + EventLogSheet)
  main.tsx              # Entry point
  globals.css           # Tailwind base + dark theme CSS variables
```

## Features

### Chat
Talk to Murphy about what you're hearing. Murphy responds with OSC commands to adjust the mix. Two modes:
- **Approve** — review and approve/skip each command before it fires
- **Auto** — commands fire immediately

### Show Setup
Configure the show (band name, date, venue, notes) and upload X32 `.scn` scene files or CSV/JSON input lists to populate channels.

### Channels
Expandable card list for each channel. Compact view shows channel number, name, instrument, and mute status. Expand to edit mic, phantom, gain, group, bus sends. Bus section at the top for managing bus routing.

### Settings
- **Murphy API** — host and port for the Murphy backend
- **X32 Bridge** — IP, port, model, protocol, with connection test
- **Inference Backend** — toggle between Local, Cloud, or Hybrid
- **API Key** — Anthropic key for cloud/hybrid modes

### Export
Download the full config as JSON or push it directly to a running Murphy instance.

### Event Log
Bottom sheet accessible from the top bar. Shows timestamped, color-coded events (info, warn, error, success) as you interact with Murphy.

### Undo
Undo button in the top bar with confirmation dialog. Pops the last OSC action from history and sends inverse commands when available.

### OSC Validation
Each OSC command is validated against known X32 path prefixes (`/ch/`, `/bus/`, `/main/`, `/dca/`, etc.) and shown with a green check or red X.

## Design Decisions

- **Dark mode only** — pro-audio aesthetic, always dark at FOH
- **Bottom tab bar** — iPad at FOH means thumbs near the bottom, follows iOS conventions
- **Channels as expandable cards** — touch-friendly vs tiny table cells
- **Buses merged into Channels view** — related editing surfaces
- **Mixer config merged into Settings** — was an orphaned tab
- **44px touch targets** on all interactive elements (Apple HIG)
- **16px font on inputs** to prevent iOS Safari zoom
- **Safe area padding** for iPad home indicator and notch

## iPad Usage

Add to Home Screen for a full-screen app experience. The viewport is configured with `viewport-fit=cover` and `apple-mobile-web-app-capable` for standalone mode. All touch targets meet the 44px minimum and inputs use 16px font to prevent Safari's auto-zoom.
