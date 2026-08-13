'use client';

import React from 'react';
import { Sliders, Dices, Layers, Palette, Grid, Sprout, Wind, Paintbrush, Flower2 } from 'lucide-react';
import { FoliageType, GrowthProfileType, PlantConfig, RenderTechnique } from '@/lib/types/plant';
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
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            Botanical Morphology & Style
          </h2>
        </div>
        <button
          onClick={randomizeSeed}
          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs flex items-center space-x-1.5 transition-all"
          title="Generate Random Variation"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>New Seed</span>
        </button>
      </div>

      {/* Control Groups */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6 text-xs">
        {/* Growth Profile & Rendering Technique */}
        <div className="space-y-3 bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-color)]">
          <div>
            <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Growth Profile
            </label>
            <select
              value={plantConfig.growthProfile || 'decurrent_canopy'}
              onChange={(e) => updateConfig('growthProfile', e.target.value as GrowthProfileType)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="radial_rosette">1. Radial Rosette (Yucca / Agave)</option>
              <option value="excurrent_tower">2. Excurrent Tower (Conifer / Pine)</option>
              <option value="decurrent_canopy">3. Decurrent Canopy (Maple / Oak / Birch)</option>
              <option value="columnar_spire">4. Columnar Spire (Cypress / Poplar)</option>
              <option value="basal_fountain">5. Basal Fountain (Ornamental Grass / Palm)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Architectural Technique
            </label>
            <select
              value={plantConfig.renderTechnique || 'botanical_vector'}
              onChange={(e) => updateConfig('renderTechnique', e.target.value as RenderTechnique)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-cyan-500"
            >
              <option value="botanical_vector">Botanical Vector (Rich Shading & Depth)</option>
              <option value="architectural_ink">Architectural Ink (Hand-Drafted Stipple)</option>
              <option value="blueprint">Blueprint CAD (Precision Technical Lines)</option>
              <option value="watercolor_wash">Watercolor Wash (Soft Atmospheric Pools)</option>
            </select>
          </div>
        </div>

        {/* Organic Trunk Morphology & Bark Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <Sprout className="w-3 h-3 text-emerald-400 mr-1" />
              <span>Organic Trunk & Roots</span>
            </span>
          </div>

          {/* Root Flare */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Root Flare Buttress</label>
              <span className="font-mono text-emerald-400 font-bold">{Math.round((plantConfig.rootFlare || 0.8) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={plantConfig.rootFlare !== undefined ? plantConfig.rootFlare : 0.8}
              onChange={(e) => updateConfig('rootFlare', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Bark Fissure Density */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Bark Fissure Detail</label>
              <span className="font-mono text-emerald-400 font-bold">{Math.round((plantConfig.barkFissures || 0.6) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={plantConfig.barkFissures !== undefined ? plantConfig.barkFissures : 0.6}
              onChange={(e) => updateConfig('barkFissures', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Wind Drift & Asymmetry */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Wind Sway / Natural Lean</label>
              <span className="font-mono text-emerald-400 font-bold">
                {plantConfig.windDrift ? `${plantConfig.windDrift > 0 ? '+' : ''}${Math.round(plantConfig.windDrift * 100)}%` : '0%'}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={plantConfig.windDrift || 0}
              onChange={(e) => updateConfig('windDrift', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>

        {/* Profile-Specific Parameter Influences */}
        {plantConfig.growthProfile === 'radial_rosette' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                Radial Rosette Influences
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Sword Leaf Count</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.rosetteLeafCount || 38}</span>
              </div>
              <input
                type="range"
                min="12"
                max="70"
                step="2"
                value={plantConfig.rosetteLeafCount || 38}
                onChange={(e) => updateConfig('rosetteLeafCount', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Leaf Length</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.rosetteLeafLength || 150}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="220"
                step="5"
                value={plantConfig.rosetteLeafLength || 150}
                onChange={(e) => updateConfig('rosetteLeafLength', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Rosette Layers</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.rosetteLayers || 4}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={plantConfig.rosetteLayers || 4}
                onChange={(e) => updateConfig('rosetteLayers', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {plantConfig.growthProfile === 'excurrent_tower' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                Excurrent Conical Influences
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Conical Envelope Width</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.spireWidth || 160}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="260"
                step="5"
                value={plantConfig.spireWidth || 160}
                onChange={(e) => updateConfig('spireWidth', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Tower Height</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.trunkLength || 180}px</span>
              </div>
              <input
                type="range"
                min="80"
                max="260"
                step="5"
                value={plantConfig.trunkLength || 180}
                onChange={(e) => updateConfig('trunkLength', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {plantConfig.growthProfile === 'decurrent_canopy' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                Decurrent Canopy Branching
              </span>
            </div>

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

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Gravity Bending</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.gravity}</span>
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
        )}

        {plantConfig.growthProfile === 'columnar_spire' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                Columnar Spire Envelope
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Capsule Spire Width</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.spireWidth || 65}px</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="2"
                value={plantConfig.spireWidth || 65}
                onChange={(e) => updateConfig('spireWidth', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Steep Angle (°)</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.spireBranchAngle || 80}°</span>
              </div>
              <input
                type="range"
                min="60"
                max="88"
                step="1"
                value={plantConfig.spireBranchAngle || 80}
                onChange={(e) => updateConfig('spireBranchAngle', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {plantConfig.growthProfile === 'basal_fountain' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
                Basal Fountain Curves
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Blade Count</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.fountainBladeCount || 75}</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={plantConfig.fountainBladeCount || 75}
                onChange={(e) => updateConfig('fountainBladeCount', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[var(--text-secondary)]">Arch Curvature</label>
                <span className="font-mono text-emerald-400 font-bold">{plantConfig.fountainArchFactor || 0.85}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={plantConfig.fountainArchFactor || 0.85}
                onChange={(e) => updateConfig('fountainArchFactor', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Flowering Blossoms Section */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] flex items-center space-x-1">
              <Flower2 className="w-3 h-3 text-pink-400 mr-1" />
              <span>Flowering Blossoms & Accents</span>
            </span>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[var(--text-secondary)]">Blossom Density</label>
              <span className="font-mono text-pink-400 font-bold">{plantConfig.blossomDensity || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={plantConfig.blossomDensity || 0}
              onChange={(e) => updateConfig('blossomDensity', parseInt(e.target.value))}
              className="w-full accent-pink-500 bg-[var(--bg-card)] rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <label className="block text-[var(--text-secondary)] mb-1 font-bold uppercase tracking-wider text-[10px]">
            Color Palette & Mood
          </label>
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
