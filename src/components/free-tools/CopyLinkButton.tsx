import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 border border-gray-300 p-2">
      <span className="flex-1 text-sm text-gray-600 truncate px-2">{url}</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shrink-0"
      >
        {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={3} />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
}
