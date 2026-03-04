import { useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConnectionBadge } from '@/components/shared/connection-badge';
import { ChatMessageBubble } from './chat-message';
import { ChatInput } from './chat-input';
import { useAppStore } from '@/store';
import { sendChat, sendOsc, checkOscStatus } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

export function ChatView() {
  const messages = useAppStore((s) => s.messages);
  const addMessage = useAppStore((s) => s.addMessage);
  const updateMessage = useAppStore((s) => s.updateMessage);
  const approveMode = useAppStore((s) => s.approveMode);
  const setApproveMode = useAppStore((s) => s.setApproveMode);
  const chatLoading = useAppStore((s) => s.chatLoading);
  const setChatLoading = useAppStore((s) => s.setChatLoading);
  const bridgeStatus = useAppStore((s) => s.bridgeStatus);
  const setBridgeStatus = useAppStore((s) => s.setBridgeStatus);
  const settings = useAppStore((s) => s.settings);
  const pushOscHistory = useAppStore((s) => s.pushOscHistory);
  const addEvent = useAppStore((s) => s.addEvent);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkOscStatus(settings.murphyApiHost, settings.murphyApiPort).then((ok) =>
      setBridgeStatus(ok ? 'connected' : 'disconnected')
    );
  }, [settings.murphyApiHost, settings.murphyApiPort, setBridgeStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fireOsc = async (commands: string[], msgId: string) => {
    await sendOsc(settings.murphyApiHost, settings.murphyApiPort, commands);
    updateMessage(msgId, { status: 'fired' });
    pushOscHistory({ commands, description: `Fired ${commands.length} OSC command(s)` });
    addEvent({ severity: 'success', message: `Fired ${commands.length} OSC command(s)`, oscPath: commands[0] });
  };

  const handleSend = async (text: string) => {
    addMessage({ role: 'user', text, status: 'fired' });
    setChatLoading(true);

    try {
      const data = await sendChat(settings.murphyApiHost, settings.murphyApiPort, text);
      const msgId = addMessage({
        role: 'murphy',
        text: data.reply,
        oscCommands: data.osc_commands,
        confidence: data.confidence as ChatMessage['confidence'],
        path: data.path as ChatMessage['path'],
        status: approveMode === 'auto' ? 'fired' : 'pending',
      });

      if (approveMode === 'auto' && data.osc_commands?.length) {
        await fireOsc(data.osc_commands, msgId);
      }
    } catch (err) {
      addMessage({
        role: 'murphy',
        text: `Error: ${(err as Error).message}`,
        status: 'fired',
      });
      addEvent({ severity: 'error', message: (err as Error).message });
    } finally {
      setChatLoading(false);
    }
  };

  const approve = async (msg: ChatMessage) => {
    if (msg.oscCommands?.length) {
      await fireOsc(msg.oscCommands, msg.id);
    } else {
      updateMessage(msg.id, { status: 'approved' });
    }
  };

  const skip = (msgId: string) => {
    updateMessage(msgId, { status: 'skipped' });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <ConnectionBadge status={bridgeStatus} className="sm:hidden" />
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-mode" className="text-sm text-muted-foreground">
            Auto
          </Label>
          <Switch
            id="auto-mode"
            checked={approveMode === 'auto'}
            onCheckedChange={(checked) =>
              setApproveMode(checked ? 'auto' : 'approve')
            }
          />
        </div>
      </div>

      {/* Bridge warning */}
      {bridgeStatus === 'disconnected' && (
        <Alert variant="destructive" className="mx-4 mt-3 border-orange-900 bg-orange-950 text-orange-200">
          <AlertDescription>
            X32 bridge offline — Murphy can suggest fixes but won't fire OSC. Check Settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-3 py-4">
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              onApprove={approve}
              onSkip={skip}
            />
          ))}
          {chatLoading && (
            <div className="max-w-[85%] self-start rounded-xl border-l-[3px] border-l-primary/60 bg-card raised-panel px-4 py-3">
              <div className="flex items-end gap-1 h-5">
                <div className="w-1 rounded-full bg-primary origin-bottom animate-[vu-bar_0.8s_ease-in-out_infinite]" />
                <div className="w-1 rounded-full bg-primary origin-bottom animate-[vu-bar_0.8s_ease-in-out_0.15s_infinite]" />
                <div className="w-1 rounded-full bg-primary origin-bottom animate-[vu-bar_0.8s_ease-in-out_0.3s_infinite]" />
                <div className="w-1 rounded-full bg-primary origin-bottom animate-[vu-bar_0.8s_ease-in-out_0.45s_infinite]" />
                <span className="ml-2 text-sm text-muted-foreground">Murphy is thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={chatLoading} />
    </div>
  );
}
