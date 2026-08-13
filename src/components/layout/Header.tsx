'use client';

import React from 'react';
import { 
  Sprout, 
  Layers, 
  Download, 
  Sun, 
  Moon, 
  Eye, 
  Sparkles,
  Sliders,
  Code
} from 'lucide-react';
import { ViewMode } from '@/lib/types/plant';
import { PLANT_PRESETS } from '@/lib/engine/presets';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: 'chat' | 'params' | 'code';
  setActiveTab: (tab: 'chat' | 'params' | 'code') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onSelectPreset,
  onOpenExport,
}) => {
  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Bloom
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CAD Scripted Plants
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Procedural Botanical SVG Symbol Generator</p>
        </div>
      </div>

      {/* Middle Controls: View Mode & Presets */}
      <div className="flex items-center space-x-3">
        {/* Preset Selector */}
        <select
          onChange={(e) => e.target.value && onSelectPreset(e.target.value)}
          defaultValue=""
          className="bg-[var(--bg-card)] text-xs text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="" disabled>-- Load Botanical Preset --</option>
          {PLANT_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 space-x-1 text-xs">
          <button
            onClick={() => setViewMode('front')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'front' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Front Elevation
          </button>
          <button
            onClick={() => setViewMode('side')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'side' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Side View
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'plan' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Plan View (Top)
          </button>
          <button
            onClick={() => setViewMode('dual')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              viewMode === 'dual' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Dual View
          </button>
        </div>

        {/* Panel Switcher (Chat / Parameters / Script Code) */}
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              activeTab === 'chat' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Generator
          </button>
          <button
            onClick={() => setActiveTab('params')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              activeTab === 'params' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            Parameters
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              activeTab === 'code' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Code className="w-3.5 h-3.5 mr-1" />
            Script Code
          </button>
        </div>
      </div>

      {/* Right Controls: Theme Toggle & Export */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
          title="Toggle Theme (Blueprint Dark / Clean Drafting Light)"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        <button
          onClick={onOpenExport}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Export CAD Symbol</span>
        </button>
      </div>
    </header>
  );
};
