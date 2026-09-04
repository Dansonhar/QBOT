import { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import CopyLinkButton from '../free-tools/CopyLinkButton';

const DOMAIN = 'https://qbot.now';

interface Props {
  shortId: string | null;
}

export default function QRSection({ shortId }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  if (!shortId) {
    return (
      <div className="p-6 border border-dashed border-gray-300 text-center">
        <p className="text-sm text-gray-400">Publish your menu to get a QR code and shareable link.</p>
      </div>
    );
  }

  const pageUrl = `${DOMAIN}/freetools/${shortId}`;

  // Generate QR on first render
  if (!qrDataUrl) {
    QRCode.toDataURL(pageUrl, { width: 1024, margin: 2, errorCorrectionLevel: 'H' }).then(setQrDataUrl);
  }

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `waorder-qr-${shortId}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Ordering Page</h3>

      {qrDataUrl && (
        <div className="flex justify-center">
          <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <CopyLinkButton url={pageUrl} />
          <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-50">
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </a>
        </div>
        <button onClick={downloadQr} className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800">
          <Download className="w-3.5 h-3.5" />
          Download QR
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center">Print this QR code on your table tents, receipts, or storefront.</p>
    </div>
  );
}
