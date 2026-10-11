import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { 
  transposeNote, 
  transposeChord, 
  transposeFormattedCifra, 
  getCapoSuggestions,
  extractUniqueChords 
} from '../utils/musicTheory';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Clock, 
  Edit3, 
  Trash2, 
  Share2, 
  Printer, 
  Columns, 
  ChevronLeft, 
  ChevronRight,
  Moon,
  Info,
  Guitar,
  X,
  Sun,
  Tv
} from 'lucide-react';

interface SongDetailViewProps {
  song: Song;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenMetronome: (bpm: number, timeSig: string) => void;
  onInspectChord: (chord: string) => void;
  setlistSongs?: Song[];
  onNavigateSong?: (id: string) => void;
}

export const SongDetailView: React.FC<SongDetailViewProps> = ({
  song,
  onBack,
  onEdit,
  onDelete,
  onOpenMetronome,
  onInspectChord,
  setlistSongs = [],
  onNavigateSong,
}) => {
  const [semitones, setSemitones] = useState<number>(0);
  const [preferFlat, setPreferFlat] = useState<boolean>(Boolean(song.key && song.key.includes('b')));
  const [fontSize, setFontSize] = useState<number>(18);
  const [isTwoColumns, setIsTwoColumns] = useState<boolean>(false);
  const [isStageBlackout, setIsStageBlackout] = useState<boolean>(false);
  const [isStageFullscreen, setIsStageFullscreen] = useState<boolean>(false);

  // Auto Scroll state
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(3); // 1 (slow) to 10 (fast)
  const [countdown, setCountdown] = useState<number | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const stageScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Reset transposition when song changes
  useEffect(() => {
    setSemitones(0);
    setPreferFlat(Boolean(song.key && song.key.includes('b')));
    stopAutoScroll();
    if (stageScrollContainerRef.current) {
      stageScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [song.id, song.key]);

  // Request Screen Wake Lock so screen doesn't turn off on stage
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Ignored if permissions not granted
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  };

  // Enter Full Screen Stage Mode
  const enterStageFullscreen = () => {
    setIsStageFullscreen(true);
    requestWakeLock();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback to overlay fullscreen
      });
    }
  };

  // Exit Full Screen Stage Mode
  const exitStageFullscreen = () => {
    setIsStageFullscreen(false);
    releaseWakeLock();
    stopAutoScroll();
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard navigation & Foot Pedal page turners (Left/Right arrows, Space, PageUp/PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === 'ArrowRight' || e.key === 'PageDown') && nextSong && onNavigateSong) {
        onNavigateSong(nextSong.id);
      } else if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && prevSong && onNavigateSong) {
        onNavigateSong(prevSong.id);
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleAutoScroll();
      } else if (e.key === 'Escape' && isStageFullscreen) {
        exitStageFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [song.id, setlistSongs, isStageFullscreen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      releaseWakeLock();
    };
  }, []);

  // Compute transposed key
  const currentKey = transposeNote(song.key || 'C', semitones, preferFlat);

  // Auto-scroll execution
  const startAutoScroll = () => {
    setCountdown(3);
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimer);
          setIsScrolling(true);
          launchScrollLoop();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const launchScrollLoop = () => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    const intervalMs = Math.max(16, 120 - scrollSpeed * 10);
    scrollIntervalRef.current = window.setInterval(() => {
      if (isStageFullscreen && stageScrollContainerRef.current) {
        stageScrollContainerRef.current.scrollBy({ top: 1, behavior: 'smooth' });
      } else {
        window.scrollBy({ top: 1, behavior: 'smooth' });
      }
    }, intervalMs);
  };

  const stopAutoScroll = () => {
    setIsScrolling(false);
    setCountdown(null);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const toggleAutoScroll = () => {
    if (isScrolling || countdown !== null) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  useEffect(() => {
    if (isScrolling) {
      launchScrollLoop();
    }
  }, [scrollSpeed, isStageFullscreen]);

  // Capo suggestions
  const capoOptions = getCapoSuggestions(currentKey);

  // Setlist index
  const currentIndex = setlistSongs.findIndex(s => s.id === song.id);
  const prevSong = currentIndex > 0 ? setlistSongs[currentIndex - 1] : null;
  const nextSong = currentIndex >= 0 && currentIndex < setlistSongs.length - 1 ? setlistSongs[currentIndex + 1] : null;

  // Render chords HTML with clickable chord spans
  const transposedRawChords = transposeFormattedCifra(song.chords, semitones, preferFlat);
  const activeChords = extractUniqueChords(transposedRawChords);

  // Share text via WhatsApp
  const handleShare = () => {
    const textToShare = `🎵 *${song.title}* - ${song.artist}\nTom: *${currentKey}* | BPM: ${song.bpm} | Compasso: ${song.timeSig}\n\n${song.notes ? `Observações: ${song.notes}\n\n` : ''}${transposedRawChords.replace(/<[^>]+>/g, '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${song.title} - ${song.artist}`,
        text: textToShare
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('Cifra copiada para a área de transferência! Cole no WhatsApp ou envie aos músicos.');
    }
  };

  // ==========================================
  // FULL SCREEN STAGE PERFORMANCE VIEW (MODO PALCO)
  // ==========================================
  if (isStageFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#000000] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
        
        {/* Fullscreen Stage HUD Header */}
        <header className="bg-neutral-950/95 border-b border-neutral-900 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 backdrop-blur">
          
          {/* Left: Exit Stage & Song Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={exitStageFullscreen}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-slate-200 px-3 py-1.5 rounded-xl border border-neutral-700 text-xs font-bold transition shrink-0 active:scale-95"
              title="Sair do Modo Palco (Esc)"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Sair da Tela Cheia</span>
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white truncate leading-tight">
                {song.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold truncate">
                <span>{song.artist}</span>
                {setlistSongs.length > 0 && currentIndex !== -1 && (
                  <span className="text-neutral-400 font-mono">
                    · {currentIndex + 1}/{setlistSongs.length} do Culto
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center / Right: Quick Stage Tweaks */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Transposer */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button
                onClick={() => setSemitones(prev => prev - 1)}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-black text-sm active:scale-90 flex items-center justify-center"
                title="Tom -1"
              >
                -
              </button>
              <div className="px-2 font-mono font-black text-amber-400 text-sm text-center min-w-[2.5rem]">
                {currentKey}
              </div>
              <button
                onClick={() => setSemitones(prev => prev + 1)}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-black text-sm active:scale-90 flex items-center justify-center"
                title="Tom +1"
              >
                +
              </button>
            </div>

            {/* Columns Toggle (Essential for iPad/Tablets) */}
            <button
              onClick={() => setIsTwoColumns(!isTwoColumns)}
              className={`p-2 rounded-xl text-xs font-semibold border transition ${
                isTwoColumns 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-neutral-900 text-slate-300 border-neutral-800 hover:text-white'
              }`}
              title="Alternar entre 1 e 2 Colunas no Palco"
            >
              <Columns className="w-4 h-4" />
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize(prev => Math.max(13, prev - 1))}
                className="px-2 py-1 text-xs font-black text-slate-300 hover:text-white"
                title="Diminuir fonte"
              >
                A-
              </button>
              <span className="text-[11px] text-slate-400 px-1 font-mono">{fontSize}</span>
              <button
                onClick={() => setFontSize(prev => Math.min(32, prev + 1))}
                className="px-2 py-1 text-xs font-black text-slate-300 hover:text-white"
                title="Aumentar fonte"
              >
                A+
              </button>
            </div>

            {/* Metronome Trigger in Stage Mode */}
            <button
              onClick={() => onOpenMetronome(song.bpm, song.timeSig)}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
              title="Abrir Metrônomo"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="tabular-nums font-mono">{song.bpm}</span>
            </button>

          </div>
        </header>

        {/* Scrollable Stage Chart Body */}
        <div 
          ref={stageScrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-14 py-6 scrollbar-none"
        >
          {/* Capo alert if applicable */}
          {capoOptions.length > 0 && semitones !== 0 && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 max-w-xl mx-auto">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Capotraste na casa {capoOptions[0].fret} (formato em {capoOptions[0].openKey})
              </span>
            </div>
          )}

          {/* Cifra Display */}
          <div 
            className={`font-cifra whitespace-pre-wrap leading-relaxed select-text max-w-5xl mx-auto ${
              isTwoColumns ? 'md:columns-2 md:gap-14' : ''
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
            dangerouslySetInnerHTML={{
              __html: formatChordsToInteractiveHtml(transposedRawChords)
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target && target.tagName === 'C') {
                const chordText = target.innerText.trim();
                if (chordText) onInspectChord(chordText);
              }
            }}
          />
        </div>

        {/* Stage Bottom Controller (Auto-Scroll & Setlist Page Turners) */}
        <footer className="bg-neutral-950/95 border-t border-neutral-900 px-4 py-3 flex items-center justify-between gap-3 shrink-0 backdrop-blur">
          
          {/* Previous Song in Setlist */}
          <button
            onClick={() => prevSong && onNavigateSong && onNavigateSong(prevSong.id)}
            disabled={!prevSong}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition ${
              prevSong
                ? 'bg-neutral-900 text-slate-100 hover:bg-neutral-800 border-neutral-800 active:scale-95'
                : 'opacity-30 cursor-not-allowed bg-neutral-950 text-slate-600 border-neutral-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior:</span>
            <span className="truncate max-w-[100px] sm:max-w-[150px] font-bold">
              {prevSong ? prevSong.title : 'Início'}
            </span>
          </button>

          {/* Auto-Scroll Module */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-1.5">
            <button
              onClick={toggleAutoScroll}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition active:scale-95 ${
                isScrolling
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : countdown !== null
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
              }`}
            >
              {countdown !== null ? (
                <span>Iniciando em {countdown}...</span>
              ) : isScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Scroll</span>
                </>
              )}
            </button>

            {/* Speed slider */}
            <div className="flex items-center gap-1 px-1">
              <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">Vel:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-16 sm:w-24 accent-amber-500 cursor-pointer"
                title={`Velocidade: ${scrollSpeed}`}
              />
              <span className="text-[10px] text-slate-300 font-mono w-3 text-right">
                {scrollSpeed}
              </span>
            </div>
          </div>

          {/* Next Song in Setlist */}
          <button
            onClick={() => nextSong && onNavigateSong && onNavigateSong(nextSong.id)}
            disabled={!nextSong}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition ${
              nextSong
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 border-amber-400 shadow-md font-bold active:scale-95'
                : 'opacity-30 cursor-not-allowed bg-neutral-950 text-slate-600 border-neutral-900'
            }`}
          >
            <span className="hidden sm:inline">Próxima:</span>
            <span className="truncate max-w-[100px] sm:max-w-[150px] font-bold">
              {nextSong ? nextSong.title : 'Fim'}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

        </footer>

      </div>
    );
  }

  // ==========================================
  // STANDARD REHEARSAL / LIBRARY VIEW
  // ==========================================
  return (
    <div className={`min-h-screen pb-32 transition-colors duration-200 ${isStageBlackout ? 'stage-blackout bg-black' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Top Header Bar */}
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${isStageBlackout ? 'bg-black/95 border-neutral-900' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 transition"
              aria-label="Voltar para Repertório"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {/* Setlist Navigation Indicators */}
            {setlistSongs.length > 0 && currentIndex !== -1 && (
              <span className="text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg hidden md:inline-block">
                Música {currentIndex + 1} de {setlistSongs.length}
              </span>
            )}
          </div>

          {/* Quick Stage View Modifiers & Dedicated Fullscreen Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* PROMINENT FULLSCREEN STAGE BUTTON */}
            <button
              onClick={enterStageFullscreen}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition text-xs sm:text-sm"
              title="Abrir no Modo Palco (Tela Cheia sem distrações para tocar no culto)"
            >
              <Maximize2 className="w-4 h-4 stroke-[2.5]" />
              <span className="whitespace-nowrap">Modo Tela Cheia</span>
            </button>

            {/* Stage Blackout Toggle */}
            <button
              onClick={() => setIsStageBlackout(!isStageBlackout)}
              className={`p-2 rounded-xl text-xs font-semibold border transition ${
                isStageBlackout 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isStageBlackout ? 'Modo Normal' : 'Modo Palco (Blackout)'}
              aria-label="Modo Palco"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* 2-Columns layout toggle for tablets & laptops */}
            <button
              onClick={() => setIsTwoColumns(!isTwoColumns)}
              className={`hidden md:flex items-center gap-1 p-2 rounded-xl text-xs font-semibold border transition ${
                isTwoColumns 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Alternar entre 1 e 2 Colunas"
              aria-label="Colunas"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden lg:inline">{isTwoColumns ? '1 Coluna' : '2 Colunas'}</span>
            </button>

            {/* Font size adjustments */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize(prev => Math.max(13, prev - 1))}
                className="px-2 py-1.5 text-xs font-black text-slate-300 hover:text-white"
                title="Diminuir fonte"
              >
                A-
              </button>
              <span className="text-[11px] text-slate-400 px-1 font-mono">{fontSize}</span>
              <button
                onClick={() => setFontSize(prev => Math.min(32, prev + 1))}
                className="px-2 py-1.5 text-xs font-black text-slate-300 hover:text-white"
                title="Aumentar fonte"
              >
                A+
              </button>
            </div>

            {/* Share / WhatsApp */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl transition"
              title="Compartilhar Cifra"
              aria-label="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl transition"
              title="Imprimir Cifra"
              aria-label="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Song Header Info Card */}
        <div className={`rounded-2xl p-5 sm:p-6 border mb-6 transition-colors ${isStageBlackout ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {song.title}
                </h1>
                {song.link && (
                  <a
                    href={song.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 font-semibold transition"
                    title="Ver página oficial no Cifra Club"
                  >
                    🔗 Cifra Club
                  </a>
                )}
              </div>
              <p className="text-base sm:text-lg text-amber-400 font-semibold mt-0.5">
                {song.artist}
              </p>
            </div>

            {/* Action buttons (Edit, Delete, Enter Stage) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={enterStageFullscreen}
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl transition font-bold text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tela Cheia</span>
              </button>

              <button
                onClick={() => onEdit(song.id)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 px-3 py-2 rounded-xl transition font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={() => onDelete(song.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 rounded-xl transition"
                title="Excluir da biblioteca"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar (Tom, BPM, Compasso, Categoria) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm text-slate-300">
            
            {/* Transposed Tone */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400">Tom:</span>
              <span className="font-mono font-extrabold text-amber-400 text-base">
                {currentKey}
              </span>
              {semitones !== 0 && (
                <span className="text-[10px] text-slate-400 font-mono">
                  ({semitones > 0 ? `+${semitones}` : semitones})
                </span>
              )}
            </div>

            {/* Metronome quick link */}
            <button
              onClick={() => onOpenMetronome(song.bpm, song.timeSig)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-amber-400 font-bold transition group"
              title="Abrir Metrônomo com este BPM"
            >
              <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="tabular-nums font-mono">{song.bpm} BPM</span>
            </button>

            {/* Compasso */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 font-mono">
              <span className="text-slate-400">Compasso:</span>
              <span className="font-bold text-slate-200">{song.timeSig}</span>
            </div>

            {/* Categoria */}
            {song.category && (
              <div className="text-slate-400">
                <span>Momento:</span> <span className="text-slate-200 font-medium">{song.category}</span>
              </div>
            )}
          </div>

          {/* Capo Recommendation Alert */}
          {capoOptions.length > 0 && semitones !== 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                💡 Sugestão para violão: Use <strong>Capotraste na casa {capoOptions[0].fret}</strong> e toque com formato em <strong>{capoOptions[0].openKey}</strong>.
              </span>
            </div>
          )}

          {/* Arrangement Notes for Musicians */}
          {song.notes && (
            <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 font-bold">Arranjo:</span>
              <span>{song.notes}</span>
            </div>
          )}

          {/* Active Chords Quick Bar (Clickable chord diagrams) */}
          {activeChords.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Guitar className="w-3.5 h-3.5 text-amber-500" />
                Acordes da música:
              </span>
              {activeChords.map(chord => (
                <button
                  key={chord}
                  onClick={() => onInspectChord(chord)}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-mono font-bold text-amber-400 border border-slate-700 transition"
                  title={`Ver diagrama do acorde ${chord}`}
                >
                  {chord}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Chords and Lyrics View */}
        <div className={`p-5 sm:p-8 rounded-2xl border transition-colors shadow-2xl ${
          isStageBlackout ? 'bg-neutral-950 border-neutral-900' : 'bg-slate-900/90 border-slate-800'
        }`}>
          
          <div 
            className={`font-cifra whitespace-pre-wrap leading-relaxed select-text ${
              isTwoColumns ? 'md:columns-2 md:gap-12' : ''
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{
              __html: formatChordsToInteractiveHtml(transposedRawChords)
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target && target.tagName === 'C') {
                const chordText = target.innerText.trim();
                if (chordText) onInspectChord(chordText);
              }
            }}
          />

        </div>

        {/* Bottom Setlist Carousel / Prev - Next Buttons */}
        {setlistSongs.length > 1 && (
          <div className="mt-8 flex items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
            <button
              onClick={() => prevSong && onNavigateSong && onNavigateSong(prevSong.id)}
              disabled={!prevSong}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                prevSong
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 border-slate-700'
                  : 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 uppercase font-mono">Anterior</span>
                <span className="truncate max-w-[120px] sm:max-w-[200px] block">{prevSong ? prevSong.title : 'Início'}</span>
              </div>
            </button>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              {currentIndex + 1} / {setlistSongs.length} no Culto
            </span>

            <button
              onClick={() => nextSong && onNavigateSong && onNavigateSong(nextSong.id)}
              disabled={!nextSong}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                nextSong
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 border-amber-400 shadow-md font-bold'
                  : 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <div className="text-right">
                <span className="block text-[10px] text-slate-900/70 uppercase font-mono">Próxima</span>
                <span className="truncate max-w-[120px] sm:max-w-[200px] block">{nextSong ? nextSong.title : 'Fim'}</span>
              </div>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

      </main>

      {/* Floating Bottom Stage Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2 sm:p-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Transposition Module */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-inner">
            <span className="text-[11px] sm:text-xs text-slate-400 px-2 font-bold hidden xs:inline">Tom:</span>
            
            <button
              onClick={() => setSemitones(prev => prev - 1)}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 font-black text-sm active:scale-90 transition flex items-center justify-center"
              title="Diminuir Meio Tom (-1)"
              aria-label="Diminuir tom"
            >
              -
            </button>

            <div className="px-2.5 text-center min-w-[3.5rem]">
              <span className="font-mono font-extrabold text-amber-400 text-base block leading-none">
                {currentKey}
              </span>
              <button
                onClick={() => setPreferFlat(!preferFlat)}
                className="text-[9px] text-slate-400 hover:text-white underline font-mono"
                title="Alternar entre Sustenidos e Bemóis"
              >
                {preferFlat ? 'b (bemol)' : '# (sust.)'}
              </button>
            </div>

            <button
              onClick={() => setSemitones(prev => prev + 1)}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 font-black text-sm active:scale-90 transition flex items-center justify-center"
              title="Aumentar Meio Tom (+1)"
              aria-label="Aumentar tom"
            >
              +
            </button>

            {semitones !== 0 && (
              <button
                onClick={() => setSemitones(0)}
                className="ml-1 text-[10px] text-slate-400 hover:text-amber-400 px-1.5 py-1 rounded hover:bg-slate-700/50"
                title="Restaurar tom original"
              >
                Reset
              </button>
            )}
          </div>

          {/* Auto-Scroll Module */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button
              onClick={toggleAutoScroll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition active:scale-95 ${
                isScrolling
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : countdown !== null
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
              }`}
            >
              {countdown !== null ? (
                <span>Iniciando em {countdown}...</span>
              ) : isScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Scroll</span>
                </>
              )}
            </button>

            {/* Scroll Speed Slider */}
            <div className="flex items-center gap-1 px-1.5">
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Vel:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-14 sm:w-20 accent-amber-500 cursor-pointer"
                title={`Velocidade de rolagem: ${scrollSpeed}`}
                aria-label="Velocidade da rolagem"
              />
              <span className="text-[10px] text-slate-300 font-mono w-3 text-right">
                {scrollSpeed}
              </span>
            </div>
          </div>

          {/* Stage Fullscreen Quick Action */}
          <button
            onClick={enterStageFullscreen}
            className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition"
            title="Abrir Modo Palco Tela Cheia"
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Palco</span>
          </button>

        </div>
      </div>

    </div>
  );
};

// Helper to wrap chords in clickable styled spans
function formatChordsToInteractiveHtml(chordsText: string): string {
  let formatted = chordsText.replace(/<c>(.*?)<\/c>/g, (_, chord) => {
    return `<c class="text-amber-400 font-extrabold cursor-pointer hover:underline hover:text-amber-300 transition-colors px-0.5 rounded hover:bg-amber-500/10">${chord}</c>`;
  });

  formatted = formatted.replace(/<b>\[(.*?)\]<\/b>/g, (_, section) => {
    return `<div class="font-sans font-bold text-sky-400 text-sm tracking-wide mt-5 mb-1.5 uppercase select-none flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>[${section}]</div>`;
  });

  return formatted;
}
