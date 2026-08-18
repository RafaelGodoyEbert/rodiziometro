import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import { Utensils, Wifi, WifiOff, Users } from 'lucide-react';

interface HeaderProps {
  room: Room | null;
  isOffline?: boolean;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ room, isOffline = false, onLogoClick }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!room || room.status === 'ENDED') return;

    const interval = setInterval(() => {
      const diffMs = Math.max(0, Date.now() - room.createdAt);
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setElapsedTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand logo & title */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-black text-lg">
            🍕
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight flex items-center gap-1">
              Rodiziômetro
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Contador de Rodízio</p>
          </div>
        </div>

        {/* Room / Mode Status info */}
        <div className="flex items-center gap-2">
          {room ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 text-xs">
              <span className="font-mono text-orange-400 font-bold">{elapsedTime}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {room.participants.length}
              </span>
            </div>
          ) : (
            <span className="text-xs bg-slate-800/60 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700/50">
              Modo Solo
            </span>
          )}

          {/* Connection status indicator */}
          <div
            className={`p-1.5 rounded-full ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
            title={isOffline ? 'Modo Offline' : 'Sincronizado'}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
    </header>
  );
};
