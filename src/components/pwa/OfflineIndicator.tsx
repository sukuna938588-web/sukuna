import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showRestored, setShowRestored] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showRestored) return null;

  if (showRestored) {
    return (
      <div
        id="pwa-online-indicator"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 text-white px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md border border-emerald-400/30 transition-all duration-300 animate-slide-up"
      >
        <Wifi className="w-4 h-4 text-white" />
        <span>Connected — You are back online</span>
      </div>
    );
  }

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/90 text-white px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md border border-amber-400/30 transition-all duration-300 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-200" />
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
        <span>Offline Mode — Using cached data</span>
      </div>
    </div>
  );
};
