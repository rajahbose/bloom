'use client';

import React, { useState } from 'react';
import { PlantConfig } from '@/lib/types/plant';
import { generatePlantGeometry } from '@/lib/engine/fractalPlant';
import { PALETTES } from '@/lib/engine/palettes';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, ShieldCheck, Grid } from 'lucide-react';

interface PlantCanvasProps {
  plantConfig: PlantConfig;
  viewMode: 'front' | 'side' | 'plan';
  title?: string;
}

export const PlantCanvas: React.FC<PlantCanvasProps> = ({
  plantConfig,
  viewMode,
  title,
}) => {
  const [zoom, setZoom] = useState(1);
  const palette = PALETTES[plantConfig.colorPalette] || PALETTES.emerald;

  const result = generatePlantGeometry(plantConfig, viewMode, 800, 800);

  return (
    <div className="relative flex-1 h-full w-full bg-[var(--bg-primary)] overflow-hidden flex flex-col select-none cad-grid-pattern">
      {/* Viewport Header Bar */}
      <div className="h-9 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
            {title || `${viewMode.toUpperCase()} VIEWPORT`}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            ({Math.round(result.bounds.width)}px × {Math.round(result.bounds.height)}px)
          </span>
        </div>

        {/* Viewport Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors ml-1"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Preview Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          dangerouslySetInnerHTML={{ __html: result.svgContent }}
        />

        {/* Architectural Title Block Banner */}
        <div className="absolute bottom-3 left-3 bg-[var(--bg-surface)]/90 backdrop-blur border border-[var(--border-color)] rounded-lg p-2.5 shadow-xl text-[10px] font-mono text-[var(--text-secondary)] space-y-0.5 pointer-events-none">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-400 uppercase tracking-wide">
            <Grid className="w-3 h-3" />
            <span>BLOOM CAD SYMBOL ENGINE</span>
          </div>
          <div>VIEW: {viewMode.toUpperCase()} ELEVATION</div>
          <div>SEED: #{plantConfig.seed} | DEPTH: {plantConfig.maxDepth}</div>
          <div>DIMENSIONS: {(result.bounds.height / 80).toFixed(2)}m H × {(result.bounds.width / 80).toFixed(2)}m W</div>
        </div>
      </div>
    </div>
  );
};
