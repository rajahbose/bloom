import { PlantConfig, RenderedBranch, RenderedFoliage, ColorPalette } from '../../types/plant';
import { PRNG } from '../prng';
import { PALETTES } from '../palettes';

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
  layer: 'trunk' | 'branches' | 'foliage' | 'details';
}

export interface PlantRenderResult {
  branches: RenderedBranch[];
  foliage: RenderedFoliage[];
  customPaths: CustomPathEntity[];
  bounds: PlantBounds;
  svgContent: string;
}

/**
 * Abstract Base Class for all Botanical Growth Profiles.
 * Assumes a coordinate system where (0,0) is centered at base anchor or (centerX, startY).
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

  /**
   * Abstract method implemented by each concrete growth profile.
   */
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

  protected buildSVGContent(
    branches: RenderedBranch[],
    foliage: RenderedFoliage[],
    customPaths: CustomPathEntity[],
    bounds: PlantBounds,
    view: string
  ): string {
    const branchPaths = branches.map((b) => {
      const sw = Math.max(0.5, b.thickness * this.config.lineWeight);
      const strokeColor = b.depth === 1 ? this.palette.trunk : this.palette.branches;
      return `<line x1="${b.x1.toFixed(1)}" y1="${b.y1.toFixed(1)}" x2="${b.x2.toFixed(1)}" y2="${b.y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" />`;
    }).join('\n    ');

    const customPathElements = customPaths.map((p) => {
      const fill = p.fill || 'none';
      const stroke = p.stroke || this.palette.outline;
      const sw = p.strokeWidth ? p.strokeWidth * this.config.lineWeight : 1;
      const op = p.opacity !== undefined ? p.opacity : 1.0;
      return `<path d="${p.pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${sw.toFixed(1)}" opacity="${op.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
    }).join('\n    ');

    const foliageElements = foliage.map((f) => {
      const { x, y, size, angle, type, color, opacity } = f;
      const deg = (angle * 180) / Math.PI;
      if (type === 'conifer') {
        return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
          <line x1="0" y1="0" x2="${(-size * 0.8).toFixed(1)}" y2="${(-size * 0.6).toFixed(1)}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="0" y1="0" x2="0" y2="${(-size * 0.9).toFixed(1)}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="0" y1="0" x2="${(size * 0.8).toFixed(1)}" y2="${(-size * 0.6).toFixed(1)}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
        </g>`;
      } else if (type === 'architectural_circle') {
        return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" opacity="${opacity.toFixed(2)}">
          <circle cx="0" cy="0" r="${size.toFixed(1)}" fill="none" stroke="${color}" stroke-width="1" />
          <circle cx="0" cy="0" r="${(size * 0.4).toFixed(1)}" fill="${color}" />
        </g>`;
      }
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`;
    }).join('\n    ');

    const heightMeters = (bounds.height / 80).toFixed(2);
    const widthMeters = (bounds.width / 80).toFixed(2);

    const dimensionLayer = this.config.showDimensions
      ? `<g id="layer-dimensions" stroke="${this.palette.outline}" stroke-width="1" opacity="0.6" font-family="sans-serif" font-size="11" fill="${this.palette.outline}">
          <!-- Height Dimension Line -->
          <line x1="${(bounds.maxX + 30).toFixed(1)}" y1="${bounds.minY.toFixed(1)}" x2="${(bounds.maxX + 30).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" stroke-dasharray="4 4" />
          <line x1="${(bounds.maxX + 22).toFixed(1)}" y1="${bounds.minY.toFixed(1)}" x2="${(bounds.maxX + 38).toFixed(1)}" y2="${bounds.minY.toFixed(1)}" />
          <line x1="${(bounds.maxX + 22).toFixed(1)}" y1="${bounds.maxY.toFixed(1)}" x2="${(bounds.maxX + 38).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" />
          <text x="${(bounds.maxX + 45).toFixed(1)}" y="${((bounds.minY + bounds.maxY) / 2).toFixed(1)}" dominant-baseline="middle">H: ${heightMeters}m</text>

          <!-- Width Dimension Line -->
          <line x1="${bounds.minX.toFixed(1)}" y1="${(bounds.maxY + 25).toFixed(1)}" x2="${bounds.maxX.toFixed(1)}" y2="${(bounds.maxY + 25).toFixed(1)}" stroke-dasharray="4 4" />
          <line x1="${bounds.minX.toFixed(1)}" y1="${(bounds.maxY + 17).toFixed(1)}" x2="${bounds.minX.toFixed(1)}" y2="${(bounds.maxY + 33).toFixed(1)}" />
          <line x1="${bounds.maxX.toFixed(1)}" y1="${(bounds.maxY + 17).toFixed(1)}" x2="${bounds.maxX.toFixed(1)}" y2="${(bounds.maxY + 33).toFixed(1)}" />
          <text x="${((bounds.minX + bounds.maxX) / 2).toFixed(1)}" y="${(bounds.maxY + 42).toFixed(1)}" text-anchor="middle">W: ${widthMeters}m (Scale 1:50)</text>

          <!-- Ground Datum Line -->
          <line x1="${(bounds.minX - 40).toFixed(1)}" y1="${bounds.maxY.toFixed(1)}" x2="${(bounds.maxX + 40).toFixed(1)}" y2="${bounds.maxY.toFixed(1)}" stroke-width="1.5" />
        </g>`
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.canvasWidth} ${this.canvasHeight}" width="100%" height="100%">
  <!-- Bloom Scripted Symbol | Growth Profile: ${this.config.growthProfile.toUpperCase()} | Seed: ${this.config.seed} -->
  <g id="layer-trunk">
    ${branchPaths}
  </g>

  <g id="layer-custom-paths">
    ${customPathElements}
  </g>

  <g id="layer-foliage">
    ${foliageElements}
  </g>

  ${dimensionLayer}
</svg>`;
  }
}
