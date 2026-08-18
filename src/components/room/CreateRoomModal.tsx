import React, { useState } from 'react';
import { RodizioType } from '../../types';
import { RODIZIO_TYPES } from '../../domain/foodCatalog';
import { X, Sparkles } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { hostName: string; roomName: string; rodizioType: RodizioType }) => void;
  initialName?: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
}) => {
  const [hostName, setHostName] = useState(initialName);
  const [roomName, setRoomName] = useState('');
  const [selectedType, setSelectedType] = useState<RodizioType>('MIXED');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setError('Por favor, informe seu apelido.');
      return;
    }
    setError('');
    onSubmit({
      hostName: hostName.trim(),
      roomName: roomName.trim(),
      rodizioType: selectedType,
    });
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
            👑
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Criar uma Mesa</h3>
            <p className="text-xs text-slate-400 mt-0.5">Convide a galera e disputem em tempo real</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Host Nickname */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Como vamos te chamar? *
            </label>
            <input
              type="text"
              required
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Ex: Rafael, Capita, Zé..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
            />
          </div>

          {/* Optional Room Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome da Mesa <span className="text-slate-500 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ex: Aniversário do Zé, Galera da Firma"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
            />
          </div>

          {/* Rodizio Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Tipo do Rodízio
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {RODIZIO_TYPES.map((t) => {
                const isSelected = selectedType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setSelectedType(t.type)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-medium transition active:scale-98 ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-white font-bold shadow-sm shadow-orange-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <span className="truncate">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/25 transition active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4" />
            Criar Mesa e Gerar QR Code
          </button>
        </form>
      </div>
    </div>
  );
};
