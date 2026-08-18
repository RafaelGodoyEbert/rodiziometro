import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import QRCode from 'qrcode';
import { QrCode, Copy, Share2, Check, Users, Flag, UserCheck } from 'lucide-react';

interface RoomTabProps {
  room: Room | null;
  myParticipantId: string;
  onEndRoom: () => void;
  onStartNewRoom: () => void;
}

export const RoomTab: React.FC<RoomTabProps> = ({
  room,
  myParticipantId,
  onEndRoom,
  onStartNewRoom,
}) => {
  const [qrSvg, setQrSvg] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const roomLink = typeof window !== 'undefined' && room
    ? `${window.location.origin}/#m=${room.code}`
    : '';

  useEffect(() => {
    if (roomLink) {
      QRCode.toString(roomLink, { type: 'svg', margin: 1, color: { dark: '#FFFFFF', light: '#00000000' } })
        .then((svg) => setQrSvg(svg))
        .catch(() => {});
    }
  }, [roomLink]);

  const handleCopyLink = () => {
    if (!roomLink) return;
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!roomLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rodiziômetro - Mesa ${room?.name}`,
          text: `Entra no placar do nosso rodízio! Código da mesa: ${room?.code}`,
          url: roomLink,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (!room) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
          🍕
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Você está em Modo Solo</h2>
          <p className="text-xs text-slate-400 mt-1">
            Você pode criar uma mesa compartilhada para convidar os amigos e disputar em tempo real.
          </p>
        </div>

        <button
          onClick={onStartNewRoom}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 active:scale-98 transition"
        >
          Criar uma Mesa Compartilhada
        </button>
      </div>
    );
  }

  const isHost = room.participants.find((p) => p.id === myParticipantId)?.isHost ?? false;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Room Summary Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md text-center space-y-3">
        <div className="inline-block px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full font-mono text-xs font-bold tracking-widest uppercase">
          MESA #{room.code}
        </div>

        <h2 className="text-2xl font-black text-white leading-tight">{room.name}</h2>

        {/* QR Code Canvas */}
        {qrSvg && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 inline-block mx-auto my-2 max-w-[200px] shadow-inner">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="w-36 h-36 mx-auto" />
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Aponte a câmera para entrar</p>
          </div>
        )}

        {/* Share & Copy Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700/80 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          Pessoas na Mesa ({room.participants.length})
        </h3>

        <div className="space-y-2">
          {room.participants.map((p) => {
            const isMe = p.id === myParticipantId;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.nickname.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <span className="font-bold text-white text-xs block">{p.nickname}</span>
                    {p.isHost && (
                      <span className="text-[10px] text-amber-400 font-semibold block">Criador da mesa</span>
                    )}
                  </div>
                </div>

                {isMe && (
                  <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded">
                    Você
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* End Session Button */}
      <div className="pt-2">
        <button
          onClick={onEndRoom}
          className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Flag className="w-4 h-4 text-rose-400" />
          Encerrar Rodízio e Ver Relatório da Destruição
        </button>
      </div>
    </div>
  );
};
