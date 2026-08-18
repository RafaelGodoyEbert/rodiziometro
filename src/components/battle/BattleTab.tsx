import React from 'react';
import { ParticipantStats, Achievement } from '../../types';
import { Trophy, Award, Info, Flame, ShieldAlert } from 'lucide-react';

interface BattleTabProps {
  statsList: ParticipantStats[];
  myParticipantId: string;
  achievements: Achievement[];
}

export const BattleTab: React.FC<BattleTabProps> = ({
  statsList,
  myParticipantId,
  achievements,
}) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return (
          <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-700">
            {rank}º
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-slate-200">Pontos de Destruição</span> são uma mecânica recreativa do jogo para disputar com a mesa, e não representam equivalência nutricional.
        </p>
      </div>

      {/* Leaderboard Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Placar em Tempo Real
        </h2>
        <span className="text-xs font-bold text-slate-400">
          {statsList.length} {statsList.length === 1 ? 'participante' : 'participantes'}
        </span>
      </div>

      {/* Leaderboard Cards */}
      <div className="space-y-2.5">
        {statsList.map((stat) => {
          const isMe = stat.participantId === myParticipantId;
          const isWinner = stat.rank === 1;

          return (
            <div
              key={stat.participantId}
              className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                isMe
                  ? 'bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border-orange-500/60 shadow-lg shadow-orange-500/10'
                  : isWinner
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-md'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">{getRankBadge(stat.rank)}</div>

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                    style={{ backgroundColor: stat.avatarColor }}
                  >
                    {stat.nickname.charAt(0).toUpperCase()}
                  </div>

                  {/* Nickname & Favorite */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-sm">{stat.nickname}</h3>
                      {isMe && (
                        <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1.5 py-0.2 rounded">
                          Você
                        </span>
                      )}
                    </div>
                    {stat.favoriteFoodName && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{stat.favoriteFoodEmoji}</span>
                        <span className="truncate max-w-[130px]">{stat.favoriteFoodName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Score & Items */}
                <div className="text-right">
                  <div className="text-xl font-black text-amber-400 leading-none">
                    {stat.totalPoints} <span className="text-xs font-normal text-slate-400">pts</span>
                  </div>
                  <div className="text-xs font-bold text-orange-400 mt-1">
                    {stat.totalItems} {stat.totalItems === 1 ? 'item' : 'itens'}
                  </div>
                </div>
              </div>

              {/* Category Crowns */}
              {stat.crowns.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
                  {stat.crowns.map((crown, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md"
                    >
                      {crown}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievements Section */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-orange-400" />
          Conquistas da Batalha
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-2xl p-1.5 bg-slate-800/80 rounded-lg flex-shrink-0">
                {ach.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                {ach.unlocked && (
                  <span className="text-[10px] font-bold text-amber-400 block mt-1">
                    ✓ Desbloqueado!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
