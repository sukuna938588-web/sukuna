import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  GraduationCap,
  Cpu,
  Users,
  Compass,
  Palette,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { StudySyncLogo } from './StudySyncLogo';
import { StudySyncSymbol } from './StudySyncSymbol';
import { useToast } from '../../context/ToastContext';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose }) => {
  const { notify } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logos' | 'mockup' | 'specs'>('logos');

  const handleCopyCode = async (key: string, url: string) => {
    try {
      const response = await fetch(url);
      const svgText = await response.text();
      await navigator.clipboard.writeText(svgText);
      setCopiedKey(key);
      notify('SVG vector code copied to clipboard!', 'success');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      notify('Could not copy SVG code directly.', 'error');
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    notify(`Color ${hex} copied to clipboard!`, 'info');
  };

  const logoVariants = [
    {
      id: 'dark-navy-master',
      title: 'Dark Navy Master Logo (Official Specification)',
      desc: 'Clean horizontal branding on dark navy gradient (#050B1A to #0B1736) with subtle ambient blue glow. Large futuristic ribbon S with top graduation cap, center connected student nodes with curved paths, bottom AI circuits, bold white "StudySync", and blue-purple-cyan gradient "AI".',
      file: '/studysync-logo-dark-navy.svg',
      render: (
        <div className="py-2 w-full flex justify-center">
          <img
            src="/studysync-logo-dark-navy.svg"
            alt="StudySync AI Dark Navy Master Logo"
            className="h-16 sm:h-20 w-auto object-contain rounded-xl shadow-2xl"
          />
        </div>
      ),
      bg: 'dark',
    },
    {
      id: 'transparent-master',
      title: 'Transparent Master Logo (Navbar & Hero Ready)',
      desc: 'Transparent background vector SVG with bold white modern geometric "StudySync" and electric blue-purple-cyan gradient "AI". Seamless for dark UI headers, overlays, and hero banners.',
      file: '/studysync-logo-transparent.svg',
      render: (
        <div className="py-2 w-full flex justify-center">
          <img
            src="/studysync-logo-transparent.svg"
            alt="StudySync AI Transparent Master Logo"
            className="h-16 sm:h-20 w-auto object-contain"
          />
        </div>
      ),
      bg: 'dark',
    },
    {
      id: 'exact-light',
      title: 'Light Canvas Presentation Logo',
      desc: 'High-contrast light background variant with deep navy "StudySync", gradient "AI", and vibrant ribbon S for thesis, reports, and paper mockups.',
      file: '/studysync-logo-exact.svg',
      render: (
        <div className="py-2 w-full flex justify-center">
          <img
            src="/studysync-logo-exact.svg"
            alt="StudySync AI Master Vector Logo"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>
      ),
      bg: 'light',
    },
    {
      id: 'horizontal',
      title: 'Large Horizontal SaaS Logo',
      desc: 'Master horizontal brand lockup with emblem, wordmark, and AI badge for desktop hero and headers.',
      file: '/studysync-logo-horizontal.svg',
      render: <StudySyncLogo variant="horizontal" size="lg" showTagline />,
      bg: 'dark',
    },
    {
      id: 'hero',
      title: 'Hero Section Ultra Logo',
      desc: 'High-impact version with expansive typography, ambient volumetric glow, and category descriptor.',
      file: '/studysync-logo-hero.svg',
      render: <StudySyncLogo variant="hero" showTagline />,
      bg: 'dark',
    },
    {
      id: 'navbar',
      title: 'Compact Navbar Version',
      desc: 'Streamlined 34px height format optimized for sticky navigation bars, sidebars, and dense app headers.',
      file: '/studysync-logo-horizontal.svg',
      render: <StudySyncLogo variant="navbar" />,
      bg: 'dark',
    },
    {
      id: 'dark',
      title: 'Dark Mode High-Contrast',
      desc: 'Optimized with pure white typography, amplified cyan circuit luminescence, and indigo neon aura.',
      file: '/studysync-logo-dark.svg',
      render: <StudySyncLogo variant="horizontal" theme="dark" size="md" showTagline />,
      bg: 'dark',
    },
    {
      id: 'light',
      title: 'Light Mode Crisp Version',
      desc: 'Engineered for white presentations, PDFs, thesis papers, and high-key backgrounds with deep slate typography.',
      file: '/studysync-logo-light.svg',
      render: <StudySyncLogo variant="horizontal" theme="light" size="md" showTagline />,
      bg: 'light',
    },
    {
      id: 'icon',
      title: 'App Icon / Squircle (128x128)',
      desc: 'Standalone mobile app & desktop dock icon featuring the 3D ribbon S, glassmorphic border, and ambient lighting.',
      file: '/studysync-icon.svg',
      render: (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl p-3 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 shadow-xl flex items-center justify-center">
            <StudySyncSymbol size={56} glow />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">StudySync AI App Icon</div>
            <div className="text-[11px] text-slate-400">iOS & Android Ready • 1024x1024 vector</div>
          </div>
        </div>
      ),
      bg: 'dark',
    },
    {
      id: 'favicon',
      title: 'Favicon & Micro-Icon (64x64)',
      desc: 'High-contrast browser tab favicon with crisp academic cap and glowing AI circuit traces.',
      file: '/favicon.svg',
      render: (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl p-1.5 bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
            <StudySyncSymbol size={32} glow />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">Browser Favicon</div>
            <div className="text-[11px] text-slate-400">Embedded in /public/favicon.svg</div>
          </div>
        </div>
      ),
      bg: 'dark',
    },
  ];

  const brandColors = [
    { name: 'Electric Indigo', hex: '#4F46E5', desc: 'Primary core, intelligence & stability' },
    { name: 'Royal Violet', hex: '#7C3AED', desc: 'Middle ribbon blend, creativity & cognition' },
    { name: 'Electric Cyan', hex: '#06B6D4', desc: 'AI technology, matching synergy & speed' },
    { name: 'Cyan Highlight', hex: '#22D3EE', desc: 'Micro-traces, glowing tassel & student nodes' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/70 shadow-2xl shadow-indigo-500/10 overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-glow">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <StudySyncSymbol size={26} glow />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  StudySync AI <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">Brand Kit</span>
                </h2>
                <p className="text-xs text-slate-400">Enterprise Vector Logo System & Identity Guidelines</p>
              </div>
            </div>

            {/* Tabs & Close */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('logos')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'logos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vector Logos
                </button>
                <button
                  onClick={() => setActiveTab('mockup')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'mockup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Presentation Render
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'specs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Concept & Colors
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'logos' && (
              <div className="space-y-6">
                {/* Visual Concept Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 grid sm:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Education Pillar</div>
                      <div className="text-[11px] text-slate-400">Mortarboard cap seamlessly crowning the S crest</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">AI Circuit Traces</div>
                      <div className="text-[11px] text-slate-400">45° cyber data bus lines & neural contact vias</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Peer Collaboration</div>
                      <div className="text-[11px] text-slate-400">4 orbiting student nodes linked by synaptic arcs</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">3D Vector Ribbon</div>
                      <div className="text-[11px] text-slate-400">Möbius flowing curves with specular edge sheen</div>
                    </div>
                  </div>
                </div>

                {/* Grid of Logo Variations */}
                <div className="grid md:grid-cols-2 gap-5">
                  {logoVariants.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-200 font-display">{item.title}</h3>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          SVG Vector
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div
                        className={`p-6 flex items-center justify-center min-h-[140px] transition-all ${
                          item.bg === 'light'
                            ? 'bg-slate-100 text-slate-900'
                            : 'bg-radial-dark bg-slate-950/90'
                        }`}
                      >
                        {item.render}
                      </div>

                      {/* Action Bar */}
                      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Raw SVG
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(item.id, item.file)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            {copiedKey === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy SVG
                              </>
                            )}
                          </button>

                          <a
                            href={item.file}
                            download={item.file.replace('/', '')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mockup Tab */}
            {activeTab === 'mockup' && (
              <div className="space-y-6">
                {/* Official Dark Navy Master Branding Presentation */}
                <div className="rounded-2xl border border-indigo-500/30 overflow-hidden bg-slate-950 relative group shadow-2xl">
                  <img
                    src="/src/assets/images/studysync_dark_navy_logo_1789534924321.jpg"
                    alt="StudySync AI Dark Navy Master Logo Presentation"
                    className="w-full h-auto object-cover max-h-[480px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-1">
                        Dark Navy Master Technology Branding
                      </div>
                      <h4 className="text-xl font-bold font-display text-white">
                        StudySync AI — Official Dark Navy Hero Presentation
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl mt-1">
                        Dark navy gradient canvas (#050B1A to #0B1736) with subtle ambient blue glow, large ribbon S with graduation cap, connected student nodes with curved paths, bottom AI circuits, bold white "StudySync", and blue-purple-cyan gradient "AI".
                      </p>
                    </div>

                    <a
                      href="/src/assets/images/studysync_dark_navy_logo_1789534924321.jpg"
                      download="StudySync_AI_Dark_Navy_Master_Logo.jpg"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-glow flex items-center gap-2 hover:brightness-110 shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download Ultra-Res Image
                    </a>
                  </div>
                </div>

                {/* Reference Exact Re-creation Presentation */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 relative group">
                  <img
                    src="/src/assets/images/studysync_exact_logo_1789533071884.jpg"
                    alt="StudySync AI Exact Logo Presentation"
                    className="w-full h-auto object-cover max-h-[460px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-1">
                        Exact 1:1 Reference Re-creation
                      </div>
                      <h4 className="text-xl font-bold font-display text-white">
                        StudySync AI — Exact Reference Presentation
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl mt-1">
                        Futuristic ribbon "S" with 3D curved bands, top academic cap, center student connection nodes, and embedded bottom AI circuit traces.
                      </p>
                    </div>

                    <a
                      href="/src/assets/images/studysync_exact_logo_1789533071884.jpg"
                      download="StudySync_AI_Exact_Logo_Presentation.jpg"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold shadow-glow flex items-center gap-2 hover:brightness-110 shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download Presentation
                    </a>
                  </div>
                </div>

                {/* 3D Volumetric Emblem Render */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 relative group">
                  <img
                    src="/src/assets/images/studysync_hero_logo_1789532215541.jpg"
                    alt="StudySync AI 3D Brand Presentation"
                    className="w-full h-auto object-cover max-h-[460px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-1">
                        High-Fidelity 3D Brand Presentation Render
                      </div>
                      <h4 className="text-xl font-bold font-display text-white">
                        StudySync AI — Volumetric Emblem Render
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl mt-1">
                        Crafted for startup pitch decks, investor demos, and university project presentations.
                        Displays luminous frosted glass, titanium bezel, glowing cyan tassel, and neural network fiber-optics.
                      </p>
                    </div>

                    <a
                      href="/src/assets/images/studysync_hero_logo_1789532215541.jpg"
                      download="StudySync_AI_3D_Presentation_Logo.jpg"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold shadow-glow flex items-center gap-2 hover:brightness-110 shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download 3D Render
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" /> Official Brand Palette
                  </h3>
                  <div className="grid sm:grid-cols-4 gap-3">
                    {brandColors.map((color) => (
                      <div
                        key={color.hex}
                        onClick={() => handleCopyHex(color.hex)}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700 transition-all group"
                      >
                        <div
                          className="w-full h-12 rounded-lg mb-2.5 shadow-inner transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{color.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{color.hex}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{color.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography Guide */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Typography Hierarchy
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Display Typeface</div>
                      <div className="text-2xl font-display font-extrabold text-white mt-1">Plus Jakarta Sans</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Weights: ExtraBold (800) for "Study", SemiBold (600) for "Sync", Black (900) for "AI" badge.
                        Negative tracking (-0.03em) creates an authoritative tech startup aesthetic matching Linear and Stripe.
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Body & Tracking</div>
                      <div className="text-2xl font-sans font-bold text-white mt-1">Inter & JetBrains Mono</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Used for the category tagline with 0.22em tracking and subtext metrics.
                        High contrast ratios pass all WCAG AAA legibility tests on dark and light surfaces.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>All assets are 100% scalable vector SVGs with transparent backgrounds.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono">StudySync AI Design System v2.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
