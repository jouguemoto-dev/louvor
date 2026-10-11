import React, { useState, useMemo } from 'react';
import { Song, Category } from '../types';
import { 
  Search, 
  Plus, 
  Check, 
  Edit3, 
  Trash2, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  Music, 
  Clock, 
  ArrowUpDown,
  Link,
  Loader2
} from 'lucide-react';

interface RepertorioViewProps {
  songs: Song[];
  onOpenSong: (id: string) => void;
  onEditSong: (id: string) => void;
  onDeleteSong: (id: string) => void;
  onToggleSetlist: (id: string) => void;
  onOpenNewSong: () => void;
  onSaveImportedSong?: (songData: Omit<Song, 'id'>) => void;
}

const CATEGORIES: Category[] = [
  'Geral',
  'Adoração',
  'Celebração',
  'Louvor',
  'Comunhão',
  'Oferta',
  'Hinos',
  'Gratidão',
];

export const RepertorioView: React.FC<RepertorioViewProps> = ({
  songs,
  onOpenSong,
  onEditSong,
  onDeleteSong,
  onToggleSetlist,
  onOpenNewSong,
  onSaveImportedSong,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedKey, setSelectedKey] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'title' | 'bpm' | 'artist'>('title');

  // Quick Cifra Club URL import
  const [quickLink, setQuickLink] = useState('');
  const [isQuickImporting, setIsQuickImporting] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleQuickImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLink.trim()) return;

    if (!quickLink.includes('cifraclub.com.br')) {
      setQuickFeedback({ text: 'Insira um link do Cifra Club (ex: https://www.cifraclub.com.br/artista/musica/)', isError: true });
      setTimeout(() => setQuickFeedback(null), 4000);
      return;
    }

    setIsQuickImporting(true);
    setQuickFeedback({ text: 'Buscando cifra no Cifra Club...' });

    try {
      const res = await fetch('/api/import-cifraclub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: quickLink.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível importar.');
      }

      const songData = data.data;
      if (onSaveImportedSong) {
        onSaveImportedSong({
          title: songData.title,
          artist: songData.artist,
          key: songData.key,
          bpm: songData.bpm || 120,
          timeSig: songData.timeSig || '4/4',
          category: songData.category || 'Adoração',
          chords: songData.chords,
          notes: songData.notes || '',
          link: songData.link,
          capo: songData.capo || 0,
          inSetlist: false
        });
      }

      setQuickFeedback({ text: `✅ "${songData.title}" cadastrada com sucesso!` });
      setQuickLink('');
      setTimeout(() => setQuickFeedback(null), 4000);
    } catch (err: any) {
      setQuickFeedback({ text: err.message || 'Erro ao importar cifra do link.', isError: true });
      setTimeout(() => setQuickFeedback(null), 4000);
    } finally {
      setIsQuickImporting(false);
    }
  };

  // Unique keys available in the database
  const availableKeys = useMemo(() => {
    const keys = Array.from(new Set(songs.map(s => s.key).filter(Boolean)));
    return keys.sort();
  }, [songs]);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchQuery = 
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase()) ||
        song.chords.toLowerCase().includes(search.toLowerCase());

      const matchCategory = 
        selectedCategory === 'Todas' || song.category === selectedCategory;

      const matchKey = 
        selectedKey === 'Todos' || song.key === selectedKey;

      return matchQuery && matchCategory && matchKey;
    }).sort((a, b) => {
      if (sortBy === 'bpm') return a.bpm - b.bpm;
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      return a.title.localeCompare(b.title);
    });
  }, [songs, search, selectedCategory, selectedKey, sortBy]);

  const setlistCount = useMemo(() => songs.filter(s => s.inSetlist).length, [songs]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Repertório de Louvor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {songs.length} músicas cadastradas no acervo · {setlistCount} selecionadas para o culto
          </p>
        </div>

        <button
          onClick={onOpenNewSong}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/10 active:scale-95 transition text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Cifra</span>
        </button>
      </div>

      {/* Quick Cifra Club Direct Importer Bar */}
      <form onSubmit={handleQuickImport} className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
            <Link className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="url"
              value={quickLink}
              onChange={(e) => setQuickLink(e.target.value)}
              placeholder="Cadastrar colando o link do Cifra Club (ex: https://www.cifraclub.com.br/isaias-saad/bondade-de-deus/)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isQuickImporting || !quickLink.trim()}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md whitespace-nowrap"
          >
            {isQuickImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Importar Cifra do Link</span>
              </>
            )}
          </button>
        </div>

        {quickFeedback && (
          <p className={`text-xs mt-2 font-medium ${quickFeedback.isError ? 'text-red-400' : 'text-amber-400'}`}>
            {quickFeedback.text}
          </p>
        )}
      </form>

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, ministro, acordes ou letra..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filter by Tone */}
          <div className="flex gap-2">
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition"
              aria-label="Filtrar por Tom"
            >
              <option value="Todos">Todos os Tons</option>
              {availableKeys.map(k => (
                <option key={k} value={k}>Tom: {k}</option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'bpm' | 'artist')}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition"
              aria-label="Ordenar repertório"
            >
              <option value="title">A-Z (Título)</option>
              <option value="artist">Ministério / Cantor</option>
              <option value="bpm">BPM (Tempo)</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Functional filter tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'Todas'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todas as Categorias
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Song List / Grid */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-900/30">
          <Music className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-200">Nenhuma música encontrada</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {search || selectedCategory !== 'Todas' || selectedKey !== 'Todos'
              ? 'Tente remover os filtros ou buscar por outro termo.'
              : 'Seu repertório está vazio. Clique abaixo para cadastrar a primeira cifra!'}
          </p>
          <button
            onClick={onOpenNewSong}
            className="mt-4 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Primeira Cifra
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSongs.map((song) => {
            return (
              <div
                key={song.id}
                onClick={() => onOpenSong(song.id)}
                className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition truncate leading-snug">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>

                    {/* Quick Setlist Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSetlist(song.id);
                      }}
                      className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border transition-all ${
                        song.inSetlist
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700 hover:border-slate-600'
                      }`}
                      title={song.inSetlist ? 'Na escala do culto (clique para remover)' : 'Adicionar à escala do culto'}
                      aria-label="Adicionar à escala"
                    >
                      {song.inSetlist ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>

                  {/* Clean Metadata Line (Anti-pill: text with typographic separators) */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                    <span className="font-mono font-bold text-amber-400">Tom: {song.key}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="tabular-nums">{song.bpm} BPM</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{song.timeSig}</span>
                    {song.category && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-300">{song.category}</span>
                      </>
                    )}
                  </div>

                  {/* Optional Arrangement Notes snippet */}
                  {song.notes && (
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic">
                      💡 {song.notes}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="text-[11px] text-amber-500/80 group-hover:text-amber-400 font-semibold flex items-center gap-1">
                    Abrir Cifra →
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEditSong(song.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      title="Editar Cifra"
                      aria-label="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSong(song.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Excluir Cifra"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
