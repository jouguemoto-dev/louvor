import React, { useState, useEffect } from 'react';
import { Song, Category } from '../types';
import { autoFormatRawChords, COMMON_KEYS } from '../utils/musicTheory';
import { 
  X, 
  Wand2, 
  Eye, 
  EyeOff, 
  Save, 
  Music, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface CadastrarModalProps {
  isOpen: boolean;
  songToEdit: Song | null;
  onClose: () => void;
  onSave: (songData: Omit<Song, 'id'>, existingId?: string) => void;
}

const CATEGORIES: Category[] = [
  'Geral',
  'Adoração',
  'Celebração',
  'Louvor',
  'Comunhão',
  'Oferta',
  'Hinos',
  'Ceia',
  'Gratidão',
  'Ofertório'
];

export const CadastrarModal: React.FC<CadastrarModalProps> = ({
  isOpen,
  songToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('C');
  const [bpm, setBpm] = useState(120);
  const [timeSig, setTimeSig] = useState('4/4');
  const [category, setCategory] = useState<Category>('Adoração');
  const [chords, setChords] = useState('');
  const [notes, setNotes] = useState('');
  const [quickPaste, setQuickPaste] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (songToEdit) {
      setTitle(songToEdit.title);
      setArtist(songToEdit.artist);
      setKey(songToEdit.key);
      setBpm(songToEdit.bpm);
      setTimeSig(songToEdit.timeSig);
      setCategory(songToEdit.category || 'Adoração');
      setChords(songToEdit.chords);
      setNotes(songToEdit.notes || '');
      setQuickPaste('');
    } else {
      // Defaults for new song
      setTitle('');
      setArtist('');
      setKey('C');
      setBpm(120);
      setTimeSig('4/4');
      setCategory('Adoração');
      setChords('');
      setNotes('');
      setQuickPaste('');
    }
  }, [songToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAutoFormat = () => {
    if (!quickPaste.trim()) {
      setNotification('Cole uma cifra primeiro na caixa acima antes de formatar!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const formatted = autoFormatRawChords(quickPaste);
    setChords(formatted);
    setNotification('✨ Acordes e seções formatados com sucesso!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chords.trim()) {
      setNotification('Por favor, preencha o nome da música e a cifra.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Wrap plain text chords in <c> tags if not formatted
    let finalChords = chords;
    if (!finalChords.includes('<c>')) {
      finalChords = autoFormatRawChords(finalChords);
    }

    onSave(
      {
        title: title.trim(),
        artist: artist.trim() || 'Ministério de Louvor',
        key: key.trim().toUpperCase(),
        bpm: Number(bpm) || 120,
        timeSig: timeSig.trim() || '4/4',
        category,
        chords: finalChords,
        notes: notes.trim(),
        inSetlist: songToEdit ? songToEdit.inSetlist : false,
      },
      songToEdit ? songToEdit.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">
                {songToEdit ? 'Editar Cifra de Louvor' : 'Cadastrar Nova Cifra'}
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os dados ou use o assistente de colagem rápida
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {notification && (
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{notification}</span>
            </div>
          )}

          {/* Quick Paste Assistant Box */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                Assistente de Colagem (Cifra Club / Internet)
              </span>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Copie a cifra diretamente da web, cole abaixo e clique no botão para envolver acordes e cabeçalhos automaticamente.
            </p>
            
            <textarea
              rows={3}
              value={quickPaste}
              onChange={(e) => setQuickPaste(e.target.value)}
              placeholder="Cole aqui a cifra copiada da internet..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition"
            />

            <button
              type="button"
              onClick={handleAutoFormat}
              className="mt-2 w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Formatar Acordes Automaticamente</span>
            </button>
          </div>

          {/* Song Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nome da Música *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: A Casa É Sua, Bondade de Deus"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Cantor / Ministério
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: Isaías Saad, Morada, Harpa Cristã"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Musical Parameters: Key, BPM, TimeSig, Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tom Original *
              </label>
              <select
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500 transition"
              >
                {COMMON_KEYS.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                BPM (Tempo)
              </label>
              <input
                type="number"
                min="30"
                max="260"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Compasso
              </label>
              <select
                value={timeSig}
                onChange={(e) => setTimeSig(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500 transition"
              >
                <option value="4/4">4/4</option>
                <option value="6/8">6/8</option>
                <option value="3/4">3/4</option>
                <option value="2/4">2/4</option>
                <option value="12/8">12/8</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes for Band */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Observações do Arranjo para a Banda (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Introdução no teclado, segurar refrão para oração pastoral..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Chords Text Area & Live Preview Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Cifra Completa (Acordes destacados com &lt;c&gt;Tom&lt;/c&gt;) *
              </label>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPreview ? 'Ocultar Prévia' : 'Prévia ao Vivo'}</span>
              </button>
            </div>

            {showPreview ? (
              <div 
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-cifra text-xs text-slate-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: chords
                    .replace(/<c>(.*?)<\/c>/g, '<span class="text-amber-400 font-extrabold">$1</span>')
                    .replace(/<b>\[(.*?)\]<\/b>/g, '<span class="text-sky-400 font-bold block my-1">[$1]</span>')
                }}
              />
            ) : (
              <textarea
                rows={9}
                required
                value={chords}
                onChange={(e) => setChords(e.target.value)}
                placeholder="<b>[Intro]</b> <c>C</c>  <c>G</c>  <c>Am</c>  <c>F</c>&#10;&#10;<b>[Primeira Parte]</b>&#10;<c>C</c>          <c>G</c>&#10; Letra da música de adoração...&#10;<c>Am</c>         <c>F</c>&#10; ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{songToEdit ? 'Salvar Alterações da Cifra' : 'Salvar Cifra no Repertório'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
