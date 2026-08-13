import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';

/**
 * Growth Profile 1: Radial Rosette (Engine 2.0)
 * Realistic succulent / agave sword leaves with 3D beveled ridge shading, terminal spikes, and margin accents.
 */
export class RadialRosette extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const customPaths: CustomPathEntity[] = [];
    const leafCount = this.config.rosetteLeafCount || 38;
    const baseLength = this.config.rosetteLeafLength || 150;
    const curl = this.config.rosetteCurl || 0.25;
    const layers = Math.max(1, this.config.rosetteLayers || 4);

    const anchorX = this.centerX;
    const anchorY = view === 'plan' ? this.canvasHeight / 2 : this.startY;

    if (view === 'plan') {
      // 360-degree Top-Down Rosette Plan with Dual-Tone Beveled Leaves
      for (let layer = layers; layer >= 1; layer--) {
        const layerRatio = layer / layers;
        const countInLayer = Math.floor(leafCount / layers);
        const radius = baseLength * layerRatio;

        for (let i = 0; i < countInLayer; i++) {
          const angle = (i / countInLayer) * Math.PI * 2 + (layer % 2 === 0 ? Math.PI / countInLayer : 0) + this.prng.jitter(0.08);
          const leafLen = radius * (0.85 + this.prng.next() * 0.3);
          const baseW = (14 * layerRatio) * (0.85 + this.prng.next() * 0.3);

          const tipX = anchorX + Math.cos(angle) * leafLen;
          const tipY = anchorY + Math.sin(angle) * leafLen;

          const perpAngle = angle + Math.PI / 2;
          const b1X = anchorX + Math.cos(perpAngle) * (baseW / 2);
          const b1Y = anchorY + Math.sin(perpAngle) * (baseW / 2);
          const b2X = anchorX - Math.cos(perpAngle) * (baseW / 2);
          const b2Y = anchorY - Math.sin(perpAngle) * (baseW / 2);

          const cp1X = anchorX + Math.cos(angle + curl * 0.4) * (leafLen * 0.55);
          const cp1Y = anchorY + Math.sin(angle + curl * 0.4) * (leafLen * 0.55);

          // Left Half (Light tone)
          const leftHalf = `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} L ${b1X.toFixed(1)} ${b1Y.toFixed(1)} Q ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Z`;
          // Right Half (Shadow tone)
          const rightHalf = `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} L ${b2X.toFixed(1)} ${b2Y.toFixed(1)} Q ${(cp1X - 3).toFixed(1)} ${(cp1Y - 3).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Z`;

          this.updateBounds(tipX, tipY);

          customPaths.push(
            {
              id: `rosette-plan-l-${layer}-${i}`,
              pathData: leftHalf,
              fill: this.palette.foliagePrimary,
              stroke: this.palette.outline,
              strokeWidth: 1,
              opacity: 0.9,
              layer: 'foliage',
            },
            {
              id: `rosette-plan-r-${layer}-${i}`,
              pathData: rightHalf,
              fill: this.palette.foliageShadow || this.palette.foliageSecondary,
              stroke: this.palette.outline,
              strokeWidth: 1,
              opacity: 0.9,
              layer: 'foliage',
            }
          );
        }
      }
    } else {
      // Front / Side Elevation: 3D Layered Arching Sword Blades with Central Bevel Ridge & Spine Spikes
      for (let layer = layers; layer >= 1; layer--) {
        const layerScale = layer / layers;
        const leavesInLayer = Math.floor(leafCount / layers);

        const minAngleDeg = -22 + (1 - layerScale) * 48;
        const maxAngleDeg = 202 - (1 - layerScale) * 48;
        const minAngleRad = (minAngleDeg * Math.PI) / 180;
        const maxAngleRad = (maxAngleDeg * Math.PI) / 180;

        for (let i = 0; i < leavesInLayer; i++) {
          const t = leavesInLayer > 1 ? i / (leavesInLayer - 1) : 0.5;
          const angle = minAngleRad + t * (maxAngleRad - minAngleRad) + this.prng.jitter(0.06);

          const leafLen = baseLength * (0.65 + layerScale * 0.45) * (0.88 + this.prng.next() * 0.25);
          const baseWidth = (16 * layerScale) * (0.85 + this.prng.next() * 0.35);

          const dx = Math.cos(angle);
          const dy = -Math.sin(angle);

          const tipX = anchorX + dx * leafLen;
          const tipY = anchorY + dy * leafLen;

          const archOffset = Math.sin(angle) * curl * 45;
          const cpX = anchorX + dx * (leafLen * 0.5);
          const cpY = anchorY + dy * (leafLen * 0.5) + archOffset;

          const perpX = -dy * (baseWidth / 2);
          const perpY = dx * (baseWidth / 2);

          const b1X = anchorX + perpX;
          const b1Y = anchorY + perpY;
          const b2X = anchorX - perpX;
          const b2Y = anchorY - perpY;

          // Main 3D Leaf Blade Outline with Central Spine Ridge
          const leafBlade = `M ${b1X.toFixed(1)} ${b1Y.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${cpX.toFixed(1)} ${(cpY + 6).toFixed(1)} ${b2X.toFixed(1)} ${b2Y.toFixed(1)} Z`;
          // Central Spine Ridge Line
          const spineRidge = `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} Q ${cpX.toFixed(1)} ${(cpY + 3).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`;
          // Terminal Needle Spine Spike
          const spineSpike = `M ${tipX.toFixed(1)} ${tipY.toFixed(1)} L ${(tipX + dx * 6).toFixed(1)} ${(tipY + dy * 6).toFixed(1)}`;

          this.updateBounds(tipX, tipY);

          customPaths.push(
            {
              id: `rosette-elev-blade-${layer}-${i}`,
              pathData: leafBlade,
              fill: t > 0.35 && t < 0.65 ? this.palette.foliagePrimary : (this.palette.foliageShadow || this.palette.foliageSecondary),
              stroke: this.palette.outline,
              strokeWidth: 1.2,
              opacity: 0.92,
              layer: 'foliage',
            },
            {
              id: `rosette-elev-spine-${layer}-${i}`,
              pathData: spineRidge,
              fill: 'none',
              stroke: this.palette.foliageHighlight || '#ffffff',
              strokeWidth: 0.8,
              opacity: 0.6,
              layer: 'details',
            },
            {
              id: `rosette-elev-spike-${layer}-${i}`,
              pathData: spineSpike,
              fill: 'none',
              stroke: this.palette.accent || '#ea580c',
              strokeWidth: 1.4,
              opacity: 0.95,
              layer: 'details',
            }
          );
        }
      }
    }

    const bounds = this.getCalculatedBounds();
    const svgContent = this.buildSVGContent([], [], customPaths, bounds, view);

    return {
      branches: [],
      foliage: [],
      customPaths,
      bounds,
      svgContent,
    };
  }
}
