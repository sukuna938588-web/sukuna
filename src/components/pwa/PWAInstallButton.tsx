import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'compact' | 'nav';
  showAlwaysInNav?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  showAlwaysInNav = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed as PWA standalone, don't show prompt
  if (isInstalled) {
    return null;
  }

  // If not installable and not iOS, unless showAlwaysInNav is set, hide
  if (!isInstallable && !isIOS && !showAlwaysInNav) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Fallback instruction dialog for browsers where prompt isn't fired yet
      setShowIOSGuide(true);
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center gap-1.5';
      case 'outline':
        return 'px-3.5 py-2 text-sm font-medium rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 transition flex items-center gap-2 shadow-sm';
      case 'nav':
        return 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition shadow-sm flex items-center gap-1.5';
      case 'primary':
      default:
        return 'px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2';
    }
  };

  return (
    <>
      <button
        id="pwa-install-button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Install StudySync AI as a desktop or mobile application"
        className={`${getButtonStyles()} ${className}`}
      >
        <Download className="w-4 h-4 text-cyan-200 animate-pulse" />
        <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
      </button>

      {/* iOS or Manual Installation Instructions Modal */}
      {showIOSGuide && (
        <div
          id="pwa-install-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-200 relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="pwa-modal-close"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Install StudySync AI</h3>
                <p className="text-xs text-slate-400">Install as a native standalone app</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3.5 my-4 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    In <strong>Safari</strong>, tap the <Share className="w-4 h-4 inline mx-1 text-cyan-400" />{' '}
                    <strong>Share</strong> icon in the bottom menu bar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    Scroll down and select <PlusSquare className="w-4 h-4 inline mx-1 text-indigo-400" />{' '}
                    <strong>Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <div>
                    Tap <strong>Add</strong> in the top-right corner to launch StudySync from your home screen.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 my-4 text-sm text-slate-300">
                <p>
                  To install StudySync AI on your desktop or Android device:
                </p>
                <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
                  <li>In <strong>Chrome / Edge</strong>: Click the install icon in the URL address bar.</li>
                  <li>In <strong>Android Chrome</strong>: Tap menu (⋮) and select <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong>.</li>
                  <li>Enjoy instant offline access, fast loading, and a full-screen native experience.</li>
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Standalone PWA Enabled
              </span>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
