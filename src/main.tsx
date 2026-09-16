import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New StudySync AI content available, reload to update.');
  },
  onOfflineReady() {
    console.log('StudySync AI is ready for offline use.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
