import { PlantConfig } from '../types/plant';
import { generatePlantSymbolGeometry, PlantRenderResult } from './growthProfiles';

export type { PlantRenderResult };

export function generatePlantGeometry(
  config: PlantConfig,
  view: 'front' | 'side' | 'plan' = 'front',
  canvasWidth: number = 800,
  canvasHeight: number = 800
): PlantRenderResult {
  return generatePlantSymbolGeometry(config, view, canvasWidth, canvasHeight);
}
