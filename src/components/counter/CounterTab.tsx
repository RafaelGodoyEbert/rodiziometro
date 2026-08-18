import React, { useState } from 'react';
import { FoodItem, ConsumptionEvent, ParticipantStats, FoodCategory } from '../../types';
import { Plus, Undo2, PlusCircle, Search } from 'lucide-react';

interface CounterTabProps {
  foods: FoodItem[];
  userEvents: ConsumptionEvent[];
  myStats: ParticipantStats | null;
  onAddConsumption: (food: FoodItem, quantity: number) => void;
  onUndoEvent: (eventId: string) => void;
  onOpenAddCustomModal: () => void;
  lastAddedEvent: ConsumptionEvent | null;
}

export const CounterTab: React.FC<CounterTabProps> = ({
  foods,
  userEvents,
  myStats,
  onAddConsumption,
  onUndoEvent,
  onOpenAddCustomModal,
  lastAddedEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [multiplier, setMultiplier] = useState<number>(1);

  // Count food quantities consumed by user
  const foodCounts: Record<string, number> = {};
  userEvents.forEach((evt) => {
    foodCounts[evt.foodId] = (foodCounts[evt.foodId] || 0) + evt.quantity;
  });

  // Filter & sort foods: favorites (most consumed) first
  const filteredFoods = foods
    .filter((food) => {
      const matchesCategory = selectedCategory === 'ALL' || food.category === selectedCategory;
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const countA = foodCounts[a.id] || 0;
      const countB = foodCounts[b.id] || 0;
      return countB - countA;
    });

  const categories: { id: FoodCategory | 'ALL'; label: string; emoji: string }[] = [
    { id: 'ALL', label: 'Todos', emoji: '🍽️' },
    { id: 'PIZZA', label: 'Pizza', emoji: '🍕' },
    { id: 'SUSHI', label: 'Sushi', emoji: '🍣' },
    { id: 'BURGER', label: 'Burger', emoji: '🍔' },
    { id: 'MEAT', label: 'Carnes', emoji: '🥩' },
    { id: 'PASTA', label: 'Massas', emoji: '🍝' },
    { id: 'DESSERT', label: 'Doces', emoji: '🍰' },
    { id: 'APPETIZER', label: 'Entradas', emoji: '🍟' },
    { id: 'DRINK', label: 'Bebidas', emoji: '🥤' },
  ];

  const handleTap = (food: FoodItem) => {
    // Trigger haptic vibration feedback if available
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }
    onAddConsumption(food, multiplier);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Personal Consumption Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg"
              style={{ backgroundColor: myStats?.avatarColor || '#F97316' }}
            >
              {myStats?.nickname ? myStats.nickname.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Seu Estrago Atual</p>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {myStats?.nickname || 'Você'}
                {myStats?.rank === 1 && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    🥇 1º da Mesa
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-orange-400 leading-none">
              {myStats?.totalItems || 0} <span className="text-xs font-normal text-slate-400">itens</span>
            </div>
            <div className="text-xs font-bold text-amber-400 mt-1">
              {myStats?.totalPoints || 0} pts
            </div>
          </div>
        </div>

        {/* Crowns & Badges */}
        {myStats?.crowns && myStats.crowns.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-700/60">
            {myStats.crowns.map((crown, idx) => (
              <span
                key={idx}
                className="text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md"
              >
                {crown}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Undo Toast Snackbar */}
      {lastAddedEvent && (
        <div className="bg-slate-800 border border-orange-500/40 text-slate-100 p-3 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-base">{lastAddedEvent.foodEmoji}</span>
            <div>
              <p className="font-bold text-white">
                +{lastAddedEvent.quantity} {lastAddedEvent.foodName}
              </p>
              <p className="text-[10px] text-slate-400">
                +{lastAddedEvent.pointsEarned} pts de destruição
              </p>
            </div>
          </div>

          <button
            onClick={() => onUndoEvent(lastAddedEvent.id)}
            className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-lg hover:bg-rose-500/30 active:scale-95 transition flex items-center gap-1"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Desfazer
          </button>
        </div>
      )}

      {/* Multiplier / Fast Quantities Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-400 pl-1">Quantidade por clique:</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 5, 10].map((num) => (
            <button
              key={num}
              onClick={() => setMultiplier(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                multiplier === num
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              +{num}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 border ${
              selectedCategory === cat.id
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/60 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Custom Item trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar prato..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <button
          onClick={onOpenAddCustomModal}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
          + Outro
        </button>
      </div>

      {/* Primary Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredFoods.map((food) => {
          const count = foodCounts[food.id] || 0;
          return (
            <div
              key={food.id}
              onClick={() => handleTap(food)}
              className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/40 p-3.5 rounded-2xl cursor-pointer transition-all active:scale-97 shadow-md flex items-center justify-between group select-none relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {food.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight group-hover:text-orange-300 transition-colors">
                    {food.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="text-amber-400 font-semibold">{food.destructionPoints} pts</span>
                    <span>•</span>
                    <span className="capitalize">{food.servingUnit}</span>
                  </div>
                </div>
              </div>

              {/* Item Counter & Tap Button */}
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 font-black text-xs flex items-center justify-center animate-in zoom-in">
                    {count}
                  </span>
                )}

                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:bg-orange-400 transition-colors">
                  +{multiplier}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
