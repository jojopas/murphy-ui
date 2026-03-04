import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadCardProps {
  label: string;
  hint: string;
  accept: string;
  onUpload: (file: File) => void;
}

export function UploadCard({ label, hint, accept, onUpload }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex min-h-[44px] flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-[#0e0e10] inset-panel p-5 text-center transition-murphy hover:border-primary hover:shadow-[0_0_12px_var(--color-glow-primary)]"
    >
      <Upload className="h-6 w-6 text-muted-foreground" />
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </button>
  );
}
