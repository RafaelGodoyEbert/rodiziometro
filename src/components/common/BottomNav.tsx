import React from 'react';
import { Utensils, Trophy, Lightbulb, Users } from 'lucide-react';

export type NavTab = 'counter' | 'battle' | 'curiosities' | 'room';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unseenRankChange?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unseenRankChange = false,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'counter', label: 'Contador', icon: <Utensils className="w-5 h-5" /> },
    { id: 'battle', label: 'Batalha', icon: <Trophy className="w-5 h-5" />, badge: unseenRankChange },
    { id: 'curiosities', label: 'Curiosidades', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'room', label: 'Mesa', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Tab Icon */}
              <div className="relative">
                {tab.icon}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                )}
              </div>

              {/* Tab Label */}
              <span className="text-[11px] mt-1 tracking-tight leading-none">{tab.label}</span>

              {/* Active Bar */}
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm shadow-orange-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
