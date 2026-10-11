/**
 * LouvorApp - Ministério de Louvor & Gestão de Cifras
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Song, ViewTab } from './types';
import { INITIAL_SONGS } from './data/initialSongs';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { RepertorioView } from './components/RepertorioView';
import { SongDetailView } from './components/SongDetailView';
import { SetlistView } from './components/SetlistView';
import { CadastrarModal } from './components/CadastrarModal';
import { MetronomeModal } from './components/MetronomeModal';
import { ChordDiagramModal } from './components/ChordDiagramModal';
import { Download, Upload, RotateCcw, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'louvor_songs_v4';

export default function App() {
  // Load initial songs from localStorage or fallback to curated worship anthems
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem('louvor_songs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Sanitize each song to ensure essential properties exist
            return parsed.map((item, idx) => ({
              id: item.id || String(idx + 1),
              title: item.title || 'Música Sem Título',
              artist: item.artist || 'Ministério de Louvor',
              key: item.key || 'C',
              bpm: Number(item.bpm) || 120,
              timeSig: item.timeSig || '4/4',
              category: item.category || 'Adoração',
              chords: item.chords || '',
              inSetlist: Boolean(item.inSetlist),
              notes: item.notes || '',
              capo: item.capo || 0,
            }));
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage:', e);
    }
    return INITIAL_SONGS;
  });

  const [currentTab, setCurrentTab] = useState<ViewTab>('repertorio');
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  
  // Modals state
  const [isCadastrarOpen, setIsCadastrarOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [metronomeTimeSig, setMetronomeTimeSig] = useState('4/4');

  const [inspectedChord, setInspectedChord] = useState<string | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.error('Falha ao salvar no armazenamento local:', e);
    }
  }, [songs]);

  // Open a song in the stage chord viewer
  const handleOpenSong = (id: string) => {
    setSelectedSongId(id);
    setCurrentTab('detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open modal to create a new song
  const handleOpenNewSong = () => {
    setEditingSong(null);
    setIsCadastrarOpen(true);
  };

  // Open modal to edit an existing song
  const handleEditSong = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (song) {
      setEditingSong(song);
      setIsCadastrarOpen(true);
    }
  };

  // Delete a song
  const handleDeleteSong = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (!song) return;
    if (confirm(`Deseja realmente excluir "${song.title}" do repertório?`)) {
      setSongs(prev => prev.filter(s => s.id !== id));
      if (selectedSongId === id) {
        setSelectedSongId(null);
        setCurrentTab('repertorio');
      }
    }
  };

  // Toggle setlist inclusion
  const handleToggleSetlist = (id: string) => {
    setSongs(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, inSetlist: !s.inSetlist };
      }
      return s;
    }));
  };

  // Remove directly from setlist
  const handleRemoveFromSetlist = (id: string) => {
    setSongs(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, inSetlist: false };
      }
      return s;
    }));
  };

  // Reorder setlist items
  const handleReorderSetlist = (newOrderSongIds: string[]) => {
    setSongs(prev => {
      const setlistMap = new Map(prev.map(s => [s.id, s]));
      const reordered: Song[] = [];

      // Add reordered setlist items first
      for (const id of newOrderSongIds) {
        const song = setlistMap.get(id);
        if (song) {
          reordered.push(song);
          setlistMap.delete(id);
        }
      }

      // Append remaining non-setlist songs
      for (const song of setlistMap.values()) {
        reordered.push(song);
      }

      return reordered;
    });
  };

  // Save new or updated song
  const handleSaveSong = (songData: Omit<Song, 'id'>, existingId?: string) => {
    if (existingId) {
      setSongs(prev => prev.map(s => {
        if (s.id === existingId) {
          return { ...songData, id: existingId };
        }
        return s;
      }));
    } else {
      const newSong: Song = {
        ...songData,
        id: Date.now().toString(),
      };
      setSongs(prev => [newSong, ...prev]);
    }
    setIsCadastrarOpen(false);
    setEditingSong(null);
  };

  // Open Metronome with optional song context
  const handleOpenMetronome = (bpm?: number, timeSig?: string) => {
    if (bpm) setMetronomeBpm(bpm);
    if (timeSig) setMetronomeTimeSig(timeSig);
    setIsMetronomeOpen(true);
  };

  // Iniciar Modo Culto (jump to first song in setlist)
  const handleStartWorshipService = () => {
    const setlistSongs = songs.filter(s => s.inSetlist);
    if (setlistSongs.length > 0) {
      handleOpenSong(setlistSongs[0].id);
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `louvor_repertorio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setSongs(imported);
          alert(`${imported.length} músicas importadas com sucesso!`);
        } else {
          alert('Formato de arquivo JSON inválido.');
        }
      } catch (err) {
        alert('Erro ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Reset to default sample repertoire
  const handleResetDefaults = () => {
    if (confirm('Deseja restaurar as músicas originais da Harpa Cristã e adoração contemporânea?')) {
      setSongs(INITIAL_SONGS);
      setSelectedSongId(null);
      setCurrentTab('repertorio');
    }
  };

  // Current active song object
  const activeSong = selectedSongId ? songs.find(s => s.id === selectedSongId) : null;
  const setlistSongs = songs.filter(s => s.inSetlist);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'detalhe') setSelectedSongId(null);
        }}
        onOpenNewSong={handleOpenNewSong}
        onOpenMetronome={() => handleOpenMetronome()}
        setlistCount={setlistSongs.length}
      />

      {/* Main View Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'repertorio' && (
          <RepertorioView
            songs={songs}
            onOpenSong={handleOpenSong}
            onEditSong={handleEditSong}
            onDeleteSong={handleDeleteSong}
            onToggleSetlist={handleToggleSetlist}
            onOpenNewSong={handleOpenNewSong}
          />
        )}

        {currentTab === 'setlist' && (
          <SetlistView
            songs={songs}
            onOpenSong={handleOpenSong}
            onRemoveFromSetlist={handleRemoveFromSetlist}
            onReorderSetlist={handleReorderSetlist}
            onToggleSetlist={handleToggleSetlist}
            onStartWorshipService={handleStartWorshipService}
          />
        )}

        {currentTab === 'detalhe' && (
          activeSong ? (
            <SongDetailView
              song={activeSong}
              onBack={() => {
                setCurrentTab('repertorio');
                setSelectedSongId(null);
              }}
              onEdit={handleEditSong}
              onDelete={handleDeleteSong}
              onOpenMetronome={(bpm, timeSig) => handleOpenMetronome(bpm, timeSig)}
              onInspectChord={(chord) => setInspectedChord(chord)}
              setlistSongs={setlistSongs}
              onNavigateSong={(nextId) => handleOpenSong(nextId)}
            />
          ) : (
            <RepertorioView
              songs={songs}
              onOpenSong={handleOpenSong}
              onEditSong={handleEditSong}
              onDeleteSong={handleDeleteSong}
              onToggleSetlist={handleToggleSetlist}
              onOpenNewSong={handleOpenNewSong}
            />
          )
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'detalhe') setSelectedSongId(null);
        }}
        onOpenNewSong={handleOpenNewSong}
        onOpenMetronome={() => handleOpenMetronome()}
        setlistCount={setlistSongs.length}
      />

      {/* Clean Footer (Quiet site info & backup tools, anti-slop) */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">LouvorApp</span>
            <span aria-hidden="true">·</span>
            <span>Ministério de Louvor & Adoração</span>
            <span aria-hidden="true">·</span>
            <span>Offline-Ready (Web Audio API)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportBackup}
              className="hover:text-slate-300 transition flex items-center gap-1"
              title="Baixar cópia de segurança do repertório em arquivo JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Backup</span>
            </button>

            <label className="hover:text-slate-300 transition flex items-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Restaurar Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetDefaults}
              className="hover:text-amber-400 transition flex items-center gap-1"
              title="Restaurar músicas padrão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Padrões</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CadastrarModal
        isOpen={isCadastrarOpen}
        songToEdit={editingSong}
        onClose={() => {
          setIsCadastrarOpen(false);
          setEditingSong(null);
        }}
        onSave={handleSaveSong}
      />

      <MetronomeModal
        isOpen={isMetronomeOpen}
        initialBpm={metronomeBpm}
        initialTimeSig={metronomeTimeSig}
        onClose={() => setIsMetronomeOpen(false)}
      />

      <ChordDiagramModal
        chordName={inspectedChord}
        onClose={() => setInspectedChord(null)}
      />

    </div>
  );
}
