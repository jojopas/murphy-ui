const BASE = (host: string, port: number) => `http://${host}:${port}`;

export async function checkOscStatus(host: string, port: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE(host, port)}/api/osc/status`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendChat(
  host: string,
  port: number,
  message: string,
  channelContext?: object
): Promise<{ reply: string; osc_commands: string[]; confidence: string; path: string }> {
  const res = await fetch(`${BASE(host, port)}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, channel_context: channelContext }),
  });
  if (!res.ok) throw new Error(`Murphy API error: ${res.status}`);
  return res.json();
}

export async function sendOsc(host: string, port: number, commands: string[]): Promise<void> {
  await fetch(`${BASE(host, port)}/api/osc/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });
}

export async function uploadScene(host: string, port: number, file: File): Promise<{ channels: object[] }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE(host, port)}/api/upload/scene`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Scene upload failed');
  return res.json();
}

export async function uploadInputList(host: string, port: number, file: File): Promise<{ channels: object[] }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE(host, port)}/api/upload/inputlist`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Input list upload failed');
  return res.json();
}

// --- Shows CRUD ---

import type { Show, Venue, Band, ChannelConfig } from '@/lib/types';

export async function fetchShows(host: string, port: number): Promise<Show[]> {
  const res = await fetch(`${BASE(host, port)}/api/shows`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Failed to fetch shows: ${res.status}`);
  return res.json();
}

export async function fetchShow(host: string, port: number, id: number): Promise<{ show: Show; channels: ChannelConfig[] }> {
  const res = await fetch(`${BASE(host, port)}/api/shows/${id}`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Failed to fetch show ${id}: ${res.status}`);
  return res.json();
}

export async function deleteShow(host: string, port: number, id: number): Promise<void> {
  const res = await fetch(`${BASE(host, port)}/api/shows/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete show ${id}: ${res.status}`);
}

// --- Venues CRUD ---

export async function fetchVenues(host: string, port: number): Promise<Venue[]> {
  const res = await fetch(`${BASE(host, port)}/api/venues`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Failed to fetch venues: ${res.status}`);
  return res.json();
}

export async function createVenue(host: string, port: number, data: Omit<Venue, 'id'>): Promise<Venue> {
  const res = await fetch(`${BASE(host, port)}/api/venues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create venue: ${res.status}`);
  return res.json();
}

export async function deleteVenue(host: string, port: number, id: number): Promise<void> {
  const res = await fetch(`${BASE(host, port)}/api/venues/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete venue ${id}: ${res.status}`);
}

// --- Bands CRUD ---

export async function fetchBands(host: string, port: number): Promise<Band[]> {
  const res = await fetch(`${BASE(host, port)}/api/bands`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Failed to fetch bands: ${res.status}`);
  return res.json();
}

export async function createBand(host: string, port: number, data: Omit<Band, 'id'>): Promise<Band> {
  const res = await fetch(`${BASE(host, port)}/api/bands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create band: ${res.status}`);
  return res.json();
}

// --- Channel Overrides ---

export async function postChannelOverride(
  host: string,
  port: number,
  channelId: number,
  data: { param_type: string; ai_value: string; engineer_value: string; reason?: string }
): Promise<void> {
  const res = await fetch(`${BASE(host, port)}/api/channels/${channelId}/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to post channel override: ${res.status}`);
}
