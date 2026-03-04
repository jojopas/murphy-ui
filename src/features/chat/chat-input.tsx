import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    setInput('');
    onSend(text);
  };

  return (
    <div className="flex gap-2 border-t border-border bg-gradient-to-t from-card to-transparent p-3">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Tell Murphy what you're hearing..."
        disabled={disabled}
        className="min-h-[44px] text-base"
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          'min-h-[44px] min-w-[44px]',
          input.trim() && !disabled && 'glow-primary'
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
