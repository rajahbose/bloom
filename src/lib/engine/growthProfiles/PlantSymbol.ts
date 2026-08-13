import { PlantConfig, RenderedBranch, RenderedFoliage, ColorPalette } from '../../types/plant';
import { PRNG } from '../prng';
import { PALETTES } from '../palettes';
import { generateBotanicalFoliagePath } from '../foliageComplex';

export interface PlantBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export interface CustomPathEntity {
  id: string;
  pathData: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  layer: 'trunk' | 'branches' | 'foliage' | 'details' | 'roots';
}

export interface PlantRenderResult {
  branches: RenderedBranch[];
  foliage: RenderedFoliage[];
  customPaths: CustomPathEntity[];
  bounds: PlantBounds;
  svgContent: string;
}

/**
 * Abstract Base Class for Botanical Growth Profiles (Engine 2.0).
 * Implements organic Bezier limb rendering, buttress root flares, and multi-technique vector styling.
 */
export abstract class PlantSymbol {
  protected config: PlantConfig;
  protected prng: PRNG;
  protected palette: ColorPalette;
  protected canvasWidth: number;
  protected canvasHeight: number;
  protected centerX: number;
  protected startY: number;

  protected minX: number;
  protected maxX: number;
  protected minY: number;
  protected maxY: number;

  constructor(config: PlantConfig, canvasWidth: number = 800, canvasHeight: number = 800) {
    this.config = config;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.centerX = canvasWidth / 2;
    this.startY = canvasHeight - 120;

    this.prng = new PRNG(config.seed);
    this.palette = PALETTES[config.colorPalette] || PALETTES.emerald;

    this.minX = this.centerX;
    this.maxX = this.centerX;
    this.minY = this.startY;
    this.maxY = this.startY;
  }

  abstract generateGeometry(view?: 'front' | 'side' | 'plan'): PlantRenderResult;

  protected updateBounds(x: number, y: number, radius: number = 0) {
    this.minX = Math.min(this.minX, x - radius);
    this.maxX = Math.max(this.maxX, x + radius);
    this.minY = Math.min(this.minY, y - radius);
    this.maxY = Math.max(this.maxY, y + radius);
  }

  protected getCalculatedBounds(): PlantBounds {
    const w = Math.max(20, this.maxX - this.minX);
    const h = Math.max(20, this.maxY - this.minY);
    return {
      minX: this.minX,
      maxX: this.maxX,
      minY: this.minY,
      maxY: this.maxY,
      width: w,
      height: h,
    };
  }

  /**
   * Generates organic root flare buttresses and bark fissure paths at base.
   */
  protected generateRootFlares(baseX: number, baseY: number, trunkWidth: number): CustomPathEntity[] {
    const flareMultiplier = this.config.rootFlare !== undefined ? this.config.rootFlare : 0.8;
    if (flareMultiplier <= 0.05) return [];

    const flareWidth = trunkWidth * (1.2 + flareMultiplier * 1.5);
    const flareHeight = trunkWidth * 1.8;
    const paths: CustomPathEntity[] = [];

    // Left Buttress Root Flare
    const leftFlare = `M ${(baseX - trunkWidth * 0.5).toFixed(1)} ${(baseY - flareHeight).toFixed(1)} Q ${(baseX - trunkWidth * 0.7).toFixed(1)} ${(baseY - flareHeight * 0.3).toFixed(1)} ${(baseX - flareWidth).toFixed(1)} ${baseY.toFixed(1)} L ${(baseX - trunkWidth * 0.3).toFixed(1)} ${baseY.toFixed(1)} Z`;
    paths.push({
      id: 'root-flare-left',
      pathData: leftFlare,
      fill: this.palette.trunkDark || this.palette.trunk,
      stroke: this.palette.outline,
      strokeWidth: 1.2,
      opacity: 0.95,
      layer: 'roots',
    });

    // Right Buttress Root Flare
    const rightFlare = `M ${(baseX + trunkWidth * 0.5).toFixed(1)} ${(baseY - flareHeight).toFixed(1)} Q ${(baseX + trunkWidth * 0.7).toFixed(1)} ${(baseY - flareHeight * 0.3).toFixed(1)} ${(baseX + flareWidth).toFixed(1)} ${baseY.toFixed(1)} L ${(baseX + trunkWidth * 0.3).toFixed(1)} ${baseY.toFixed(1)} Z`;
    paths.push({
      id: 'root-flare-right',
      pathData: rightFlare,
      fill: this.palette.trunkDark || this.palette.trunk,
      stroke: this.palette.outline,
      strokeWidth: 1.2,
      opacity: 0.95,
      layer: 'roots',
    });

    this.updateBounds(baseX - flareWidth, baseY);
    this.updateBounds(baseX + flareWidth, baseY);

    return paths;
  }

  /**
   * Generates organic longitudinal bark fissure lines on the trunk.
   */
  protected generateBarkFissures(baseX: number, baseY: number, trunkHeight: number, trunkWidth: number): CustomPathEntity[] {
    const barkDensity = this.config.barkFissures !== undefined ? this.config.barkFissures : 0.6;
    if (barkDensity <= 0.1) return [];

    const count = Math.floor(4 + barkDensity * 8);
    const paths: CustomPathEntity[] = [];

    for (let i = 0; i < count; i++) {
      const offsetX = this.prng.jitter(trunkWidth * 0.35);
      const startYpos = baseY - this.prng.range(10, trunkHeight * 0.85);
      const fissureLen = this.prng.range(15, 45);
      const cpOffset = this.prng.jitter(4);

      const pathData = `M ${(baseX + offsetX).toFixed(1)} ${startYpos.toFixed(1)} Q ${(baseX + offsetX + cpOffset).toFixed(1)} ${(startYpos - fissureLen * 0.5).toFixed(1)} ${(baseX + offsetX).toFixed(1)} ${(startYpos - fissureLen).toFixed(1)}`;

      paths.push({
        id: `bark-fissure-${i}`,
        pathData,
        fill: 'none',
        stroke: this.palette.trunkDark || '#1f130c',
        strokeWidth: 0.8,
        opacity: 0.75,
        layer: 'details',
      });
    }

    return paths;
  }

  /**
   * Assembles high-fidelity SVG graphic output with CAD layers, shadows, and techniques.
   */
  protected buildSVGContent(
    branches: RenderedBranch[],
    foliage: RenderedFoliage[],
    customPaths: CustomPathEntity[],
    bounds: PlantBounds,
    view: string
  ): string {
    const technique = this.config.renderTechnique || 'botanical_vector';

    // 1. Organic Tapered Branch Polygons or Bezier Curves
    const branchPaths = branches.map((b) => {
      const sw = Math.max(0.8, b.thickness * (this.config.lineWeight || 1.2));
      const strokeColor = b.depth === 1 ? (this.palette.trunkDark || this.palette.trunk) : this.palette.branches;

      if (b.cpX !== undefined && b.cpY !== undefined) {
        // Organic Curved Bezier Branch
        return `<path d="M ${b.x1.toFixed(1)} ${b.y1.toFixed(1)} Q ${b.cpX.toFixed(1)} ${b.cpY.toFixed(1)} ${b.x2.toFixed(1)} ${b.y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" fill="none" />`;
      }
      return `<line x1="${b.x1.toFixed(1)}" y1="${b.y1.toFixed(1)}" x2="${b.x2.toFixed(1)}" y2="${b.y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" />`;
    }).join('\n    ');

    // 2. Custom Geometric Paths (Blades, Sword Leaves, Root Flares)
    const customPathElements = customPaths.map((p) => {
      const fill = p.fill || 'none';
      const stroke = p.stroke || this.palette.outline;
      const sw = p.strokeWidth ? p.strokeWidth * (this.config.lineWeight || 1.2) : 1;
      const op = p.opacity !== undefined ? p.opacity : 1.0;
      return `<path d="${p.pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${sw.toFixed(1)}" opacity="${op.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
    }).join('\n    ');

    // 3. Realistic Botanical Foliage Paths
    const foliageElements = foliage.map((f) => {
      return generateBotanicalFoliagePath(f, {
        technique: technique,
        highlightColor: this.palette.foliageHighlight,
        shadowColor: this.palette.foliageShadow,
      });
    }).join('\n    ');

    // 4. CAD Dimensioning & Datum Line
    const heightMeters = (bounds.height / 80).toFixed(2);
    const widthMeters = (bounds.width / 80).toFixed(2);

    const dimensionLayer = this.config.showDimensions
      ? `<g id="layer-dimensions" stroke="${this.palette.outline}" stroke-width="1" opacity="0.65" font-family="sans-serif" font-size="11" fill="${this.palette.outline}">
          <!-- Height Dimension Line -->
          <line x1="${(bounds.maxX + 32).toFixed(1)}" y1="${bounds.minY.toFixed(1)}" x2="${(bounds.maxX + 32).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" stroke-dasharray="4 4" />
          <line x1="${(bounds.maxX + 24).toFixed(1)}" y1="${bounds.minY.toFixed(1)}" x2="${(bounds.maxX + 40).toFixed(1)}" y2="${bounds.minY.toFixed(1)}" />
          <line x1="${(bounds.maxX + 24).toFixed(1)}" y1="${bounds.maxY.toFixed(1)}" x2="${(bounds.maxX + 40).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" />
          <text x="${(bounds.maxX + 48).toFixed(1)}" y="${((bounds.minY + bounds.maxY) / 2).toFixed(1)}" dominant-baseline="middle" font-weight="600">H: ${heightMeters}m</text>

          <!-- Width Dimension Line -->
          <line x1="${bounds.minX.toFixed(1)}" y1="${(bounds.maxY + 28).toFixed(1)}" x2="${bounds.maxX.toFixed(1)}" y2="${(bounds.maxY + 28).toFixed(1)}" stroke-dasharray="4 4" />
          <line x1="${bounds.minX.toFixed(1)}" y1="${(bounds.maxY + 20).toFixed(1)}" x2="${bounds.minX.toFixed(1)}" y2="${(bounds.maxY + 36).toFixed(1)}" />
          <line x1="${bounds.maxX.toFixed(1)}" y1="${(bounds.maxY + 20).toFixed(1)}" x2="${bounds.maxX.toFixed(1)}" y2="${(bounds.maxY + 36).toFixed(1)}" />
          <text x="${((bounds.minX + bounds.maxX) / 2).toFixed(1)}" y="${(bounds.maxY + 45).toFixed(1)}" text-anchor="middle" font-weight="600">W: ${widthMeters}m (Scale 1:50)</text>

          <!-- Ground Datum Line -->
          <line x1="${(bounds.minX - 50).toFixed(1)}" y1="${bounds.maxY.toFixed(1)}" x2="${(bounds.maxX + 50).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" stroke-width="2" />
        </g>`
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.canvasWidth} ${this.canvasHeight}" width="100%" height="100%">
  <!-- Bloom Botanical Engine 2.0 | Species: ${this.config.name || this.config.growthProfile} | Technique: ${technique} -->
  <defs>
    <filter id="foliage-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)" />
    </filter>
  </defs>

  <g id="layer-roots">
    ${customPaths.filter(p => p.layer === 'roots').map(p => `<path d="${p.pathData}" fill="${p.fill || 'none'}" stroke="${p.stroke || this.palette.outline}" stroke-width="${p.strokeWidth || 1}" />`).join('\n    ')}
  </g>

  <g id="layer-trunk" filter="${technique === 'botanical_vector' ? 'url(#foliage-shadow)' : 'none'}">
    ${branchPaths}
  </g>

  <g id="layer-bark-details">
    ${customPaths.filter(p => p.layer === 'details').map(p => `<path d="${p.pathData}" fill="none" stroke="${p.stroke}" stroke-width="${p.strokeWidth || 1}" opacity="${p.opacity || 0.7}" />`).join('\n    ')}
  </g>

  <g id="layer-custom-paths">
    ${customPaths.filter(p => p.layer !== 'roots' && p.layer !== 'details').map(p => `<path d="${p.pathData}" fill="${p.fill || 'none'}" stroke="${p.stroke || this.palette.outline}" stroke-width="${p.strokeWidth || 1}" opacity="${p.opacity || 1}" />`).join('\n    ')}
  </g>

  <g id="layer-foliage">
    ${foliageElements}
  </g>

  ${dimensionLayer}
</svg>`;
  }
}
