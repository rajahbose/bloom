'use client';

import React, { useState } from 'react';
import { X, Download, FileCode, Layers, Check, Copy, Sparkles, Box } from 'lucide-react';
import { PlantConfig, ViewMode } from '@/lib/types/plant';
import { generatePlantGeometry } from '@/lib/engine/fractalPlant';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantConfig: PlantConfig;
  viewMode: ViewMode;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  plantConfig,
  viewMode,
}) => {
  const [copiedSVG, setCopiedSVG] = useState(false);
  const [includeLayers, setIncludeLayers] = useState(true);
  const [includeDimensions, setIncludeDimensions] = useState(plantConfig.showDimensions);

  if (!isOpen) return null;

  const currentView = viewMode === 'dual' ? 'front' : viewMode;
  const geometryResult = generatePlantGeometry(
    { ...plantConfig, showDimensions: includeDimensions },
    currentView
  );

  const handleCopySVG = () => {
    navigator.clipboard.writeText(geometryResult.svgContent);
    setCopiedSVG(true);
    setTimeout(() => setCopiedSVG(false), 2000);
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([geometryResult.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom-plant-${plantConfig.id}-${currentView}-seed${plantConfig.seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // DXF Vector Export Generator (AutoCAD R12 compatible DXF output)
  const handleDownloadDXF = () => {
    const lines: string[] = [
      '0', 'SECTION',
      '2', 'ENTITIES',
    ];

    // Export trunk/branches as DXF LINE entities on layer 'TRUNK_BRANCHES'
    geometryResult.branches.forEach((b) => {
      lines.push(
        '0', 'LINE',
        '8', 'TRUNK_BRANCHES',
        '10', b.x1.toFixed(3),
        '20', (-b.y1).toFixed(3), // Invert Y for CAD coordinate system
        '30', '0.0',
        '11', b.x2.toFixed(3),
        '21', (-b.y2).toFixed(3),
        '31', '0.0'
      );
    });

    // Export foliage points/circles on layer 'FOLIAGE'
    geometryResult.foliage.forEach((f) => {
      lines.push(
        '0', 'CIRCLE',
        '8', 'FOLIAGE',
        '10', f.x.toFixed(3),
        '20', (-f.y).toFixed(3),
        '30', '0.0',
        '40', f.size.toFixed(3)
      );
    });

    lines.push('0', 'ENDSEC', '0', 'EOF');

    const dxfContent = lines.join('\n');
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom-plant-${plantConfig.seed}-${currentView}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download JSON Preset file
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(plantConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom-preset-${plantConfig.seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Export CAD Vector Symbol
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Preview Thumbnail Box */}
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 h-48 flex items-center justify-center cad-grid-pattern relative">
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: geometryResult.svgContent }}
            />
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              View: {currentView.toUpperCase()} | Scale 1:50
            </span>
          </div>

          {/* Export Options */}
          <div className="space-y-3 bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-color)]">
            <h3 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              CAD Export Layer Configurations
            </h3>
            
            <label className="flex items-center space-x-2 text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={includeLayers}
                onChange={(e) => setIncludeLayers(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Separate SVG Layers (<code className="text-emerald-400 font-mono">layer-trunk</code>, <code className="text-emerald-400 font-mono">layer-foliage</code>)</span>
            </label>

            <label className="flex items-center space-x-2 text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={includeDimensions}
                onChange={(e) => setIncludeDimensions(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Include CAD Height & Scale Dimension Lines</span>
            </label>
          </div>

          {/* Download Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadSVG}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <FileCode className="w-4 h-4" />
              <span>Download SVG Vector</span>
            </button>

            <button
              onClick={handleDownloadDXF}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <Box className="w-4 h-4" />
              <span>Download CAD DXF</span>
            </button>

            <button
              onClick={handleCopySVG}
              className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-primary)] border border-[var(--border-color)] font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              {copiedSVG ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copiedSVG ? 'SVG Copied!' : 'Copy SVG XML'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-slate-700 text-[var(--text-primary)] border border-[var(--border-color)] font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Save Config (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
