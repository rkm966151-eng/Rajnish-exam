/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, ChevronLeft, Home as HomeIcon, Square, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAndroidFrame, toggleAndroidFrame, goBack, navigateTo } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('10:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isAndroidFrame) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 lg:p-10 select-none">
      {/* Top Controller Bar */}
      <div className="w-full max-w-sm sm:max-w-md mb-3 flex items-center justify-between text-xs text-slate-300 px-2">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-slate-200">Android Device Simulator (Capacitor Ready)</span>
        </div>
        <button
          onClick={toggleAndroidFrame}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          Expand to Full Screen ↗
        </button>
      </div>

      {/* Android Device Outer Bezel */}
      <div className="relative w-full max-w-[420px] h-[870px] bg-slate-900 rounded-[50px] p-3 shadow-[0_0_60px_-15px_rgba(249,115,22,0.3)] border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        
        {/* Top Punch Hole & Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 pointer-events-none">
          <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800" />
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Android Native Status Bar */}
        <div className="h-7 w-full bg-slate-950/90 text-white flex items-center justify-between px-6 text-[11px] font-semibold tracking-wider z-40 shrink-0">
          <span>{currentTime}</span>
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="text-[10px] text-orange-400 font-bold">5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative flex-1 bg-white dark:bg-slate-900 overflow-y-auto rounded-[38px] flex flex-col no-scrollbar">
          {children}
        </div>

        {/* Android Bottom Navigation Bar (Back, Home, Recents) */}
        <div className="h-9 w-full bg-black/95 flex items-center justify-around px-12 z-40 shrink-0 border-t border-slate-800/60">
          {/* Back button */}
          <button 
            onClick={goBack} 
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Back Button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Home button */}
          <button 
            onClick={() => navigateTo('home')} 
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Home Screen"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 hover:border-white transition-colors" />
          </button>
          
          {/* Recents button */}
          <button 
            onClick={() => navigateTo('student-dashboard')} 
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Recent Apps / Dashboard"
          >
            <Square className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
