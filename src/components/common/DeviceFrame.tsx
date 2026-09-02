import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours());
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-[#F2F4F7]">
      <div className="w-full max-w-[395px] h-[100dvh] sm:h-[844px] bg-white sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-[#1E2024] relative flex flex-col overflow-hidden">
        
        {/* iOS Status Bar */}
        <div className="w-full h-11 px-7 pt-3 flex items-center justify-between text-xs font-bold text-gray-900 shrink-0 z-30 select-none bg-white">
          <span>{currentTime}</span>

          <div className="flex items-center gap-1.5 text-gray-900">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 min-h-0 relative flex flex-col bg-white overflow-hidden">
          {children}
        </div>

      </div>
    </div>
  );
};
