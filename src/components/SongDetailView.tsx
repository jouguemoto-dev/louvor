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
  Sliders, 
  Edit3, 
  Trash2, 
  Share2, 
  Printer, 
  Columns, 
  Type, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  Guitar
} from 'lucide-react';

interface SongDetailViewProps {
  song: Song;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenMetronome: (bpm: number, timeSig: string) => void;
  onInspectChord: (chord: string) => void;
  // Setlist sequential navigation
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Auto Scroll state
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(3); // 1 (slow) to 10 (fast)
  const [countdown, setCountdown] = useState<number | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // Reset transposition when song changes
  useEffect(() => {
    setSemitones(0);
    setPreferFlat(Boolean(song.key && song.key.includes('b')));
    stopAutoScroll();
  }, [song.id, song.key]);

  // Handle Fullscreen events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation for setlist
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' && nextSong && onNavigateSong) {
        onNavigateSong(nextSong.id);
      } else if (e.key === 'ArrowLeft' && prevSong && onNavigateSong) {
        onNavigateSong(prevSong.id);
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleAutoScroll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [song.id, setlistSongs]);

  // Cleanup auto-scroll on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
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
    // Interval based on speed: higher speed = shorter interval
    const intervalMs = Math.max(16, 120 - scrollSpeed * 10);
    scrollIntervalRef.current = window.setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'smooth' });
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

  // Adjust scroll speed dynamically if already scrolling
  useEffect(() => {
    if (isScrolling) {
      launchScrollLoop();
    }
  }, [scrollSpeed]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Capo suggestions
  const capoOptions = getCapoSuggestions(currentKey);

  // Setlist index
  const currentIndex = setlistSongs.findIndex(s => s.id === song.id);
  const prevSong = currentIndex > 0 ? setlistSongs[currentIndex - 1] : null;
  const nextSong = currentIndex >= 0 && currentIndex < setlistSongs.length - 1 ? setlistSongs[currentIndex + 1] : null;

  // Render chords HTML with clickable chord spans
  const transposedRawChords = transposeFormattedCifra(song.chords, semitones, preferFlat);
  
  // Extract list of all active chords in current song for quick inspection
  const activeChords = extractUniqueChords(transposedRawChords);

  // Prepare printable version
  const handlePrint = () => {
    window.print();
  };

  // Share text via WhatsApp or Web Share
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

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-200 ${isStageBlackout ? 'stage-blackout bg-black' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Top Stage Control Header */}
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

            {/* Setlist Navigation Indicators if applicable */}
            {setlistSongs.length > 0 && currentIndex !== -1 && (
              <span className="text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg hidden md:inline-block">
                Música {currentIndex + 1} de {setlistSongs.length}
              </span>
            )}
          </div>

          {/* Quick Stage View Modifiers */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
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
              onClick={handlePrint}
              className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl transition"
              title="Imprimir Cifra"
              aria-label="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl transition"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
              aria-label="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {song.title}
              </h1>
              <p className="text-base sm:text-lg text-amber-400 font-semibold mt-0.5">
                {song.artist}
              </p>
            </div>

            {/* Action buttons (Edit, Delete) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
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
                <span>Estilo:</span> <span className="text-slate-200 font-medium">{song.category}</span>
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

      {/* Floating Stage Toolbar (Transposition + Auto-scroll + Metronome) */}
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

          {/* Quick Metronome Modal Trigger */}
          <button
            onClick={() => onOpenMetronome(song.bpm, song.timeSig)}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95"
            title="Abrir Metrônomo do Louvor"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums font-mono">{song.bpm} BPM</span>
          </button>

        </div>
      </div>

    </div>
  );
};

// Helper to wrap chords in clickable styled spans
function formatChordsToInteractiveHtml(chordsText: string): string {
  // Replaces <c>CHORD</c> with styled clickable span
  let formatted = chordsText.replace(/<c>(.*?)<\/c>/g, (_, chord) => {
    return `<c class="text-amber-400 font-extrabold cursor-pointer hover:underline hover:text-amber-300 transition-colors px-0.5 rounded hover:bg-amber-500/10">${chord}</c>`;
  });

  // Replaces <b>[Section]</b> with section header styling
  formatted = formatted.replace(/<b>\[(.*?)\]<\/b>/g, (_, section) => {
    return `<div class="font-sans font-bold text-sky-400 text-sm tracking-wide mt-5 mb-1.5 uppercase select-none flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>[${section}]</div>`;
  });

  return formatted;
}
