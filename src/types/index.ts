export type Category = 
  | 'Adoração' 
  | 'Celebração' 
  | 'Louvor' 
  | 'Comunhão'
  | 'Ceia' 
  | 'Oferta'
  | 'Ofertório'
  | 'Gratidão' 
  | 'Hinos' 
  | 'Geral';

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;            // Original key, e.g. "A", "G", "F#", "Bb"
  bpm: number;
  timeSig: string;        // e.g. "4/4", "6/8", "3/4"
  category: Category;
  chords: string;         // Chords formatted text, with <c> tags or raw
  inSetlist: boolean;     // Quick setlist flag for default service
  capo?: number;          // Recommended capo fret (0 = no capo)
  notes?: string;         // Band notes, arrangement tips
  tags?: string[];
  lastPlayed?: string;
  link?: string;          // Youtube/Spotify reference link
}

export interface SetlistItem {
  songId: string;
  transposition?: number; // Semitones transposed for this specific service
  transitionNote?: string; // e.g. "Emendar com solo de guitarra / Pad contínuo em D"
  ministerNotes?: string;
}

export interface Setlist {
  id: string;
  title: string;
  date: string;
  minister: string;
  items: SetlistItem[];
  notes?: string;
}

export type ViewTab = 'repertorio' | 'setlist' | 'detalhe' | 'cadastrar' | 'metronomo';

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSig: string;
  soundType: 'woodblock' | 'click' | 'beep' | 'cowbell';
  volume: number; // 0 to 1
  accentFirstBeat: boolean;
}
