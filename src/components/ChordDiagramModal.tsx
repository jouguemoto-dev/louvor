import React from 'react';
import { getChordDiagram, CHORD_LIBRARY } from '../utils/musicTheory';
import { X, Guitar, Music, Check } from 'lucide-react';

interface ChordDiagramModalProps {
  chordName: string | null;
  onClose: () => void;
}

export const ChordDiagramModal: React.FC<ChordDiagramModalProps> = ({
  chordName,
  onClose,
}) => {
  if (!chordName) return null;

  const diagramData = getChordDiagram(chordName);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chord Title */}
        <div className="mb-4">
          <span className="text-xs text-amber-500 font-mono font-bold uppercase tracking-wider block">
            Dicionário de Acordes
          </span>
          <h3 className="text-4xl font-extrabold text-white font-mono mt-1">
            {chordName}
          </h3>
        </div>

        {diagramData ? (
          <div className="space-y-6">
            
            {/* Guitar Diagram (Violão / Guitarra) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-3">
                <Guitar className="w-4 h-4 text-amber-400" />
                <span>Violão / Guitarra</span>
                {diagramData.guitar.baseFret && diagramData.guitar.baseFret > 1 && (
                  <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                    {diagramData.guitar.baseFret}ª Casa
                  </span>
                )}
              </div>

              {/* Render Guitar Fretboard SVG */}
              <div className="w-48 h-48 relative flex items-center justify-center">
                <GuitarFretboardSVG 
                  frets={diagramData.guitar.frets} 
                  barre={diagramData.guitar.barre} 
                  baseFret={diagramData.guitar.baseFret || 1}
                />
              </div>

              {/* Fret indicator legend */}
              <div className="flex justify-between w-40 text-[10px] text-slate-500 font-mono mt-2">
                <span>E</span>
                <span>A</span>
                <span>D</span>
                <span>G</span>
                <span>B</span>
                <span>e</span>
              </div>
            </div>

            {/* Piano / Keyboard Notes */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
                <Music className="w-4 h-4 text-sky-400" />
                <span>Teclado / Piano (Notas)</span>
              </div>
              <div className="flex justify-center items-center gap-2 mt-2">
                {diagramData.piano.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-sky-300 shadow-inner"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">
            <p>Diagrama visual não catalogado para este acorde exato ({chordName}).</p>
            <p className="text-xs text-slate-500 mt-2">
              Você pode tocar a tríade base ou alterar a afinação.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-xl border border-slate-700 transition"
        >
          Fechar
        </button>

      </div>
    </div>
  );
};

// SVG Renderer for Guitar Fretboard
const GuitarFretboardSVG: React.FC<{
  frets: number[]; // 6 strings
  barre?: number;
  baseFret: number;
}> = ({ frets, barre, baseFret }) => {
  const width = 160;
  const height = 170;
  const numFrets = 4;
  const stringSpacing = width / 5;
  const fretSpacing = (height - 30) / numFrets;

  return (
    <svg width={width} height={height} className="select-none">
      {/* Nut (first thick fret if baseFret === 1) */}
      {baseFret === 1 ? (
        <line x1={0} y1={25} x2={width} y2={25} stroke="#94a3b8" strokeWidth={4} />
      ) : (
        <text x={-2} y={35} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
          {baseFret}fr
        </text>
      )}

      {/* 4 Frets Horizontal lines */}
      {Array.from({ length: numFrets }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={0}
          y1={25 + (i + 1) * fretSpacing}
          x2={width}
          y2={25 + (i + 1) * fretSpacing}
          stroke="#475569"
          strokeWidth={1.5}
        />
      ))}

      {/* 6 Strings Vertical lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={i * stringSpacing}
          y1={25}
          x2={i * stringSpacing}
          y2={25 + numFrets * fretSpacing}
          stroke="#64748b"
          strokeWidth={1 + (5 - i) * 0.3}
        />
      ))}

      {/* Markers (dots, open 'O', muted 'X') */}
      {frets.map((fretVal, stringIdx) => {
        const x = stringIdx * stringSpacing;

        if (fretVal === -1) {
          // Muted string (X above nut)
          return (
            <text
              key={`x-${stringIdx}`}
              x={x}
              y={18}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="12"
              fontWeight="bold"
            >
              ×
            </text>
          );
        }

        if (fretVal === 0) {
          // Open string (O above nut)
          return (
            <circle
              key={`o-${stringIdx}`}
              cx={x}
              cy={14}
              r={4}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={1.5}
            />
          );
        }

        // Fretted finger dot
        const adjustedFret = fretVal >= baseFret ? fretVal - baseFret + 1 : fretVal;
        const y = 25 + (adjustedFret - 0.5) * fretSpacing;

        return (
          <circle
            key={`dot-${stringIdx}`}
            cx={x}
            cy={y}
            r={6}
            fill="#fbbf24"
            stroke="#0f172a"
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
};
