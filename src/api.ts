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
