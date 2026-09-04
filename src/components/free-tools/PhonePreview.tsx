interface PhonePreviewProps {
  children: React.ReactNode;
}

export default function PhonePreview({ children }: PhonePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="w-[300px] border-[3px] border-black rounded-[32px] overflow-hidden bg-white shadow-xl">
        {/* Notch */}
        <div className="h-6 bg-black flex justify-center items-end pb-1">
          <div className="w-20 h-1 bg-gray-700 rounded-full" />
        </div>
        {/* Screen */}
        <div className="h-[520px] overflow-y-auto">{children}</div>
        {/* Home indicator */}
        <div className="h-5 bg-white flex justify-center items-center">
          <div className="w-24 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
