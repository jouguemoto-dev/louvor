import React from 'react';
import { ViewTab } from '../types';
import { Music2, Plus, Clock, ListMusic, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenNewSong: () => void;
  onOpenMetronome: () => void;
  setlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewSong,
  onOpenMetronome,
  setlistCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand wordmark */}
        <button 
          onClick={() => onSelectTab('repertorio')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 -ml-1 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-400 transition whitespace-nowrap">
              LouvorApp
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-medium">
              Ministério de Louvor
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('repertorio')}
            className={`whitespace-nowrap transition-colors py-2 border-b-2 ${
              currentTab === 'repertorio' 
                ? 'border-amber-500 text-amber-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Repertório
          </button>

          <button
            onClick={() => onSelectTab('setlist')}
            className={`whitespace-nowrap transition-colors py-2 border-b-2 flex items-center gap-2 ${
              currentTab === 'setlist' 
                ? 'border-amber-500 text-amber-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Setlist do Culto</span>
            {setlistCount > 0 && (
              <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono font-bold">
                {setlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenMetronome}
            className="whitespace-nowrap transition-colors py-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-500/80" />
            <span>Metrônomo</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenMetronome}
            className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl"
            title="Abrir Metrônomo"
            aria-label="Metrônomo"
          >
            <Clock className="w-5 h-5 text-amber-400" />
          </button>

          <button
            onClick={onOpenNewSong}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nova Cifra</span>
          </button>
        </div>

      </div>
    </header>
  );
};
