import React from 'react';
import { PersonalRecord } from '../../types';
import { Sparkles, Swords, Calculator, Trophy, Flame } from 'lucide-react';

interface HomeViewProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
  onStartSoloMode: () => void;
  personalRecord: PersonalRecord;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenCreateModal,
  onOpenJoinModal,
  onStartSoloMode,
  personalRecord,
}) => {
  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Hero Visual Banner */}
      <div className="text-center py-6 space-y-3">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20 border border-orange-400/30 animate-bounce-short">
          🍕
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Rodiziômetro</h1>
          <p className="text-sm font-bold text-orange-400 mt-1">
            Conte o estrago. Dispute com a mesa.
          </p>
        </div>

        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Registre cada fatia ou peça em 1 toque, acompanhe estatísticas recreativas e veja quem manda no rodízio.
        </p>
      </div>

      {/* Main Call To Actions */}
      <div className="space-y-3">
        {/* Create Room Button */}
        <button
          onClick={onOpenCreateModal}
          className="w-full p-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-98 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 bg-white/10 rounded-xl text-xl">👑</div>
            <div>
              <span className="block text-base font-extrabold leading-tight">Criar uma Mesa</span>
              <span className="block text-xs text-orange-100/80 font-normal">
                Gere QR Code e convide a galera
              </span>
            </div>
          </div>
          <Sparkles className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Join Room Button */}
        <button
          onClick={onOpenJoinModal}
          className="w-full p-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 hover:border-amber-500/40 shadow-lg transition-all active:scale-98 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl text-xl">⚔️</div>
            <div>
              <span className="block text-base font-extrabold leading-tight">Entrar em uma Mesa</span>
              <span className="block text-xs text-slate-400 font-normal">
                Digite o código da mesa
              </span>
            </div>
          </div>
          <Swords className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Solo Counter Mode Button */}
        <button
          onClick={onStartSoloMode}
          className="w-full p-3.5 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 font-bold rounded-2xl border border-slate-800/80 transition-all active:scale-98 flex items-center justify-center gap-2 text-xs"
        >
          <Calculator className="w-4 h-4 text-slate-400" />
          Só quero contar (Sem sala nem cadastro)
        </button>
      </div>

      {/* Personal Records Card if exists */}
      {personalRecord.totalSessions > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            Seus Recordes Pessoais
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
              <span className="text-lg font-black text-orange-400 block">
                {personalRecord.maxItems}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Maior Quantidade</span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
              <span className="text-lg font-black text-amber-400 block">
                {personalRecord.maxPoints}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Maior Pontuação</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
