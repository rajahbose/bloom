export type FoliageType = 
  | 'deciduous' 
  | 'conifer' 
  | 'weeping' 
  | 'palm' 
  | 'broadleaf' 
  | 'architectural_circle' 
  | 'hatch' 
  | 'none';

export type ArchitecturalStyle = 
  | 'vector' 
  | 'blueprint' 
  | 'elevation_silhouette' 
  | 'line_art';

export type ViewMode = 'front' | 'side' | 'plan' | 'dual';

export interface ColorPalette {
  name: string;
  trunk: string;
  branches: string;
  foliagePrimary: string;
  foliageSecondary: string;
  outline: string;
  bg: string;
}

export interface PlantConfig {
  id: string;
  name: string;
  description: string;
  seed: number;
  maxDepth: number; // 1 to 7
  baseAngle: number; // Branch angle spread in degrees (10 - 75)
  angleJitter: number; // Randomness in angle (0 - 1)
  lengthRatio: number; // Branch length reduction (0.5 - 0.88)
  taperRatio: number; // Thickness reduction (0.5 - 0.95)
  trunkLength: number; // Base trunk length (60 - 250)
  trunkThickness: number; // Base trunk width (3 - 35)
  gravity: number; // Bending force: negative = droop/weeping, positive = upright (-1 to 1)
  splitsPerNode: number; // 2 or 3 branches per node
  foliageType: FoliageType;
  foliageDensity: number; // 0 - 100
  foliageSize: number; // 3 - 25
  foliageOpacity: number; // 0.1 - 1.0
  colorPalette: string; // Palette ID
  lineWeight: number; // Stroke weight multiplier (0.5 - 4.0)
  style: ArchitecturalStyle;
  showDimensions: boolean;
  showGrid: boolean;
}

export interface RenderedBranch {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  depth: number;
  angle: number;
}

export interface RenderedFoliage {
  id: string;
  x: number;
  y: number;
  size: number;
  angle: number;
  type: FoliageType;
  color: string;
  opacity: number;
}

export interface PlantPreset {
  id: string;
  name: string;
  category: 'Trees' | 'Palms & Exotic' | 'Shrubs & Bonsai' | 'Architectural Elevation';
  config: Partial<PlantConfig>;
}
