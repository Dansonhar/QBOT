interface DebugIndicatorProps {
  filename: string;
}

export default function DebugIndicator({ filename }: DebugIndicatorProps) {
  return (
    <div className="fixed bottom-4 left-4 bg-black text-green-500 px-4 py-2 font-mono text-xs z-50 border border-green-500 shadow-lg">
      {filename}
    </div>
  );
}
