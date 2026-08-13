import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';

/**
 * Growth Profile 1: Radial Rosette (e.g., Agave, Yucca, Aloe)
 * Math: Rotational loops emitting tapering sword-shaped paths from a central anchor point.
 */
export class RadialRosette extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const customPaths: CustomPathEntity[] = [];
    const leafCount = this.config.rosetteLeafCount || 36;
    const baseLength = this.config.rosetteLeafLength || 140;
    const curl = this.config.rosetteCurl || 0.2;
    const layers = Math.max(1, this.config.rosetteLayers || 3);

    const anchorX = this.centerX;
    const anchorY = view === 'plan' ? this.canvasHeight / 2 : this.startY;

    if (view === 'plan') {
      // Top-down rosette plan view: 360-degree radial rosette
      for (let layer = layers; layer >= 1; layer--) {
        const layerRatio = layer / layers;
        const countInLayer = Math.floor(leafCount / layers);
        const radius = baseLength * layerRatio;

        for (let i = 0; i < countInLayer; i++) {
          const angle = (i / countInLayer) * Math.PI * 2 + (layer % 2 === 0 ? Math.PI / countInLayer : 0) + this.prng.jitter(0.1);
          const leafLen = radius * (0.85 + this.prng.next() * 0.3);
          const baseW = (12 * layerRatio) * (0.8 + this.prng.next() * 0.4);

          const tipX = anchorX + Math.cos(angle) * leafLen;
          const tipY = anchorY + Math.sin(angle) * leafLen;

          const perpAngle = angle + Math.PI / 2;
          const b1X = anchorX + Math.cos(perpAngle) * (baseW / 2);
          const b1Y = anchorY + Math.sin(perpAngle) * (baseW / 2);
          const b2X = anchorX - Math.cos(perpAngle) * (baseW / 2);
          const b2Y = anchorY - Math.sin(perpAngle) * (baseW / 2);

          const cp1X = anchorX + Math.cos(angle + curl) * (leafLen * 0.5);
          const cp1Y = anchorY + Math.sin(angle + curl) * (leafLen * 0.5);

          const pathData = `M ${b1X.toFixed(1)} ${b1Y.toFixed(1)} Q ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} ${b2X.toFixed(1)} ${b2Y.toFixed(1)} Z`;

          this.updateBounds(tipX, tipY);

          customPaths.push({
            id: `rosette-plan-${layer}-${i}`,
            pathData,
            fill: layer % 2 === 0 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            stroke: this.palette.outline,
            strokeWidth: 1,
            opacity: 0.85 + layerRatio * 0.15,
            layer: 'foliage',
          });
        }
      }
    } else {
      // Front/Side elevation view: Arching sword blades from base anchor
      for (let layer = layers; layer >= 1; layer--) {
        const layerScale = layer / layers;
        const leavesInLayer = Math.floor(leafCount / layers);

        // Angle arc: outer leaves droop horizontally (-20deg to 200deg), inner leaves stand upright (30deg to 150deg)
        const minAngleDeg = -20 + (1 - layerScale) * 45;
        const maxAngleDeg = 200 - (1 - layerScale) * 45;
        const minAngleRad = (minAngleDeg * Math.PI) / 180;
        const maxAngleRad = (maxAngleDeg * Math.PI) / 180;

        for (let i = 0; i < leavesInLayer; i++) {
          const t = leavesInLayer > 1 ? i / (leavesInLayer - 1) : 0.5;
          const angle = minAngleRad + t * (maxAngleRad - minAngleRad) + this.prng.jitter(0.08);

          const leafLen = baseLength * (0.6 + layerScale * 0.5) * (0.88 + this.prng.next() * 0.25);
          const baseWidth = (14 * layerScale) * (0.8 + this.prng.next() * 0.4);

          // Vector direction pointing outward/upward
          const dx = Math.cos(angle);
          const dy = -Math.sin(angle); // Screen coordinates point down

          const tipX = anchorX + dx * leafLen;
          const tipY = anchorY + dy * leafLen;

          // Curvature drift (arching downward under weight)
          const archOffset = Math.sin(angle) * curl * 40;
          const cpX = anchorX + dx * (leafLen * 0.5);
          const cpY = anchorY + dy * (leafLen * 0.5) + archOffset;

          const perpX = -dy * (baseWidth / 2);
          const perpY = dx * (baseWidth / 2);

          const b1X = anchorX + perpX;
          const b1Y = anchorY + perpY;
          const b2X = anchorX - perpX;
          const b2Y = anchorY - perpY;

          const pathData = `M ${b1X.toFixed(1)} ${b1Y.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${cpX.toFixed(1)} ${(cpY + 5).toFixed(1)} ${b2X.toFixed(1)} ${b2Y.toFixed(1)} Z`;

          this.updateBounds(tipX, tipY);

          customPaths.push({
            id: `rosette-elev-${layer}-${i}`,
            pathData,
            fill: t > 0.3 && t < 0.7 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            stroke: this.palette.outline,
            strokeWidth: 1.2,
            opacity: 0.9,
            layer: 'foliage',
          });
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
