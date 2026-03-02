import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, ApproveMode, OscBridgeStatus, SettingsConfig } from '../types';
import { sendChat, sendOsc, checkOscStatus } from '../api';

interface Props {
  settings: SettingsConfig;
}

export function ChatTab({ settings }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0', role: 'murphy', text: "Ready. Tell me what you're hearing.",
      timestamp: Date.now(), status: 'fired'
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ApproveMode>('approve');
  const [bridgeStatus, setBridgeStatus] = useState<OscBridgeStatus>('checking');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkOscStatus(settings.murphyApiHost, settings.murphyApiPort)
      .then(ok => setBridgeStatus(ok ? 'connected' : 'disconnected'));
  }, [settings.murphyApiHost, settings.murphyApiPort]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const full: ChatMessage = { ...msg, id: Date.now().toString(), timestamp: Date.now() };
    setMessages(prev => [...prev, full]);
    return full;
  };

  const fireOsc = async (commands: string[], msgId: string) => {
    await sendOsc(settings.murphyApiHost, settings.murphyApiPort, commands);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'fired' } : m));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    addMessage({ role: 'user', text, status: 'fired' });
    setLoading(true);

    try {
      const data = await sendChat(settings.murphyApiHost, settings.murphyApiPort, text);
      const msgId = Date.now().toString();
      const murphyMsg: ChatMessage = {
        id: msgId,
        role: 'murphy',
        text: data.reply,
        oscCommands: data.osc_commands,
        confidence: data.confidence as any,
        path: data.path as any,
        status: mode === 'auto' ? 'fired' : 'pending',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, murphyMsg]);

      if (mode === 'auto' && data.osc_commands?.length) {
        await fireOsc(data.osc_commands, msgId);
      }
    } catch (err) {
      addMessage({ role: 'murphy', text: `⚠️ Error: ${(err as Error).message}`, status: 'fired' });
    } finally {
      setLoading(false);
    }
  };

  const approve = async (msg: ChatMessage) => {
    if (msg.oscCommands?.length) await fireOsc(msg.oscCommands, msg.id);
    else setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'approved' } : m));
  };

  const skip = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'skipped' } : m));
  };

  const bridgeColor = bridgeStatus === 'connected' ? '#4ade80' : bridgeStatus === 'checking' ? '#facc15' : '#f87171';

  return (
    <div className="chat-container">
      {/* Header bar */}
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="bridge-dot" style={{ background: bridgeColor }} />
          <span className="bridge-label">
            {bridgeStatus === 'connected' ? 'X32 Connected' : bridgeStatus === 'checking' ? 'Checking...' : 'X32 Disconnected'}
          </span>
        </div>
        <div className="mode-toggle">
          <span className="mode-label">Mode:</span>
          <button className={`toggle-btn ${mode === 'approve' ? 'active' : ''}`} onClick={() => setMode('approve')}>Approve</button>
          <button className={`toggle-btn ${mode === 'auto' ? 'active' : ''}`} onClick={() => setMode('auto')}>Auto</button>
        </div>
      </div>

      {/* Bridge warning */}
      {bridgeStatus === 'disconnected' && (
        <div className="bridge-warning">⚠️ X32 bridge offline — Murphy can suggest fixes but won't fire OSC. Check Settings.</div>
      )}

      {/* Message thread */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.role}`}>
            <div className="bubble-text">{msg.text}</div>

            {msg.oscCommands && msg.oscCommands.length > 0 && (
              <div className="osc-preview">
                <div className="osc-label">OSC Commands</div>
                {msg.oscCommands.map((cmd, i) => <code key={i}>{cmd}</code>)}
                {msg.path && <span className="path-badge">{msg.path}</span>}
              </div>
            )}

            {msg.role === 'murphy' && msg.status === 'pending' && (
              <div className="approve-actions">
                <button className="btn-approve" onClick={() => approve(msg)}>✓ Apply</button>
                <button className="btn-skip" onClick={() => skip(msg.id)}>✗ Skip</button>
              </div>
            )}

            {msg.status === 'fired' && msg.role === 'murphy' && msg.oscCommands?.length && (
              <div className="status-fired">✓ Applied</div>
            )}
            {msg.status === 'skipped' && <div className="status-skipped">Skipped</div>}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble murphy">
            <div className="bubble-text typing">Murphy is thinking<span className="dots">...</span></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Tell Murphy what you're hearing..."
          disabled={loading}
        />
        <button className="btn-send" onClick={handleSend} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
