import React, { useState } from 'react';
import { FoodItem, FoodCategory } from '../../types';
import { X, PlusCircle } from 'lucide-react';

interface AddCustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodItem) => void;
}

const EMOJI_PRESETS = ['🍕', '🍣', '🍔', '🥩', '🍝', '🍰', '🍟', '🍺', '🥟', '🍤', '🌮', '🍦'];

export const AddCustomFoodModal: React.FC<AddCustomFoodModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍕');
  const [category, setCategory] = useState<FoodCategory>('OTHER');
  const [points, setPoints] = useState(3);
  const [servingUnit, setServingUnit] = useState('unidade');
  const [kcal, setKcal] = useState(150);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFood: FoodItem = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      emoji,
      category,
      destructionPoints: Math.max(1, points),
      servingUnit: servingUnit.trim() || 'unidade',
      nutrition: {
        kcal: Math.max(10, kcal),
        protein: 5,
        carbs: 15,
        fat: 5,
        weightGrams: 60,
      },
      isCustom: true,
    };

    onAdd(newFood);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl relative animate-in fade-in slide-in-from-bottom duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20 text-2xl">
            ✨
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Adicionar Item Personalizado</h3>
            <p className="text-xs text-slate-400 mt-0.5">Disponível para todos da mesa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Emoji Picker */}
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Emoji
              </label>
              <input
                type="text"
                maxLength={2}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full text-center px-2 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome do Prato *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pastel de Vento, Caipirinha..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Preset Emojis */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-lg">
            {EMOJI_PRESETS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`p-1.5 rounded-lg border transition ${
                  emoji === e ? 'bg-orange-500/20 border-orange-500' : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Points & Serving Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Pontos de Destruição
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Unidade
              </label>
              <input
                type="text"
                value={servingUnit}
                onChange={(e) => setServingUnit(e.target.value)}
                placeholder="Ex: fatia, peça, copo"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 transition active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            Adicionar ao Menu da Mesa
          </button>
        </form>
      </div>
    </div>
  );
};
