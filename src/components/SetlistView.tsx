import React, { useState } from 'react';
import { Song, Setlist } from '../types';
import { 
  Play, 
  Share2, 
  Printer, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Music, 
  Calendar, 
  User, 
  Clock, 
  Sparkles,
  Check,
  Edit2,
  FileText
} from 'lucide-react';

interface SetlistViewProps {
  songs: Song[];
  onOpenSong: (id: string) => void;
  onRemoveFromSetlist: (id: string) => void;
  onReorderSetlist: (newOrderSongIds: string[]) => void;
  onToggleSetlist: (id: string) => void;
  onStartWorshipService: () => void;
}

export const SetlistView: React.FC<SetlistViewProps> = ({
  songs,
  onOpenSong,
  onRemoveFromSetlist,
  onReorderSetlist,
  onToggleSetlist,
  onStartWorshipService,
}) => {
  const setlistSongs = songs.filter(s => s.inSetlist);
  
  // Custom transition notes state (stored in local state or attached)
  const [transitionNotes, setTransitionNotes] = useState<Record<string, string>>({
    '1': 'Repertório 1 - Entrada animada com teclado e bateria. Segurar último acorde de Lá para oração inicial.',
    '2': 'Repertório 2 - Transição suave para ambiente de adoração ("Minhas lamparinas estão acesas").',
    '3': 'Repertório 3 - Declaração de fé e perseverança com toda a congregação ("Vai valer a pena").',
    '4': 'Momento da Comunhão / Santa Ceia - Reverência no partir do pão e cálice ("Nosso coração queima").',
    '5': 'Momento da Oferta e Dízimos - Celebração e consagração ("Tudo que eu tenho é Teu").',
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [serviceTitle, setServiceTitle] = useState<string>('Culto de Celebração - Domingo');
  const [ministerName, setMinisterName] = useState<string>('Equipe de Louvor');
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddPickerOpen, setIsAddPickerOpen] = useState<boolean>(false);

  // Estimated duration: ~5 minutes per song average
  const estimatedMinutes = setlistSongs.length * 5;

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const currentOrder = setlistSongs.map(s => s.id);
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[index - 1];
    currentOrder[index - 1] = temp;
    onReorderSetlist(currentOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === setlistSongs.length - 1) return;
    const currentOrder = setlistSongs.map(s => s.id);
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[index + 1];
    currentOrder[index + 1] = temp;
    onReorderSetlist(currentOrder);
  };

  const handleSaveNote = (songId: string) => {
    setTransitionNotes(prev => ({ ...prev, [songId]: noteDraft }));
    setEditingNoteId(null);
  };

  const handleShareWhatsApp = () => {
    let message = `📋 *ESCALA DE LOUVOR*\n`;
    message += `🏛️ *${serviceTitle}*\n`;
    message += `👤 Ministro: *${ministerName}*\n`;
    message += `📅 Data: *${serviceDate}*\n`;
    message += `⏱️ Músicas: *${setlistSongs.length}* (~${estimatedMinutes} min)\n\n`;
    message += `*ORDEM DO CULTO:*\n`;

    setlistSongs.forEach((song, idx) => {
      message += `\n*${idx + 1}. ${song.title}* - ${song.artist}\n`;
      message += `   • Tom: *${song.key}* | BPM: *${song.bpm}* | Compasso: ${song.timeSig}\n`;
      if (transitionNotes[song.id]) {
        message += `   • _Obs: ${transitionNotes[song.id]}_\n`;
      }
    });

    message += `\n_Gerado pelo LouvorApp 🎵_`;

    if (navigator.share) {
      navigator.share({
        title: serviceTitle,
        text: message
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message);
      alert('Escala do culto copiada com sucesso! Cole no grupo do WhatsApp da banda.');
    }
  };

  const availableToAdd = songs.filter(s => !s.inSetlist);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      
      {/* Header & Quick Action */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                Planejamento do Culto
              </span>
            </div>
            <input
              type="text"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-extrabold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none transition w-full mt-1"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {setlistSongs.length > 0 && (
              <button
                onClick={onStartWorshipService}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Modo Culto</span>
              </button>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold transition"
              title="Compartilhar escala no WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Service Details Bar (Date, Minister, Totals) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-amber-500 shrink-0" />
            <input
              type="text"
              value={ministerName}
              onChange={(e) => setMinisterName(e.target.value)}
              placeholder="Nome do Ministro de Louvor"
              className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500 w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-400 sm:justify-end">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {setlistSongs.length} músicas · Bloco de aprox. <strong>{estimatedMinutes} min</strong>
            </span>
          </div>
        </div>

        {/* Tone Progression Ribbon (Harmonic Flow) */}
        {setlistSongs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs overflow-x-auto pb-1">
            <span className="text-slate-400 font-medium whitespace-nowrap">Sequência de Tons:</span>
            <div className="flex items-center gap-1.5">
              {setlistSongs.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold whitespace-nowrap">
                    {s.key}
                  </span>
                  {idx < setlistSongs.length - 1 && (
                    <span className="text-slate-600 font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Setlist Song Items */}
      {setlistSongs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-900/30">
          <Music className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-200">Nenhuma música adicionada ao culto</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Vá até o repertório e clique no botão "+" para adicionar músicas a esta celebração.
          </p>
          <button
            onClick={() => setIsAddPickerOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            <Plus className="w-4 h-4" />
            Adicionar Músicas do Repertório
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {setlistSongs.map((song, index) => {
            const hasNote = !!transitionNotes[song.id];
            const isEditing = editingNoteId === song.id;

            return (
              <div
                key={song.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 transition hover:border-slate-700 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Song Order Number & Title */}
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-extrabold flex items-center justify-center text-sm shrink-0 mt-0.5">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpenSong(song.id)}>
                      <h3 className="font-bold text-base text-slate-100 hover:text-amber-400 transition truncate leading-snug">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {song.artist}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="font-mono font-bold text-amber-400">Tom: {song.key}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="tabular-nums">{song.bpm} BPM</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{song.timeSig}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ordering & Remove Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 transition"
                      title="Mover para cima"
                      aria-label="Mover para cima"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === setlistSongs.length - 1}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-700 transition"
                      title="Mover para baixo"
                      aria-label="Mover para baixo"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRemoveFromSetlist(song.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent transition ml-1"
                      title="Remover do culto"
                      aria-label="Remover do culto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Transition / Arrangement Note for Worship Band */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Ex: Entrar com violão dedilhado, transição suave para Ré..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNote(song.id)}
                        className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-400"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="text-slate-400 px-2 py-1.5 text-xs hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      {hasNote ? (
                        <div className="flex items-center gap-1.5 text-amber-300/90 italic">
                          <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{transitionNotes[song.id]}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Sem observações para a banda nesta música.
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setEditingNoteId(song.id);
                          setNoteDraft(transitionNotes[song.id] || '');
                        }}
                        className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 underline ml-2 whitespace-nowrap"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{hasNote ? 'Editar nota' : '+ Adicionar nota para a banda'}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add More Songs Drawer Trigger */}
      {availableToAdd.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Adicionar mais músicas do acervo</h4>
              <p className="text-xs text-slate-400">{availableToAdd.length} outras músicas disponíveis</p>
            </div>
            <button
              onClick={() => setIsAddPickerOpen(!isAddPickerOpen)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 font-semibold transition"
            >
              {isAddPickerOpen ? 'Fechar Lista' : '+ Adicionar'}
            </button>
          </div>

          {isAddPickerOpen && (
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {availableToAdd.map(song => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:bg-slate-800 text-xs transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-200 truncate">{song.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{song.artist} · Tom {song.key}</p>
                  </div>
                  <button
                    onClick={() => onToggleSetlist(song.id)}
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shrink-0 transition"
                    title="Adicionar à escala"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
