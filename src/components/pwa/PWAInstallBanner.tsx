import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-slate-900/95 border border-indigo-500/30 p-4 shadow-2xl backdrop-blur-xl text-slate-100 animate-slide-up"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt="StudySync AI"
            className="w-11 h-11 rounded-xl shadow-md border border-indigo-500/30 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white">StudySync AI App</h4>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Install for instant offline access & peer tutor alerts.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition -mr-1 -mt-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <button
          onClick={() => install()}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Install Now
        </button>
        <button
          onClick={handleDismiss}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          Later
        </button>
      </div>
    </div>
  );
};
