/**
 * Music Theory, Chord Transposition, and Chord Visualization Engine
 */

export const SCALE_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const SCALE_FLATS  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Commonly used keys in worship
export const COMMON_KEYS = [
  'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
];

/**
 * Normalizes a note and finds its semitone index (0 to 11)
 */
export function getNoteIndex(note: string): number {
  const clean = note.trim();
  let idx = SCALE_SHARPS.indexOf(clean);
  if (idx !== -1) return idx;
  idx = SCALE_FLATS.indexOf(clean);
  if (idx !== -1) return idx;

  // Handle double accidentals or special cases
  if (clean === 'E#' || clean === 'E#') return 5; // F
  if (clean === 'B#' || clean === 'B#') return 0; // C
  if (clean === 'Cb' || clean === 'Cb') return 11; // B
  if (clean === 'Fb' || clean === 'Fb') return 4; // E

  return -1;
}

/**
 * Transpose a single root or bass note by semitones
 */
export function transposeNote(note: string, semitones: number, preferFlat?: boolean): string {
  if (!note) return '';
  const idx = getNoteIndex(note);
  if (idx === -1) return note;

  let newIdx = (idx + semitones) % 12;
  if (newIdx < 0) newIdx += 12;

  const isFlat = preferFlat !== undefined ? preferFlat : note.includes('b');
  const scale = isFlat ? SCALE_FLATS : SCALE_SHARPS;

  return scale[newIdx];
}

/**
 * Transposes a complete chord string (including quality and slash bass notes like G/B, C#m7, F#sus4, D7M/F#)
 */
export function transposeChord(chord: string, semitones: number, preferFlat?: boolean): string {
  if (semitones === 0 || !chord) return chord;

  // Regex to split slash chords: e.g. "G/B", "C#m7/G#"
  const slashParts = chord.split('/');
  const mainChord = slashParts[0];
  const bassPart = slashParts[1];

  // Match root note: letter A-G followed by optional # or b
  const rootMatch = mainChord.match(/^([A-G][#b]?)(.*)$/);
  if (!rootMatch) return chord;

  const root = rootMatch[1];
  const quality = rootMatch[2] || '';
  const transposedRoot = transposeNote(root, semitones, preferFlat);

  if (bassPart) {
    const bassMatch = bassPart.match(/^([A-G][#b]?)(.*)$/);
    if (bassMatch) {
      const transposedBass = transposeNote(bassMatch[1], semitones, preferFlat) + (bassMatch[2] || '');
      return `${transposedRoot}${quality}/${transposedBass}`;
    }
  }

  return `${transposedRoot}${quality}`;
}

/**
 * Transpose all chords marked inside <c>...</c> tags in a formatted text
 */
export function transposeFormattedCifra(cifraText: string, semitones: number, preferFlat?: boolean): string {
  if (semitones === 0 || !cifraText) return cifraText;

  return cifraText.replace(/<c>(.*?)<\/c>/g, (_, chord) => {
    return `<c>${transposeChord(chord, semitones, preferFlat)}</c>`;
  });
}

/**
 * Suggest capo positions for easier chords
 * e.g., if target key is Ab, Capo 1 with G shapes, or Capo 4 with E shapes
 */
export function getCapoSuggestions(key: string): { fret: number; openKey: string; benefit: string }[] {
  const suggestions: { fret: number; openKey: string; benefit: string }[] = [];
  const easyShapes = [
    { key: 'G', label: 'Formato clássico em Sol (G)' },
    { key: 'D', label: 'Formato aberto em Ré (D)' },
    { key: 'C', label: 'Formato aberto em Dó (C)' },
    { key: 'E', label: 'Formato aberto em Mi (E)' },
    { key: 'A', label: 'Formato aberto em Lá (A)' },
  ];

  const targetIdx = getNoteIndex(key);
  if (targetIdx === -1) return suggestions;

  for (const shape of easyShapes) {
    const shapeIdx = getNoteIndex(shape.key);
    let fret = targetIdx - shapeIdx;
    if (fret < 0) fret += 12;
    if (fret > 0 && fret <= 7) {
      suggestions.push({
        fret,
        openKey: shape.key,
        benefit: `${shape.label} na casa ${fret}`
      });
    }
  }

  return suggestions;
}

/**
 * Smart parsing of raw internet chords / Cifra Club texts
 */
export function autoFormatRawChords(rawText: string): string {
  if (!rawText.trim()) return '';

  const lines = rawText.split('\n');
  const formattedLines: string[] = [];

  // Common worship song section identifiers
  const sectionRegex = /^(?:\[|\()? *(intro|introdução|refrão|refr[aã]o|estrofe|verso|ponte|bridge|solo|final|outro|interlúdio|interlude|pré-refrão|pre-chorus|parte\s*[a-d1-4]|primeira\s*parte|segunda\s*parte) *(?:\]|\))?/i;

  // Single chord regex token
  const chordTokenRegex = /^[A-G][#b]?(?:m|M|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G][#b]?)?$/;

  for (let line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    // Check if line is a section header like [Refrão] or Intro:
    const sectionMatch = trimmed.match(sectionRegex);
    if (sectionMatch || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      const cleanHeader = trimmed.replace(/[\[\]\(\)]/g, '').trim();
      formattedLines.push(`<b>[${cleanHeader}]</b>`);
      continue;
    }

    // Check if line is predominantly chords
    // Splitting by whitespace to examine words
    const words = trimmed.split(/\s+/).filter(Boolean);
    const chordCount = words.filter(w => chordTokenRegex.test(w)).length;

    // If 60% or more of the words match chord pattern and there are at least 1 chord, treat as chord line
    if (words.length > 0 && chordCount / words.length >= 0.5) {
      // Replace every chord token while preserving spaces
      const formattedLine = line.replace(/([A-G][#b]?(?:m|M|maj|min|dim|aug|sus|add)?[0-9]*(?:\/[A-G][#b]?)?)/g, (match) => {
        // Double check not to match plain english/portuguese single letter words like "A" or "E" inside normal prose
        if (chordTokenRegex.test(match)) {
          return `<c>${match}</c>`;
        }
        return match;
      });
      formattedLines.push(formattedLine);
    } else {
      // It's a lyrics line or text note
      formattedLines.push(line);
    }
  }

  return formattedLines.join('\n');
}

/**
 * Extract list of unique chords present in a song
 */
export function extractUniqueChords(cifraText: string): string[] {
  const matches = cifraText.match(/<c>(.*?)<\/c>/g);
  if (!matches) return [];
  const set = new Set<string>();
  for (const m of matches) {
    const clean = m.replace(/<\/?c>/g, '').trim();
    if (clean) set.add(clean);
  }
  return Array.from(set);
}

/**
 * Common chord diagrams for guitar (frets on 6 strings: E A D G B E, -1 = muted, 0 = open)
 * and piano keys (active note semitones relative to root)
 */
export interface ChordDiagramData {
  name: string;
  guitar: {
    frets: number[]; // 6 strings: [E, A, D, G, B, E] (-1 is X, 0 is open)
    fingers?: number[];
    barre?: number;
    baseFret?: number;
  };
  piano: {
    notes: string[]; // e.g. ["C", "E", "G"]
  };
}

export const CHORD_LIBRARY: Record<string, ChordDiagramData> = {
  'C': {
    name: 'C',
    guitar: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    piano: { notes: ['C', 'E', 'G'] }
  },
  'C#': {
    name: 'C#',
    guitar: { frets: [-1, 4, 3, 1, 2, 1], baseFret: 1, barre: 1 },
    piano: { notes: ['C#', 'F', 'G#'] }
  },
  'Db': {
    name: 'Db',
    guitar: { frets: [-1, 4, 3, 1, 2, 1], baseFret: 1, barre: 1 },
    piano: { notes: ['Db', 'F', 'Ab'] }
  },
  'D': {
    name: 'D',
    guitar: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    piano: { notes: ['D', 'F#', 'A'] }
  },
  'D#': {
    name: 'D#',
    guitar: { frets: [-1, 6, 5, 3, 4, 3], baseFret: 3, barre: 3 },
    piano: { notes: ['D#', 'G', 'A#'] }
  },
  'Eb': {
    name: 'Eb',
    guitar: { frets: [-1, 6, 5, 3, 4, 3], baseFret: 3, barre: 3 },
    piano: { notes: ['Eb', 'G', 'Bb'] }
  },
  'E': {
    name: 'E',
    guitar: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    piano: { notes: ['E', 'G#', 'B'] }
  },
  'F': {
    name: 'F',
    guitar: { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
    piano: { notes: ['F', 'A', 'C'] }
  },
  'F#': {
    name: 'F#',
    guitar: { frets: [2, 4, 4, 3, 2, 2], barre: 2, baseFret: 2 },
    piano: { notes: ['F#', 'A#', 'C#'] }
  },
  'Gb': {
    name: 'Gb',
    guitar: { frets: [2, 4, 4, 3, 2, 2], barre: 2, baseFret: 2 },
    piano: { notes: ['Gb', 'Bb', 'Db'] }
  },
  'G': {
    name: 'G',
    guitar: { frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
    piano: { notes: ['G', 'B', 'D'] }
  },
  'G#': {
    name: 'G#',
    guitar: { frets: [4, 6, 6, 5, 4, 4], barre: 4, baseFret: 4 },
    piano: { notes: ['G#', 'C', 'D#'] }
  },
  'Ab': {
    name: 'Ab',
    guitar: { frets: [4, 6, 6, 5, 4, 4], barre: 4, baseFret: 4 },
    piano: { notes: ['Ab', 'C', 'Eb'] }
  },
  'A': {
    name: 'A',
    guitar: { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    piano: { notes: ['A', 'C#', 'E'] }
  },
  'A#': {
    name: 'A#',
    guitar: { frets: [-1, 1, 3, 3, 3, 1], barre: 1, baseFret: 1 },
    piano: { notes: ['A#', 'D', 'F'] }
  },
  'Bb': {
    name: 'Bb',
    guitar: { frets: [-1, 1, 3, 3, 3, 1], barre: 1, baseFret: 1 },
    piano: { notes: ['Bb', 'D', 'F'] }
  },
  'B': {
    name: 'B',
    guitar: { frets: [-1, 2, 4, 4, 4, 2], barre: 2, baseFret: 2 },
    piano: { notes: ['B', 'D#', 'F#'] }
  },
  // Minor chords
  'Am': {
    name: 'Am',
    guitar: { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    piano: { notes: ['A', 'C', 'E'] }
  },
  'Bm': {
    name: 'Bm',
    guitar: { frets: [-1, 2, 4, 4, 3, 2], barre: 2, baseFret: 2 },
    piano: { notes: ['B', 'D', 'F#'] }
  },
  'C#m': {
    name: 'C#m',
    guitar: { frets: [-1, 4, 6, 6, 5, 4], barre: 4, baseFret: 4 },
    piano: { notes: ['C#', 'E', 'G#'] }
  },
  'Dm': {
    name: 'Dm',
    guitar: { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
    piano: { notes: ['D', 'F', 'A'] }
  },
  'Em': {
    name: 'Em',
    guitar: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    piano: { notes: ['E', 'G', 'B'] }
  },
  'F#m': {
    name: 'F#m',
    guitar: { frets: [2, 4, 4, 2, 2, 2], barre: 2, baseFret: 2 },
    piano: { notes: ['F#', 'A', 'C#'] }
  },
  'G#m': {
    name: 'G#m',
    guitar: { frets: [4, 6, 6, 4, 4, 4], barre: 4, baseFret: 4 },
    piano: { notes: ['G#', 'B', 'D#'] }
  },
  'A4': {
    name: 'A4',
    guitar: { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 4, 0] },
    piano: { notes: ['A', 'D', 'E'] }
  },
  'D9': {
    name: 'D9',
    guitar: { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
    piano: { notes: ['D', 'E', 'F#', 'A'] }
  },
  'G/B': {
    name: 'G/B',
    guitar: { frets: [-1, 2, 0, 0, 3, 3], fingers: [0, 1, 0, 0, 3, 4] },
    piano: { notes: ['B', 'D', 'G'] }
  },
  'C/E': {
    name: 'C/E',
    guitar: { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    piano: { notes: ['E', 'G', 'C'] }
  },
  'E/G#': {
    name: 'E/G#',
    guitar: { frets: [4, 2, 2, 4, 0, 0], baseFret: 2 },
    piano: { notes: ['G#', 'B', 'E'] }
  },
  'D/F#': {
    name: 'D/F#',
    guitar: { frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
    piano: { notes: ['F#', 'A', 'D'] }
  },
  'A/C#': {
    name: 'A/C#',
    guitar: { frets: [-1, 4, 2, 2, 2, 0], baseFret: 1 },
    piano: { notes: ['C#', 'E', 'A'] }
  },
  'F9': {
    name: 'F9',
    guitar: { frets: [-1, -1, 3, 2, 1, 3], fingers: [0, 0, 3, 2, 1, 4] },
    piano: { notes: ['F', 'G', 'A', 'C'] }
  },
  'Am7': {
    name: 'Am7',
    guitar: { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
    piano: { notes: ['A', 'C', 'E', 'G'] }
  },
  'Bm7': {
    name: 'Bm7',
    guitar: { frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3] },
    piano: { notes: ['B', 'D', 'F#', 'A'] }
  },
  'F#m7': {
    name: 'F#m7',
    guitar: { frets: [2, 0, 2, 2, 2, 0], fingers: [1, 0, 2, 3, 4, 0] },
    piano: { notes: ['F#', 'A', 'C#', 'E'] }
  },
  'C#m7': {
    name: 'C#m7',
    guitar: { frets: [-1, 4, 2, 4, 2, 0], baseFret: 2 },
    piano: { notes: ['C#', 'E', 'G#', 'B'] }
  },
};

export function getChordDiagram(chordName: string): ChordDiagramData | null {
  if (CHORD_LIBRARY[chordName]) return CHORD_LIBRARY[chordName];
  // Strip slash bass note if diagram not found
  const rootOnly = chordName.split('/')[0];
  if (CHORD_LIBRARY[rootOnly]) return CHORD_LIBRARY[rootOnly];
  // Strip extensions (e.g. C#m7 -> C#m, G4 -> G)
  const baseMatch = chordName.match(/^([A-G][#b]?m?)/);
  if (baseMatch && CHORD_LIBRARY[baseMatch[1]]) {
    return CHORD_LIBRARY[baseMatch[1]];
  }
  return null;
}
