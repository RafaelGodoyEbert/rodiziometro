import React, { useState } from 'react';
import { X, Swords } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { roomCode: string; nickname: string }) => void;
  initialCode?: string;
  initialNickname?: string;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCode = '',
  initialNickname = '',
}) => {
  const [roomCode, setRoomCode] = useState(initialCode);
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Por favor, informe o código da mesa.');
      return;
    }
    if (!nickname.trim()) {
      setError('Por favor, informe seu apelido.');
      return;
    }
    setError('');
    onSubmit({
      roomCode: roomCode.trim().toUpperCase(),
      nickname: nickname.trim(),
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
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 text-2xl">
            ⚔️
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">Entrar em uma Mesa</h3>
            <p className="text-xs text-slate-400 mt-0.5">Junte-se ao placar ao vivo da sua mesa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Code */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Código da Mesa
            </label>
            <input
              type="text"
              required
              maxLength={8}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ex: 8FH2KD"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-white font-mono tracking-widest text-center text-lg font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 uppercase transition"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Como vamos te chamar?
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Seu apelido na mesa"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            <Swords className="w-4 h-4" />
            Entrar na Batalha
          </button>
        </form>
      </div>
    </div>
  );
};
