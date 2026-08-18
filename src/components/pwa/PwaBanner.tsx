import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosModal(true);
    }
  };

  // Only show if installation prompt is available or on iOS
  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 shadow-lg flex items-center justify-between gap-3 text-sm rounded-xl my-2 mx-3 border border-orange-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg text-xl">📲</div>
          <div>
            <p className="font-bold text-white leading-tight">Instale o Rodiziômetro</p>
            <p className="text-orange-100 text-xs mt-0.5">Acesso rápido em 1 toque na tela de início</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-white text-orange-600 font-bold text-xs rounded-lg shadow hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Instalar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-orange-200 hover:text-white transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Installation Sheet */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl relative animate-in slide-in-from-bottom duration-200">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <span className="text-4xl block mb-2">📱</span>
              <h3 className="text-xl font-bold text-white">Instalar no iPhone / iPad</h3>
              <p className="text-xs text-slate-400 mt-1">Siga estes 3 passos rápidos no Safari:</p>
            </div>

            <div className="space-y-4 text-sm bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <p className="text-slate-300">
                  Toque no botão <span className="font-bold text-orange-400">Compartilhar</span> <Share2 className="w-4 h-4 inline-block mx-1" /> na barra inferior do Safari.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <p className="text-slate-300">
                  Role para baixo e escolha <span className="font-bold text-orange-400">Adicionar à Tela de Início</span> <PlusSquare className="w-4 h-4 inline-block mx-1" />.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <p className="text-slate-300">
                  Toque em <span className="font-bold text-orange-400">Adicionar</span> no canto superior direito para confirmar.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full mt-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition active:scale-98"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
