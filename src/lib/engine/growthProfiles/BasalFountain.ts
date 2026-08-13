import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';
import { RenderedFoliage } from '../../types/plant';

/**
 * Growth Profile 5: Basal Fountain (Engine 2.0)
 * Realistic ornamental grasses, ferns, and fountain plumes with tapered blades, midrib veins, and seed heads.
 */
export class BasalFountain extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const customPaths: CustomPathEntity[] = [];
    const foliage: RenderedFoliage[] = [];

    const bladeCount = this.config.fountainBladeCount || 75;
    const baseLength = this.config.fountainBladeLength || 160;
    const archFactor = this.config.fountainArchFactor || 0.85;
    const seedDensity = this.config.fountainSeedHeadDensity || 45;
    const windDrift = this.config.windDrift || 0;

    const baseX = this.centerX;
    const baseY = view === 'plan' ? this.canvasHeight / 2 : this.startY;

    if (view === 'plan') {
      // Top-Down Radial Fountain Plan with Multi-tone Blades
      for (let i = 0; i < bladeCount; i++) {
        const angle = (i / bladeCount) * Math.PI * 2 + this.prng.jitter(0.08);
        const len = baseLength * (0.55 + this.prng.next() * 0.45);

        const cp1X = baseX + Math.cos(angle + 0.18 * archFactor) * (len * 0.55);
        const cp1Y = baseY + Math.sin(angle + 0.18 * archFactor) * (len * 0.55);

        const endX = baseX + Math.cos(angle) * len;
        const endY = baseY + Math.sin(angle) * len;

        const pathData = `M ${baseX.toFixed(1)} ${baseY.toFixed(1)} Q ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        this.updateBounds(endX, endY);

        customPaths.push({
          id: `fountain-plan-${i}`,
          pathData,
          fill: 'none',
          stroke: i % 2 === 0 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
          strokeWidth: 1.3,
          opacity: 0.88,
          layer: 'foliage',
        });
      }
    } else {
      // Front & Side Elevation: Realistic Arched Tapered Blades with Variegated Midribs & Plumose Seed Heads
      const minAngleDeg = -18;
      const maxAngleDeg = 198;
      const minAngleRad = (minAngleDeg * Math.PI) / 180;
      const maxAngleRad = (maxAngleDeg * Math.PI) / 180;

      for (let i = 0; i < bladeCount; i++) {
        const t = bladeCount > 1 ? i / (bladeCount - 1) : 0.5;
        const angle = minAngleRad + t * (maxAngleRad - minAngleRad) + this.prng.jitter(0.05);

        const len = baseLength * (0.68 + this.prng.next() * 0.45);
        
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // Wind drift bias + gravity arching
        const sideOffsetSign = cosA >= 0 ? 1 : -1;
        const droopAmount = Math.abs(cosA) * archFactor * 75;
        const windShift = windDrift * 35 * (1 - Math.abs(cosA) * 0.5);

        const cp1X = baseX + cosA * (len * 0.35) + windShift * 0.3;
        const cp1Y = baseY - sinA * (len * 0.42);

        const cp2X = baseX + cosA * (len * 0.75) + sideOffsetSign * (droopAmount * 0.45) + windShift * 0.7;
        const cp2Y = baseY - sinA * (len * 0.75) + droopAmount * 0.55;

        const endX = baseX + cosA * len + sideOffsetSign * droopAmount + windShift;
        const endY = baseY - sinA * len + droopAmount;

        const startX = baseX + this.prng.jitter(10);
        
        // 1. Main Tapered Blade Curve
        const bladePath = `M ${startX.toFixed(1)} ${baseY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        this.updateBounds(endX, endY);

        customPaths.push({
          id: `fountain-blade-${i}`,
          pathData: bladePath,
          fill: 'none',
          stroke: i % 3 === 0 ? (this.palette.foliageHighlight || this.palette.foliagePrimary) : (i % 2 === 0 ? this.palette.foliagePrimary : this.palette.foliageSecondary),
          strokeWidth: Math.max(0.9, 2.0 * (1 - Math.abs(t - 0.5) * 0.6)),
          opacity: 0.88,
          layer: 'foliage',
        });

        // 2. Plumose / Feathered Inflorescence Seed Heads at Blade Tips
        if (this.prng.next() * 100 < seedDensity) {
          const plumeAngle = Math.atan2(endY - cp2Y, endX - cp2X);
          const plumeLen = 14 + this.prng.next() * 10;
          const tipPlumeX = endX + Math.cos(plumeAngle) * plumeLen;
          const tipPlumeY = endY + Math.sin(plumeAngle) * plumeLen;

          const plumePath = `M ${endX.toFixed(1)} ${endY.toFixed(1)} L ${tipPlumeX.toFixed(1)} ${tipPlumeY.toFixed(1)}`;
          customPaths.push({
            id: `fountain-plume-${i}`,
            pathData: plumePath,
            fill: 'none',
            stroke: this.palette.accent || '#ea580c',
            strokeWidth: 2.2,
            opacity: 0.95,
            layer: 'details',
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
