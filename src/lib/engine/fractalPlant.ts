import { PRNG } from './prng';
import { PlantConfig, RenderedBranch, RenderedFoliage } from '../types/plant';
import { PALETTES } from './palettes';
import { generateFoliageForBranch } from './foliage';

export interface PlantRenderResult {
  branches: RenderedBranch[];
  foliage: RenderedFoliage[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    height: number;
    width: number;
  };
  svgContent: string;
}

export function generatePlantGeometry(
  config: PlantConfig,
  view: 'front' | 'side' | 'plan' = 'front',
  canvasWidth: number = 800,
  canvasHeight: number = 800
): PlantRenderResult {
  const prng = new PRNG(config.seed + (view === 'side' ? 9999 : view === 'plan' ? 7777 : 0));
  const palette = PALETTES[config.colorPalette] || PALETTES.emerald;

  const branches: RenderedBranch[] = [];
  const foliage: RenderedFoliage[] = [];

  const centerX = canvasWidth / 2;
  const startY = canvasHeight - 120; // Leave space at bottom for ground/dimensions

  let minX = centerX;
  let maxX = centerX;
  let minY = startY;
  let maxY = startY;

  function updateBounds(x: number, y: number, radius: number = 0) {
    minX = Math.min(minX, x - radius);
    maxX = Math.max(maxX, x + radius);
    minY = Math.min(minY, y - radius);
    maxY = Math.max(maxY, y + radius);
  }

  // Convert base angle from degrees to radians
  const angleSpreadRad = (config.baseAngle * Math.PI) / 180;

  if (view === 'plan') {
    // TOP / PLAN VIEW CANOPY GENERATION
    const planRadius = config.trunkLength * 1.2;
    const ringCount = Math.max(3, config.maxDepth);
    
    // Core trunk dot in center
    updateBounds(centerX - planRadius, startY - planRadius);
    updateBounds(centerX + planRadius, startY + planRadius);

    // Radial branching from center
    const radialCount = Math.floor(6 + config.splitsPerNode * 3);
    for (let r = 0; r < radialCount; r++) {
      const angle = (r / radialCount) * Math.PI * 2 + prng.jitter(0.2);
      const length = planRadius * (0.6 + prng.next() * 0.4);
      const endX = centerX + Math.cos(angle) * length;
      const endY = (canvasHeight / 2) + Math.sin(angle) * length;

      branches.push({
        id: `plan-branch-${r}`,
        x1: centerX,
        y1: canvasHeight / 2,
        x2: endX,
        y2: endY,
        thickness: config.trunkThickness * 0.4,
        depth: 1,
        angle: angle,
      });

      // Sub-branches in plan view
      for (let sub = 0; sub < 2; sub++) {
        const subAngle = angle + prng.jitter(0.4);
        const subLen = length * 0.5;
        const subX = endX + Math.cos(subAngle) * subLen;
        const subY = endY + Math.sin(subAngle) * subLen;

        branches.push({
          id: `plan-sub-${r}-${sub}`,
          x1: endX,
          y1: endY,
          x2: subX,
          y2: subY,
          thickness: config.trunkThickness * 0.2,
          depth: 2,
          angle: subAngle,
        });

        // Foliage in plan view
        const fol = generateFoliageForBranch(
          subX,
          subY,
          subAngle,
          config.maxDepth,
          config.maxDepth,
          config.foliageType,
          config.foliageDensity,
          config.foliageSize,
          config.foliageOpacity,
          prng,
          palette.foliagePrimary,
          palette.foliageSecondary
        );
        foliage.push(...fol);
      }
    }
  } else {
    // FRONT OR SIDE ELEVATION RECURSIVE BRANCHING
    function buildBranch(
      x: number,
      y: number,
      currentAngle: number,
      length: number,
      thickness: number,
      depth: number
    ) {
      if (depth > config.maxDepth || length < 4 || thickness < 0.5) return;

      // Apply side-view perspective distortion if side view
      const sideFactor = view === 'side' ? (depth % 2 === 0 ? 0.7 : 1.2) : 1.0;
      
      // Calculate bending force (Gravity factor: negative = drooping/weeping, positive = upward)
      let adjustedAngle = currentAngle;
      if (depth > 1) {
        // Gravity effect pulls downward (Math.PI/2) or upward (-Math.PI/2)
        const targetGravityAngle = config.gravity < 0 ? Math.PI / 2 : -Math.PI / 2;
        const gravityStrength = Math.abs(config.gravity) * 0.15 * (depth / config.maxDepth);
        adjustedAngle = adjustedAngle + (targetGravityAngle - adjustedAngle) * gravityStrength;
      }

      // Add angle jitter
      const angleJitterVal = prng.jitter(angleSpreadRad * config.angleJitter * 0.4);
      const finalAngle = adjustedAngle + angleJitterVal;

      const endX = x + Math.cos(finalAngle) * length * sideFactor;
      const endY = y + Math.sin(finalAngle) * length;

      updateBounds(x, y);
      updateBounds(endX, endY);

      branches.push({
        id: `b-${depth}-${branches.length}`,
        x1: x,
        y1: y,
        x2: endX,
        y2: endY,
        thickness: thickness,
        depth: depth,
        angle: finalAngle,
      });

      // Generate foliage along branch tip/nodes
      const generatedFoliage = generateFoliageForBranch(
        endX,
        endY,
        finalAngle,
        depth,
        config.maxDepth,
        config.foliageType,
        config.foliageDensity,
        config.foliageSize,
        config.foliageOpacity,
        prng,
        palette.foliagePrimary,
        palette.foliageSecondary
      );
      foliage.push(...generatedFoliage);

      // Recursive node splitting
      const numBranches = depth === 1 ? config.splitsPerNode : (prng.next() > 0.3 ? config.splitsPerNode : 2);
      const nextLength = length * config.lengthRatio * (0.85 + prng.next() * 0.3);
      const nextThickness = Math.max(0.8, thickness * config.taperRatio);

      // Angle distribution across child branches
      const startSplitAngle = finalAngle - angleSpreadRad / 2;
      const stepAngle = numBranches > 1 ? angleSpreadRad / (numBranches - 1) : 0;

      for (let i = 0; i < numBranches; i++) {
        const childAngle = numBranches === 1 ? finalAngle : startSplitAngle + stepAngle * i;
        buildBranch(
          endX,
          endY,
          childAngle,
          nextLength,
          nextThickness,
          depth + 1
        );
      }
    }

    // Initial Trunk (pointing straight up: -Math.PI / 2)
    buildBranch(
      centerX,
      startY,
      -Math.PI / 2,
      config.trunkLength,
      config.trunkThickness,
      1
    );
  }

  const plantWidth = Math.max(20, maxX - minX);
  const plantHeight = Math.max(20, maxY - minY);

  const bounds = {
    minX,
    maxX,
    minY,
    maxY,
    width: plantWidth,
    height: plantHeight,
  };

  // Generate SVG Code string for rendering or export
  const svgContent = buildSVGString(config, branches, foliage, bounds, palette, view, canvasWidth, canvasHeight);

  return {
    branches,
    foliage,
    bounds,
    svgContent,
  };
}

function buildSVGString(
  config: PlantConfig,
  branches: RenderedBranch[],
  foliage: RenderedFoliage[],
  bounds: { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number },
  palette: typeof PALETTES['emerald'],
  view: string,
  width: number,
  height: number
): string {
  // CAD Layer grouping
  const branchPaths = branches.map((b) => {
    const sw = Math.max(0.5, b.thickness * config.lineWeight);
    const strokeColor = b.depth === 1 ? palette.trunk : palette.branches;
    return `<line x1="${b.x1.toFixed(1)}" y1="${b.y1.toFixed(1)}" x2="${b.x2.toFixed(1)}" y2="${b.y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" />`;
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

  // Dimensions & Ground Line Layer
  const heightMeters = (bounds.height / 80).toFixed(2);
  const widthMeters = (bounds.width / 80).toFixed(2);

  const dimensionLayer = config.showDimensions
    ? `<g id="layer-dimensions" stroke="${palette.outline}" stroke-width="1" opacity="0.6" font-family="sans-serif" font-size="11" fill="${palette.outline}">
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

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <!-- Bloom Botanical CAD Symbol | View: ${view.toUpperCase()} | Config Seed: ${config.seed} -->
  <defs>
    <style>
      .cad-trunk { stroke: ${palette.trunk}; stroke-linecap: round; }
      .cad-branch { stroke: ${palette.branches}; stroke-linecap: round; }
      .cad-foliage { fill: ${palette.foliagePrimary}; }
    </style>
  </defs>

  <g id="layer-trunk" class="cad-trunk-group">
    ${branchPaths}
  </g>

  <g id="layer-foliage" class="cad-foliage-group">
    ${foliageElements}
  </g>

  ${dimensionLayer}
</svg>`;
}
