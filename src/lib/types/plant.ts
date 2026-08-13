export type GrowthProfileType = 
  | 'radial_rosette'  // Yucca / Agave / Succulents
  | 'excurrent_tower' // Conifers / Pines / Firs
  | 'decurrent_canopy'// Maples / Oaks / Broadleaf trees
  | 'columnar_spire'  // Poplars / Cypress / Columnar Junipers
  | 'basal_fountain';  // Ornamental Grasses / Ferns / Bamboo

export type FoliageType = 
  | 'deciduous' 
  | 'conifer' 
  | 'weeping' 
  | 'palm' 
  | 'broadleaf' 
  | 'architectural_circle' 
  | 'hatch' 
  | 'blade'
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
  growthProfile: GrowthProfileType;
  
  // Decurrent Canopy & Excurrent Tower Parameters
  maxDepth: number; // 1 to 7
  baseAngle: number; // Branch angle spread in degrees (10 - 75)
  angleJitter: number; // Randomness in angle (0 - 1)
  lengthRatio: number; // Branch length reduction (0.5 - 0.88)
  taperRatio: number; // Thickness reduction (0.5 - 0.95)
  trunkLength: number; // Base trunk length (60 - 250)
  trunkThickness: number; // Base trunk width (3 - 35)
  gravity: number; // Bending force (-1 to 1)
  splitsPerNode: number; // 2 or 3 branches per node

  // Radial Rosette Influence Parameters
  rosetteLeafCount: number; // 12 - 70
  rosetteLeafLength: number; // 40 - 220
  rosetteCurl: number; // Curvature factor (-1 to 1)
  rosetteLayers: number; // Concentric rings (1 - 5)

  // Columnar Spire Influence Parameters
  spireWidth: number; // Capsule width constraint (20 - 90)
  spireBranchAngle: number; // Steep elevation angle (60 - 88)

  // Basal Fountain Influence Parameters
  fountainBladeCount: number; // 20 - 150
  fountainArchFactor: number; // Arch curvature (0.2 - 2.0)
  fountainBladeLength: number; // 50 - 240
  fountainSeedHeadDensity: number; // 0 - 100

  // General Foliage & CAD Appearance
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
  pathData?: string; // Optional custom SVG path data for blades/swords
}

export interface PlantPreset {
  id: string;
  name: string;
  category: 'Rosette & Succulents' | 'Conifers' | 'Deciduous Trees' | 'Spires' | 'Grasses & Ferns';
  config: Partial<PlantConfig>;
}
