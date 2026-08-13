import { PlantConfig } from '../types/plant';
import { PLANT_PRESETS } from './presets';

export interface AIParseResult {
  config: Partial<PlantConfig>;
  explanation: string;
  suggestedPresetId?: string;
}

export function parseNaturalLanguagePrompt(
  userPrompt: string,
  currentConfig: PlantConfig
): AIParseResult {
  const promptLower = userPrompt.toLowerCase();
  const newConfig: Partial<PlantConfig> = { ...currentConfig };
  const changes: string[] = [];

  // Check matching presets
  if (promptLower.includes('maple') || promptLower.includes('japanese')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'japanese_maple');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Generated a delicate Japanese Maple (*Acer palmatum*) with widespread branching, weeping gravity (-0.4), and a crimson foliage palette.`,
        suggestedPresetId: 'japanese_maple',
      };
    }
  }

  if (promptLower.includes('cypress') || promptLower.includes('columnar') || promptLower.includes('poplar')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'italian_cypress');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Configured a tall Italian Cypress (*Cupressus sempervirens*) with narrow branch angles (18°), high upright gravity bias, and dense evergreen foliage.`,
        suggestedPresetId: 'italian_cypress',
      };
    }
  }

  if (promptLower.includes('willow') || promptLower.includes('weeping')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'weeping_willow');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Designed a Weeping Willow (*Salix babylonica*) with heavy drooping gravity (-0.9), long tendrils, and cascading foliage branches.`,
        suggestedPresetId: 'weeping_willow',
      };
    }
  }

  if (promptLower.includes('pine') || promptLower.includes('conifer') || promptLower.includes('fir')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'scots_pine');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Adjusted parameters for a Scots Pine (*Pinus sylvestris*) with needle bundles, thick trunk tapering, and rugged dark green pine foliage.`,
        suggestedPresetId: 'scots_pine',
      };
    }
  }

  if (promptLower.includes('architectural') || promptLower.includes('elevation') || promptLower.includes('silhouette') || promptLower.includes('cad')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'architectural_elevation');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Applied Architectural Elevation Symbol style with crisp line art geometry, circle cluster nodes, and clean monochrome palette.`,
        suggestedPresetId: 'architectural_elevation',
      };
    }
  }

  // General Parametric Adjustments
  if (promptLower.includes('denser') || promptLower.includes('bushy') || promptLower.includes('thick')) {
    newConfig.foliageDensity = Math.min(100, (currentConfig.foliageDensity || 50) + 30);
    changes.push(`increased foliage density to ${newConfig.foliageDensity}%`);
  }

  if (promptLower.includes('sparse') || promptLower.includes('bare') || promptLower.includes('delicate') || promptLower.includes('thin')) {
    newConfig.foliageDensity = Math.max(10, (currentConfig.foliageDensity || 50) - 25);
    newConfig.lineWeight = 1.0;
    changes.push(`reduced foliage density to ${newConfig.foliageDensity}% and refined line weight`);
  }

  if (promptLower.includes('taller') || promptLower.includes('high')) {
    newConfig.trunkLength = Math.min(240, (currentConfig.trunkLength || 140) + 40);
    changes.push(`increased main trunk length to ${newConfig.trunkLength}px`);
  }

  if (promptLower.includes('wider') || promptLower.includes('spread') || promptLower.includes('broad')) {
    newConfig.baseAngle = Math.min(70, (currentConfig.baseAngle || 35) + 15);
    changes.push(`expanded branch angle spread to ${newConfig.baseAngle}°`);
  }

  if (promptLower.includes('red') || promptLower.includes('autumn') || promptLower.includes('crimson')) {
    newConfig.colorPalette = promptLower.includes('autumn') ? 'autumn_gold' : 'maple_red';
    changes.push(`applied ${newConfig.colorPalette} palette`);
  }

  if (promptLower.includes('blueprint') || promptLower.includes('blue')) {
    newConfig.colorPalette = 'blueprint';
    changes.push('switched to Architectural Blueprint theme');
  }

  // Random seed change for variation
  newConfig.seed = Math.floor(Math.random() * 100000);

  const explanation = changes.length > 0
    ? `Updated plant configuration: ${changes.join(', ')}.`
    : `Customized plant geometry with new random seed (${newConfig.seed}) and tuned structural parameters.`;

  return {
    config: newConfig,
    explanation,
  };
}
