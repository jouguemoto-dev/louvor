import React, { useState, useEffect, useRef } from 'react';
import { AudioMetronome, TapTempoCalculator, MetronomeSound } from '../utils/audioMetronome';
import { X, Play, Square, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';

interface MetronomeModalProps {
  isOpen: boolean;
  initialBpm?: number;
  initialTimeSig?: string;
  onClose: () => void;
}

export const MetronomeModal: React.FC<MetronomeModalProps> = ({
  isOpen,
  initialBpm = 120,
  initialTimeSig = '4/4',
  onClose,
}) => {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [timeSig, setTimeSig] = useState<string>(initialTimeSig);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<MetronomeSound>('woodblock');
  const [volume, setVolume] = useState<number>(0.8);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const [tapMessage, setTapMessage] = useState<string | null>(null);

  const metronomeRef = useRef<AudioMetronome | null>(null);
  const tapCalculatorRef = useRef<TapTempoCalculator>(new TapTempoCalculator());

  // Initialize AudioMetronome instance
  useEffect(() => {
    const metro = new AudioMetronome(bpm, timeSig);
    metro.setSound(sound);
    metro.setVolume(volume);

    metro.setOnBeat((beat) => {
      setCurrentBeat(beat);
    });

    metronomeRef.current = metro;

    return () => {
      metro.stop();
    };
  }, []);

  // Update metronome parameters when state changes
  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setBpm(bpm);
    }
  }, [bpm]);

  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setTimeSignature(timeSig);
    }
  }, [timeSig]);

  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setSound(sound);
    }
  }, [sound]);

  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.setVolume(volume);
    }
  }, [volume]);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen && initialBpm) {
      setBpm(initialBpm);
    }
    if (isOpen && initialTimeSig) {
      setTimeSig(initialTimeSig);
    }
  }, [isOpen, initialBpm, initialTimeSig]);

  // Stop when closing
  const handleClose = () => {
    if (metronomeRef.current) {
      metronomeRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(-1);
    }
    onClose();
  };

  const toggleMetronome = () => {
    if (!metronomeRef.current) return;
    const running = metronomeRef.current.toggle();
    setIsPlaying(running);
    if (!running) {
      setCurrentBeat(-1);
    }
  };

  const handleTap = () => {
    const newBpm = tapCalculatorRef.current.tap();
    if (newBpm) {
      setBpm(newBpm);
      setTapMessage(`${newBpm} BPM detectado!`);
      setTimeout(() => setTapMessage(null), 1500);
    } else {
      setTapMessage('Continue tocando...');
    }
  };

  if (!isOpen) return null;

  // Number of visual beats based on time signature
  const totalBeats = parseInt(timeSig.split('/')[0], 10) || 4;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl transition"
          aria-label="Fechar metrônomo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="font-extrabold text-lg text-white mb-1 flex items-center justify-center gap-2">
          <span>⏱️ Metrônomo do Louvor</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">Tic Tac de Palco com Precisão Web Audio</p>

        {/* Visual LED Beat Lights */}
        <div className="flex justify-center items-center gap-3 mb-6 min-h-[32px]">
          {Array.from({ length: totalBeats }).map((_, index) => {
            const isActive = currentBeat === index;
            const isFirst = index === 0;

            return (
              <div
                key={index}
                className={`w-6 h-6 rounded-full transition-all duration-75 flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? isFirst
                      ? 'bg-amber-400 text-slate-950 scale-125 shadow-lg shadow-amber-500/60 ring-4 ring-amber-500/30'
                      : 'bg-sky-400 text-slate-950 scale-110 shadow-md shadow-sky-500/50'
                    : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>

        {/* BPM Counter Display & Fine Tuners */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBpm(prev => Math.max(30, prev - 1))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-lg flex items-center justify-center transition active:scale-95 border border-slate-700"
              title="-1 BPM"
            >
              -
            </button>

            <div className="text-center">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight block">
                {bpm}
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                BPM
              </span>
            </div>

            <button
              onClick={() => setBpm(prev => Math.min(260, prev + 1))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-lg flex items-center justify-center transition active:scale-95 border border-slate-700"
              title="+1 BPM"
            >
              +
            </button>
          </div>

          {/* Quick preset jumps (-5 / +5) */}
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={() => setBpm(prev => Math.max(30, prev - 5))}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700"
            >
              -5
            </button>
            <button
              onClick={() => setBpm(prev => Math.min(260, prev + 5))}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700"
            >
              +5
            </button>
          </div>
        </div>

        {/* BPM Slider */}
        <input
          type="range"
          min="40"
          max="220"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full accent-amber-500 mb-5 cursor-pointer"
        />

        {/* Time Signature Selectors */}
        <div className="flex justify-center gap-1.5 mb-5 text-xs">
          {['4/4', '3/4', '6/8', '2/4'].map(sig => (
            <button
              key={sig}
              onClick={() => setTimeSig(sig)}
              className={`px-3 py-1.5 rounded-xl font-mono font-bold transition ${
                timeSig === sig
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {sig}
            </button>
          ))}
        </div>

        {/* Sound Selection & Volume Row */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-xs text-left">
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Som:</label>
            <select
              value={sound}
              onChange={(e) => setSound(e.target.value as MetronomeSound)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="woodblock">Woodblock (Estúdio)</option>
              <option value="click">Click (Palco)</option>
              <option value="beep">Beep (Digital)</option>
              <option value="cowbell">Cowbell (Percussão)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Volume:</label>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Tap Tempo & Start Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleTap}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold py-2.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🖐️ Toque no Ritmo (Tap Tempo)</span>
            {tapMessage && <span className="text-amber-400 font-mono text-[11px]">({tapMessage})</span>}
          </button>

          <button
            onClick={toggleMetronome}
            className={`w-full font-extrabold py-3.5 rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Parar Tic Tac</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Tic Tac</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
