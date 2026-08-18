import React, { useRef, useState } from 'react';
import { Room, ParticipantStats, TableCuriosities } from '../../types';
import { Trophy, Share2, Download, RefreshCw, Flame, Scale, Clock, Sparkles } from 'lucide-react';

interface SummaryViewProps {
  room: Room;
  myStats: ParticipantStats | null;
  myCuriosities: TableCuriosities;
  tableCuriosities: TableCuriosities;
  allStats: ParticipantStats[];
  onRestart: () => void;
}

const FUN_QUOTES = [
  'O restaurante sobreviveu. Por pouco.',
  'A gerência pediu para trocar a chave do rodízio.',
  'Entrou para o rodízio, saiu lenda.',
  'Guerra declarada ao buffet e vencida com louvor.',
  'A cozinha pediu arrego.',
];

export const SummaryView: React.FC<SummaryViewProps> = ({
  room,
  myStats,
  myCuriosities,
  tableCuriosities,
  allStats,
  onRestart,
}) => {
  const [quote] = useState(() => FUN_QUOTES[Math.floor(Math.random() * FUN_QUOTES.length)]);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const durationMinutes = Math.max(1, Math.round((Date.now() - room.createdAt) / 60000));
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}h${mins}m` : `${mins} min`;

  const handleShareSummary = async () => {
    const text = `🔥 RELATÓRIO DA DESTRUIÇÃO - Rodiziômetro\n\n` +
      `👤 ${myStats?.nickname || 'Você'}: ${myStats?.totalItems || 0} itens • ${myStats?.totalPoints || 0} pts\n` +
      `🏆 Posição: ${myStats?.rank || 1}º da Mesa\n` +
      `🔥 ~${myCuriosities.estimatedKcalMin}–${myCuriosities.estimatedKcalMax} kcal • ~${myCuriosities.estimatedWeightKg} kg\n` +
      `💬 "${quote}"\n\n` +
      `Dispute você também com a mesa no Rodiziômetro!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Relatório da Destruição - Rodiziômetro',
          text,
        });
      } catch {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
          Fim da Batalha
        </span>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Relatório da Destruição
        </h1>
        <p className="text-xs text-slate-400">Mesa #{room.code} • Duração: {durationText}</p>
      </div>

      {/* Shareable Instagram Story Card Preview */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-orange-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-xl flex items-center justify-center shadow-lg">
              🍕
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{myStats?.nickname || 'Você'}</h2>
              <p className="text-xs font-bold text-orange-400">
                {myStats?.rank === 1 ? '🏆 1º Lugar na Mesa' : `${myStats?.rank}º da Mesa`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-amber-400 block leading-none">
              {myStats?.totalPoints}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">pts de destruição</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-2xl font-black text-white block">
              {myStats?.totalItems || 0}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Itens Consumidos</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-lg font-black text-white block mt-1">
              ~{myCuriosities.estimatedWeightKg} kg
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Peso Estimado</span>
          </div>
        </div>

        {/* Secondary Info list */}
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Calorias:
            </span>
            <span className="font-bold text-white">
              ~{myCuriosities.estimatedKcalMin}–{myCuriosities.estimatedKcalMax} kcal
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">🥩 Proteínas:</span>
            <span className="font-bold text-white">~{myCuriosities.estimatedProteinGrams}g</span>
          </div>

          {myStats?.favoriteFoodName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">🍣 Especialidade:</span>
              <span className="font-bold text-amber-300">
                {myStats.favoriteFoodEmoji} {myStats.favoriteFoodName}
              </span>
            </div>
          )}

          {myCuriosities.longestStreak && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">⚡ Maior Sequência:</span>
              <span className="font-bold text-orange-400">
                {myCuriosities.longestStreak.count} itens em {myCuriosities.longestStreak.minutes} min
              </span>
            </div>
          )}
        </div>

        {/* Quote Banner */}
        <div className="text-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-xs font-bold text-amber-300 italic">"{quote}"</p>
        </div>

        {/* Footer Branding */}
        <div className="text-center pt-1">
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            RODIZIÔMETRO APP
          </p>
        </div>
      </div>

      {/* Collective Table Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Resultado Coletivo da Mesa #{room.code}
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-sm font-black text-white block">{room.participants.length}</span>
            <span className="text-[10px] text-slate-400">Participantes</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-sm font-black text-white block">{tableCuriosities.totalItems}</span>
            <span className="text-[10px] text-slate-400">Itens no Total</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-sm font-black text-amber-400 block">
              {tableCuriosities.totalPoints}
            </span>
            <span className="text-[10px] text-slate-400">Pontos da Mesa</span>
          </div>
        </div>

        {/* Final Ranking Table */}
        <div className="space-y-1.5 pt-2">
          {allStats.map((st) => (
            <div
              key={st.participantId}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">{st.rank}º</span>
                <span className="font-bold text-white">{st.nickname}</span>
              </div>
              <span className="font-bold text-slate-300">
                {st.totalPoints} pts ({st.totalItems} itens)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleShareSummary}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/25 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Copiado para a área de transferência!' : 'Compartilhar Resultado'}
        </button>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs border border-slate-700/80 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Iniciar Novo Rodízio
        </button>
      </div>
    </div>
  );
};
