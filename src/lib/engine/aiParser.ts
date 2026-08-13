import { PlantConfig, GrowthProfileType } from '../types/plant';
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

  // Growth Profile Matching
  if (promptLower.includes('agave') || promptLower.includes('yucca') || promptLower.includes('rosette') || promptLower.includes('aloe') || promptLower.includes('succulent')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'agave_rosette');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Switched to **Radial Rosette** growth profile (*Agave Americana*). Generated rotational tapering sword paths around a central anchor point.`,
        suggestedPresetId: 'agave_rosette',
      };
    }
  }

  if (promptLower.includes('conifer') || promptLower.includes('pine') || promptLower.includes('spruce') || promptLower.includes('fir') || promptLower.includes('tower')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'scots_pine_tower');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Switched to **Excurrent Tower** growth profile (*Scots Pine*). Configured monopodial trunk axis with lateral branches clipped by a conical envelope.`,
        suggestedPresetId: 'scots_pine_tower',
      };
    }
  }

  if (promptLower.includes('cypress') || promptLower.includes('spire') || promptLower.includes('poplar') || promptLower.includes('columnar')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'italian_cypress_spire');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Switched to **Columnar Spire** growth profile (*Italian Cypress*). Configured steep lateral vectors (82°) constrained within a narrow capsule shape.`,
        suggestedPresetId: 'italian_cypress_spire',
      };
    }
  }

  if (promptLower.includes('grass') || promptLower.includes('fountain') || promptLower.includes('fern') || promptLower.includes('bamboo') || promptLower.includes('basal')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'fountain_grass_basal');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Switched to **Basal Fountain** growth profile (*Ornamental Fountain Grass*). Generated arched Bezier blade curves from a shared basal anchor with plumose seed heads.`,
        suggestedPresetId: 'fountain_grass_basal',
      };
    }
  }

  if (promptLower.includes('maple') || promptLower.includes('oak') || promptLower.includes('canopy') || promptLower.includes('decurrent') || promptLower.includes('tree')) {
    const preset = PLANT_PRESETS.find((p) => p.id === 'japanese_maple_canopy');
    if (preset) {
      return {
        config: { ...preset.config, seed: Math.floor(Math.random() * 100000) },
        explanation: `Configured **Decurrent Canopy** growth profile (*Japanese Maple*). Generated sympodial spreading branches with broadleaf foliage clusters.`,
        suggestedPresetId: 'japanese_maple_canopy',
      };
    }
  }

  // Parameter adjustments
  if (promptLower.includes('denser') || promptLower.includes('thick')) {
    newConfig.foliageDensity = Math.min(100, (currentConfig.foliageDensity || 50) + 30);
    newConfig.rosetteLeafCount = Math.min(70, (currentConfig.rosetteLeafCount || 36) + 15);
    newConfig.fountainBladeCount = Math.min(140, (currentConfig.fountainBladeCount || 70) + 30);
    changes.push(`increased foliage and element density`);
  }

  if (promptLower.includes('red') || promptLower.includes('crimson') || promptLower.includes('autumn')) {
    newConfig.colorPalette = promptLower.includes('autumn') ? 'autumn_gold' : 'maple_red';
    changes.push(`applied ${newConfig.colorPalette} color palette`);
  }

  newConfig.seed = Math.floor(Math.random() * 100000);

  const explanation = changes.length > 0
    ? `Updated plant model: ${changes.join(', ')}.`
    : `Customized plant geometry with new random seed (${newConfig.seed}).`;

  return {
    config: newConfig,
    explanation,
  };
}
