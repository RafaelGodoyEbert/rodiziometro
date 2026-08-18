import React, { useState } from 'react';
import { TableCuriosities } from '../../types';
import { Flame, Scale, Clock, Zap, Cake, Layers, Lightbulb, HeartHandshake } from 'lucide-react';

interface CuriositiesTabProps {
  tableCuriosities: TableCuriosities;
  myCuriosities: TableCuriosities;
}

export const CuriositiesTab: React.FC<CuriositiesTabProps> = ({
  tableCuriosities,
  myCuriosities,
}) => {
  const [viewScope, setViewScope] = useState<'ME' | 'TABLE'>('ME');

  const activeStats = viewScope === 'ME' ? myCuriosities : tableCuriosities;

  const formatPace = (seconds: number) => {
    if (seconds <= 0) return '—';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min === 0) return `${sec}s`;
    return `${min}m${sec > 0 ? ` ${sec}s` : ''}`;
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Scope Toggle: Meu Estrago vs Estrago da Mesa */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 grid grid-cols-2 gap-1 text-xs font-bold">
        <button
          onClick={() => setViewScope('ME')}
          className={`py-2 rounded-lg transition active:scale-95 ${
            viewScope === 'ME'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Meu Estrago
        </button>
        <button
          onClick={() => setViewScope('TABLE')}
          className={`py-2 rounded-lg transition active:scale-95 ${
            viewScope === 'TABLE'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Estrago Coletivo da Mesa
        </button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="leading-snug">
          Estimativas aproximadas baseadas em médias gastronômicas comuns. Não destacado durante o consumo para garantir uma experiência sem culpa!
        </p>
      </div>

      {/* Main Stats Header Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Calories Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Calorias Aprox.
          </div>
          <div className="text-xl font-black text-white">
            ~{activeStats.estimatedKcalMin.toLocaleString()}–{activeStats.estimatedKcalMax.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">kcal estimadas</p>
        </div>

        {/* Weight Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Scale className="w-4 h-4 text-amber-500" />
            Peso Total
          </div>
          <div className="text-xl font-black text-white">
            ~{activeStats.estimatedWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">de comida consumida</p>
        </div>
      </div>

      {/* Macros Breakdown Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          Estimativa de Macronutrientes
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-lg block">🥩</span>
            <span className="text-sm font-black text-white block mt-1">
              ~{activeStats.estimatedProteinGrams}g
            </span>
            <span className="text-[10px] font-bold text-slate-400">Proteínas</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-lg block">🍞</span>
            <span className="text-sm font-black text-white block mt-1">
              ~{activeStats.estimatedCarbsGrams}g
            </span>
            <span className="text-[10px] font-bold text-slate-400">Carbos</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-lg block">🧈</span>
            <span className="text-sm font-black text-white block mt-1">
              ~{activeStats.estimatedFatGrams}g
            </span>
            <span className="text-[10px] font-bold text-slate-400">Gorduras</span>
          </div>
        </div>
      </div>

      {/* Fun Curiosities Grid */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider px-1">
          Estatísticas Divertidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Eating Pace */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-lg text-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Ritmo de Consumo</p>
              <p className="text-sm font-black text-white mt-0.5">
                1 item a cada {formatPace(activeStats.paceSecondsPerItem)}
              </p>
            </div>
          </div>

          {/* Favorite Item */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg text-2xl">
              {activeStats.favoriteFood?.emoji || '🍕'}
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Item Favorito</p>
              <p className="text-sm font-black text-white mt-0.5">
                {activeStats.favoriteFood?.name || 'Nenhum item ainda'}
                {activeStats.favoriteFood && (
                  <span className="text-xs text-orange-400 ml-1">
                    ({activeStats.favoriteFood.count}x)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg text-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Pico de Destruição</p>
              <p className="text-sm font-black text-white mt-0.5">
                {activeStats.longestStreak
                  ? `${activeStats.longestStreak.count} itens em ${activeStats.longestStreak.minutes} min`
                  : 'Ritmo constante'}
              </p>
            </div>
          </div>

          {/* Variety Tried */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Variedade de Pratos</p>
              <p className="text-sm font-black text-white mt-0.5">
                {activeStats.distinctItemsCount} tipos diferentes provados
              </p>
            </div>
          </div>

          {/* Dessert Ratio */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg text-lg">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Cota de Sobremesa</p>
              <p className="text-sm font-black text-white mt-0.5">
                {activeStats.dessertPercentage}% do consumo total foi doce
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
