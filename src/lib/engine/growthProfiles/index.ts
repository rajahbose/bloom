import { PlantSymbol, PlantRenderResult } from './PlantSymbol';
import { RadialRosette } from './RadialRosette';
import { ExcurrentTower } from './ExcurrentTower';
import { DecurrentCanopy } from './DecurrentCanopy';
import { ColumnarSpire } from './ColumnarSpire';
import { BasalFountain } from './BasalFountain';
import { PlantConfig } from '../../types/plant';

export * from './PlantSymbol';
export * from './RadialRosette';
export * from './ExcurrentTower';
export * from './DecurrentCanopy';
export * from './ColumnarSpire';
export * from './BasalFountain';

/**
 * Factory dispatcher function that instantiates the appropriate
 * Growth Profile generator based on config.growthProfile.
 */
export function createPlantSymbol(
  config: PlantConfig,
  canvasWidth: number = 800,
  canvasHeight: number = 800
): PlantSymbol {
  switch (config.growthProfile) {
    case 'radial_rosette':
      return new RadialRosette(config, canvasWidth, canvasHeight);
    case 'excurrent_tower':
      return new ExcurrentTower(config, canvasWidth, canvasHeight);
    case 'columnar_spire':
      return new ColumnarSpire(config, canvasWidth, canvasHeight);
    case 'basal_fountain':
      return new BasalFountain(config, canvasWidth, canvasHeight);
    case 'decurrent_canopy':
    default:
      return new DecurrentCanopy(config, canvasWidth, canvasHeight);
  }
}

export function generatePlantSymbolGeometry(
  config: PlantConfig,
  view: 'front' | 'side' | 'plan' = 'front',
  canvasWidth: number = 800,
  canvasHeight: number = 800
): PlantRenderResult {
  const symbol = createPlantSymbol(config, canvasWidth, canvasHeight);
  return symbol.generateGeometry(view);
}
