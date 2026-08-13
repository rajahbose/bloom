import { PlantSymbol, PlantRenderResult } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';
import { generateFoliageForBranch } from '../foliage';

/**
 * Growth Profile 3: Decurrent Canopy (e.g., Maple, Oak, Birch, Elm)
 * Math: Branching L-system / recursive function splitting primary limbs into spreading branches with terminal foliage clusters.
 */
export class DecurrentCanopy extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];

    const angleSpreadRad = ((this.config.baseAngle || 35) * Math.PI) / 180;
    const maxDepth = Math.min(7, Math.max(1, this.config.maxDepth || 5));

    if (view === 'plan') {
      // Top-down broadleaf canopy plan view
      const planRadius = this.config.trunkLength * 1.3;
      const mainRadials = 8;
      for (let r = 0; r < mainRadials; r++) {
        const angle = (r / mainRadials) * Math.PI * 2 + this.prng.jitter(0.2);
        const len = planRadius * (0.6 + this.prng.next() * 0.4);
        const endX = this.centerX + Math.cos(angle) * len;
        const endY = (this.canvasHeight / 2) + Math.sin(angle) * len;

        branches.push({
          id: `dec-plan-${r}`,
          x1: this.centerX,
          y1: this.canvasHeight / 2,
          x2: endX,
          y2: endY,
          thickness: this.config.trunkThickness * 0.4,
          depth: 1,
          angle,
        });

        this.updateBounds(endX, endY);

        // Foliage canopy clusters in plan view
        const fol = generateFoliageForBranch(
          endX,
          endY,
          angle,
          maxDepth,
          maxDepth,
          this.config.foliageType || 'deciduous',
          this.config.foliageDensity,
          this.config.foliageSize * 1.2,
          this.config.foliageOpacity,
          this.prng,
          this.palette.foliagePrimary,
          this.palette.foliageSecondary
        );
        foliage.push(...fol);
      }
    } else {
      // Front & Side Elevation: Sympodial Recursive Spreading Branching
      const buildBranch = (
        x: number,
        y: number,
        currentAngle: number,
        length: number,
        thickness: number,
        depth: number
      ) => {
        if (depth > maxDepth || length < 4 || thickness < 0.5) return;

        const sideFactor = view === 'side' ? (depth % 2 === 0 ? 0.75 : 1.15) : 1.0;

        // Apply gravity bending
        let adjustedAngle = currentAngle;
        if (depth > 1) {
          const targetGravityAngle = this.config.gravity < 0 ? Math.PI / 2 : -Math.PI / 2;
          const gravityStrength = Math.abs(this.config.gravity) * 0.14 * (depth / maxDepth);
          adjustedAngle += (targetGravityAngle - adjustedAngle) * gravityStrength;
        }

        const angleJitterVal = this.prng.jitter(angleSpreadRad * (this.config.angleJitter || 0.4) * 0.4);
        const finalAngle = adjustedAngle + angleJitterVal;

        const endX = x + Math.cos(finalAngle) * length * sideFactor;
        const endY = y + Math.sin(finalAngle) * length;

        this.updateBounds(x, y);
        this.updateBounds(endX, endY);

        branches.push({
          id: `dec-b-${depth}-${branches.length}`,
          x1: x,
          y1: y,
          x2: endX,
          y2: endY,
          thickness,
          depth,
          angle: finalAngle,
        });

        // Terminal foliage cluster generation
        const generatedFoliage = generateFoliageForBranch(
          endX,
          endY,
          finalAngle,
          depth,
          maxDepth,
          this.config.foliageType || 'deciduous',
          this.config.foliageDensity,
          this.config.foliageSize,
          this.config.foliageOpacity,
          this.prng,
          this.palette.foliagePrimary,
          this.palette.foliageSecondary
        );
        foliage.push(...generatedFoliage);

        // Split into child branches
        const numBranches = depth === 1 ? (this.config.splitsPerNode || 2) : (this.prng.next() > 0.35 ? (this.config.splitsPerNode || 2) : 2);
        const nextLength = length * (this.config.lengthRatio || 0.72) * (0.85 + this.prng.next() * 0.3);
        const nextThickness = Math.max(0.8, thickness * (this.config.taperRatio || 0.75));

        const startSplitAngle = finalAngle - angleSpreadRad / 2;
        const stepAngle = numBranches > 1 ? angleSpreadRad / (numBranches - 1) : 0;

        for (let i = 0; i < numBranches; i++) {
          const childAngle = numBranches === 1 ? finalAngle : startSplitAngle + stepAngle * i;
          buildBranch(endX, endY, childAngle, nextLength, nextThickness, depth + 1);
        }
      };

      // Initial Trunk (pointing straight up: -Math.PI / 2)
      buildBranch(
        this.centerX,
        this.startY,
        -Math.PI / 2,
        this.config.trunkLength,
        this.config.trunkThickness,
        1
      );
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
