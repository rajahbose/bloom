import { PlantSymbol, PlantRenderResult } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';
import { generateFoliageForBranch } from '../foliage';

/**
 * Growth Profile 2: Excurrent Tower (e.g., Conifer, Pine, Fir, Spruce)
 * Math: Central vertical axis with recursive branch-clipping within a conical envelope.
 */
export class ExcurrentTower extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];

    const H = this.config.trunkLength * 1.3;
    const maxHalfWidth = (this.config.spireWidth || 140) / 2;
    const tierCount = Math.floor(8 + (this.config.maxDepth || 5) * 2);

    const trunkX = this.centerX;
    const baseY = this.startY;
    const topY = baseY - H;

    if (view === 'plan') {
      // Plan view: Concentric whorled tiers extending radially outward
      const tierRadiusStep = maxHalfWidth / tierCount;
      for (let t = 1; t <= tierCount; t++) {
        const r = t * tierRadiusStep;
        const branchesInTier = 6 + (t % 3) * 2;
        for (let b = 0; b < branchesInTier; b++) {
          const angle = (b / branchesInTier) * Math.PI * 2 + this.prng.jitter(0.1);
          const endX = trunkX + Math.cos(angle) * r;
          const endY = (this.canvasHeight / 2) + Math.sin(angle) * r;

          branches.push({
            id: `ex-plan-${t}-${b}`,
            x1: trunkX,
            y1: this.canvasHeight / 2,
            x2: endX,
            y2: endY,
            thickness: Math.max(1, (1 - t / tierCount) * 4),
            depth: t,
            angle,
          });

          this.updateBounds(endX, endY);

          // Add pine foliage needles
          const fol = generateFoliageForBranch(
            endX,
            endY,
            angle,
            t,
            tierCount,
            this.config.foliageType || 'conifer',
            this.config.foliageDensity,
            this.config.foliageSize,
            this.config.foliageOpacity,
            this.prng,
            this.palette.foliagePrimary,
            this.palette.foliageSecondary
          );
          foliage.push(...fol);
        }
      }
    } else {
      // Front/Side Elevation: Central monopodial trunk + Clipped conical lateral branches
      // 1. Dominant Trunk Line
      branches.push({
        id: 'main-trunk',
        x1: trunkX,
        y1: baseY,
        x2: trunkX,
        y2: topY,
        thickness: this.config.trunkThickness,
        depth: 1,
        angle: -Math.PI / 2,
      });

      this.updateBounds(trunkX, baseY);
      this.updateBounds(trunkX, topY);

      // 2. Tiered Lateral Branches clipped by Conical Envelope W(y)
      const tierStep = (H * 0.82) / tierCount;
      for (let i = 0; i < tierCount; i++) {
        const branchY = baseY - 20 - i * tierStep;
        const heightRatio = (baseY - branchY) / H; // 0 at base, 1 at top
        
        // Conical Envelope Width formula: W(y) = Wmax * (1 - heightRatio)
        const envelopeWidth = maxHalfWidth * Math.pow(1 - heightRatio, 0.85);

        // Branch tilt/droop angle
        const droopRad = ((this.config.baseAngle || 25) * Math.PI) / 180;
        const tiltOffset = Math.sin(droopRad) * (this.config.gravity < 0 ? 15 : -10);

        // Left & Right Branch Pairs
        const sides = [-1, 1];
        for (const side of sides) {
          const branchLen = envelopeWidth * (0.85 + this.prng.next() * 0.3);
          const endX = trunkX + side * branchLen;
          const endY = branchY + tiltOffset + this.prng.jitter(5);

          const branchThickness = Math.max(1, (1 - heightRatio) * (this.config.trunkThickness * 0.4));

          branches.push({
            id: `tier-${i}-${side}`,
            x1: trunkX,
            y1: branchY,
            x2: endX,
            y2: endY,
            thickness: branchThickness,
            depth: 2,
            angle: Math.atan2(endY - branchY, endX - trunkX),
          });

          this.updateBounds(endX, endY);

          // Sub-branchlets along main lateral branch
          const subCount = Math.floor(2 + (1 - heightRatio) * 3);
          for (let sub = 0; sub < subCount; sub++) {
            const subRatio = (sub + 1) / (subCount + 1);
            const subX = trunkX + side * (branchLen * subRatio);
            const subY = branchY + tiltOffset * subRatio;

            const subAngle = Math.atan2(endY - branchY, endX - trunkX) + side * (0.3 + this.prng.jitter(0.1));
            const subLen = 15 * (1 - heightRatio * 0.5);

            const subEndX = subX + Math.cos(subAngle) * subLen;
            const subEndY = subY + Math.sin(subAngle) * subLen;

            branches.push({
              id: `tier-sub-${i}-${side}-${sub}`,
              x1: subX,
              y1: subY,
              x2: subEndX,
              y2: subEndY,
              thickness: Math.max(0.8, branchThickness * 0.6),
              depth: 3,
              angle: subAngle,
            });

            // Foliage at branch tips
            const fol = generateFoliageForBranch(
              subEndX,
              subEndY,
              subAngle,
              3,
              3,
              this.config.foliageType || 'conifer',
              this.config.foliageDensity,
              this.config.foliageSize,
              this.config.foliageOpacity,
              this.prng,
              this.palette.foliagePrimary,
              this.palette.foliageSecondary
            );
            foliage.push(...fol);
          }
        }
      }
    }

    const bounds = this.getCalculatedBounds();
    const svgContent = this.buildSVGContent(branches, foliage, [], bounds, view);

    return {
      branches,
      foliage,
      customPaths: [],
      bounds,
      svgContent,
    };
  }
}
