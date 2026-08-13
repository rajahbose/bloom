'use client';

import React from 'react';
import { Sliders, Dices, Layers, Palette, Shield, Ruler } from 'lucide-react';
import { FoliageType, PlantConfig } from '@/lib/types/plant';
import { PALETTES } from '@/lib/engine/palettes';

interface ParameterPanelProps {
  plantConfig: PlantConfig;
  setPlantConfig: React.Dispatch<React.SetStateAction<PlantConfig>>;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  plantConfig,
  setPlantConfig,
}) => {
  const updateConfig = (key: keyof PlantConfig, value: any) => {
    setPlantConfig((prev) => ({ ...prev, [key]: value }));
  };

  const randomizeSeed = () => {
    updateConfig('seed', Math.floor(Math.random() * 100000));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Parametric Fine-Tuning
          </h2>
        </div>
        <button
          onClick={randomizeSeed}
          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs flex items-center space-x-1.5 transition-all"
          title="Generate Random Botanical Variation"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>New Seed</span>
        </button>
      </div>

      {/* Control Groups */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6 text-xs">
        {/* Group 1: Fractal Branching Geometry */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              1. Branching Geometry
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              Seed: #{plantConfig.seed}
            </span>
          </div>

          {/* Recursion Depth */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Recursion Depth</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.maxDepth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={plantConfig.maxDepth}
              onChange={(e) => updateConfig('maxDepth', parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Base Branching Angle */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Branch Angle (°)</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.baseAngle}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="75"
              step="1"
              value={plantConfig.baseAngle}
              onChange={(e) => updateConfig('baseAngle', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Angle Randomness / Jitter */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Angle Randomness</label>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(plantConfig.angleJitter * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={plantConfig.angleJitter}
              onChange={(e) => updateConfig('angleJitter', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Gravity Droop / Upright */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Gravity Bending (Droop vs Upright)</label>
              <span className="font-mono text-emerald-400 font-bold">
                {plantConfig.gravity < 0 ? `Weeping (${plantConfig.gravity})` : plantConfig.gravity > 0 ? `Upright (+${plantConfig.gravity})` : 'Neutral'}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={plantConfig.gravity}
              onChange={(e) => updateConfig('gravity', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 2: Trunk & Taper */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              2. Trunk & Structure
            </span>
          </div>

          {/* Trunk Length */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Trunk Height</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.trunkLength}px</span>
            </div>
            <input
              type="range"
              min="60"
              max="250"
              step="5"
              value={plantConfig.trunkLength}
              onChange={(e) => updateConfig('trunkLength', parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Trunk Thickness */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Trunk Thickness</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.trunkThickness}px</span>
            </div>
            <input
              type="range"
              min="3"
              max="35"
              step="1"
              value={plantConfig.trunkThickness}
              onChange={(e) => updateConfig('trunkThickness', parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 3: Botanical Foliage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              3. Botanical Foliage
            </span>
          </div>

          {/* Foliage Type */}
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">Foliage Render Style</label>
            <select
              value={plantConfig.foliageType}
              onChange={(e) => updateConfig('foliageType', e.target.value as FoliageType)}
              className="w-full bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="deciduous">Deciduous Leaves</option>
              <option value="conifer">Conifer / Pine Needles</option>
              <option value="weeping">Weeping Tendrils</option>
              <option value="palm">Palm Fronds</option>
              <option value="broadleaf">Broadleaf Oval</option>
              <option value="architectural_circle">Architectural Circles</option>
              <option value="hatch">CAD Stipple Hatch</option>
              <option value="none">No Foliage (Winter / Bare Branches)</option>
            </select>
          </div>

          {/* Foliage Density */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Foliage Density</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.foliageDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={plantConfig.foliageDensity}
              onChange={(e) => updateConfig('foliageDensity', parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 4: CAD Line Weights & Aesthetics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              4. CAD Aesthetics & Annotations
            </span>
          </div>

          {/* Palette Selector */}
          <div>
            <label className="block text-[var(--text-secondary)] mb-1">Color Palette</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(PALETTES).map(([key, pal]) => (
                <button
                  key={key}
                  onClick={() => updateConfig('colorPalette', key)}
                  className={`p-2 rounded-lg border text-left transition-all flex items-center space-x-2 ${
                    plantConfig.colorPalette === key
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: pal.foliagePrimary }}
                  />
                  <span className="truncate text-[10px] font-medium">{pal.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line Weight */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Vector Line Weight</label>
              <span className="font-mono text-emerald-400 font-bold">{plantConfig.lineWeight}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={plantConfig.lineWeight}
              onChange={(e) => updateConfig('lineWeight', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Show Dimensions & Grid Toggles */}
          <div className="flex items-center justify-between pt-2">
            <label className="text-[var(--text-secondary)] flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={plantConfig.showDimensions}
                onChange={(e) => updateConfig('showDimensions', e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Show CAD Height & Width Dimensions</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
