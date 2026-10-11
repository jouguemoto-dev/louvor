import React from 'react';
import { ViewTab } from '../types';
import { Music2, ListMusic, PlusCircle, Timer } from 'lucide-react';

interface BottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenNewSong: () => void;
  onOpenMetronome: () => void;
  setlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewSong,
  onOpenMetronome,
  setlistCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 md:hidden shadow-2xl">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        
        {/* Tab 1: Repertório */}
        <button
          onClick={() => onSelectTab('repertorio')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            currentTab === 'repertorio' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Repertório"
        >
          <Music2 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Repertório</span>
        </button>

        {/* Tab 2: Setlist */}
        <button
          onClick={() => onSelectTab('setlist')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 relative transition-colors ${
            currentTab === 'setlist' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Setlist do Culto"
        >
          <div className="relative">
            <ListMusic className="w-5 h-5 mb-0.5" />
            {setlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {setlistCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Setlist</span>
        </button>

        {/* Tab 3: Metrônomo */}
        <button
          onClick={onOpenMetronome}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-400 hover:text-amber-400 transition-colors"
          aria-label="Metrônomo Tic Tac"
        >
          <Timer className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Metrônomo</span>
        </button>

        {/* Tab 4: Nova Cifra */}
        <button
          onClick={onOpenNewSong}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-400 hover:text-amber-400 transition-colors"
          aria-label="Adicionar Nova Cifra"
        >
          <PlusCircle className="w-5 h-5 mb-0.5 text-amber-500" />
          <span className="text-[11px] tracking-tight text-amber-400">Nova Cifra</span>
        </button>

      </div>
    </nav>
  );
};
