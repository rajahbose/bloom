import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';
import { RenderedFoliage } from '../../types/plant';

/**
 * Growth Profile 5: Basal Fountain (e.g., Ornamental Grass, Fountain Grass, Fern, Bamboo)
 * Math: Multiple Bezier curves originating from a shared base anchor with gravity-offset arching.
 */
export class BasalFountain extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const customPaths: CustomPathEntity[] = [];
    const foliage: RenderedFoliage[] = [];

    const bladeCount = this.config.fountainBladeCount || 60;
    const baseLength = this.config.fountainBladeLength || 150;
    const archFactor = this.config.fountainArchFactor || 0.8;
    const seedDensity = this.config.fountainSeedHeadDensity || 40;

    const baseX = this.centerX;
    const baseY = view === 'plan' ? this.canvasHeight / 2 : this.startY;

    if (view === 'plan') {
      // Top-down radial fountain grass canopy view
      for (let i = 0; i < bladeCount; i++) {
        const angle = (i / bladeCount) * Math.PI * 2 + this.prng.jitter(0.1);
        const len = baseLength * (0.5 + this.prng.next() * 0.5);

        const cp1X = baseX + Math.cos(angle + 0.2 * archFactor) * (len * 0.5);
        const cp1Y = baseY + Math.sin(angle + 0.2 * archFactor) * (len * 0.5);

        const endX = baseX + Math.cos(angle) * len;
        const endY = baseY + Math.sin(angle) * len;

        const pathData = `M ${baseX.toFixed(1)} ${baseY.toFixed(1)} Q ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        this.updateBounds(endX, endY);

        customPaths.push({
          id: `fountain-plan-${i}`,
          pathData,
          fill: 'none',
          stroke: i % 2 === 0 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
          strokeWidth: 1.2,
          opacity: 0.85,
          layer: 'foliage',
        });
      }
    } else {
      // Front & Side Elevation: Arched Bezier blades from base anchor
      const minAngleDeg = -15;
      const maxAngleDeg = 195;
      const minAngleRad = (minAngleDeg * Math.PI) / 180;
      const maxAngleRad = (maxAngleDeg * Math.PI) / 180;

      for (let i = 0; i < bladeCount; i++) {
        const t = bladeCount > 1 ? i / (bladeCount - 1) : 0.5;
        const angle = minAngleRad + t * (maxAngleRad - minAngleRad) + this.prng.jitter(0.06);

        const len = baseLength * (0.65 + this.prng.next() * 0.45);
        
        // Outward direction vector
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle); // Upward in math, negative in screen Y

        // Gravity-driven arching offset: Outer blades droop lower
        const sideOffsetSign = cosA >= 0 ? 1 : -1;
        const droopAmount = Math.abs(cosA) * archFactor * 70;

        const cp1X = baseX + cosA * (len * 0.35);
        const cp1Y = baseY - sinA * (len * 0.4);

        const cp2X = baseX + cosA * (len * 0.75) + sideOffsetSign * (droopAmount * 0.4);
        const cp2Y = baseY - sinA * (len * 0.75) + droopAmount * 0.5;

        const endX = baseX + cosA * len + sideOffsetSign * droopAmount;
        const endY = baseY - sinA * len + droopAmount;

        const startX = baseX + this.prng.jitter(8);
        const pathData = `M ${startX.toFixed(1)} ${baseY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        this.updateBounds(endX, endY);

        customPaths.push({
          id: `fountain-blade-${i}`,
          pathData,
          fill: 'none',
          stroke: i % 2 === 0 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
          strokeWidth: Math.max(0.8, (1.8 * (1 - Math.abs(t - 0.5) * 0.6))),
          opacity: 0.85,
          layer: 'foliage',
        });

        // Inflorescence / Seed Heads at blade tips (for a portion of blades)
        if (this.prng.next() * 100 < seedDensity) {
          foliage.push({
            id: `fountain-seed-${i}`,
            x: endX,
            y: endY,
            size: 4 + this.prng.next() * 5,
            angle: Math.atan2(endY - cp2Y, endX - cp2X),
            type: 'hatch',
            color: this.palette.foliagePrimary,
            opacity: 0.9,
          });
        }
      }
    }

    const bounds = this.getCalculatedBounds();
    const svgContent = this.buildSVGContent([], foliage, customPaths, bounds, view);

    return {
      branches: [],
      foliage,
      customPaths,
      bounds,
      svgContent,
    };
  }
}
