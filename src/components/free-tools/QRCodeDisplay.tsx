import { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  downloadFileName?: string;
  showDownload?: boolean;
}

export default function QRCodeDisplay({
  value,
  size = 256,
  downloadFileName = 'qrcode',
  showDownload = true,
}: QRCodeDisplayProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadPNG = useCallback(() => {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      const link = document.createElement('a');
      link.download = `${downloadFileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [downloadFileName]);

  const downloadSVG = useCallback(() => {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${downloadFileName}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [downloadFileName]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={svgRef} className="bg-white p-4 border border-gray-200 inline-block">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {showDownload && (
        <div className="flex gap-3">
          <button
            onClick={downloadPNG}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={downloadSVG}
            className="px-4 py-2 border border-gray-300 text-black text-xs font-bold uppercase tracking-wider hover:border-black transition-colors"
          >
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}
