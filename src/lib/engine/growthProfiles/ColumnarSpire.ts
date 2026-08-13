import { PlantSymbol, PlantRenderResult } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';
import { generateFoliageForBranch } from '../foliage';

/**
 * Growth Profile 4: Columnar Spire (e.g., Lombardy Poplar, Italian Cypress, Columnar Juniper)
 * Math: Compressed vertical logic with short, high-angle lateral vectors tightly constrained in a narrow capsule shape.
 */
export class ColumnarSpire extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];

    const H = this.config.trunkLength * 1.4;
    const maxCapsuleWidth = (this.config.spireWidth || 60) / 2;
    const elevationAngleRad = ((this.config.spireBranchAngle || 78) * Math.PI) / 180;
    const nodeCount = Math.floor(18 + (this.config.maxDepth || 5) * 4);

    const trunkX = this.centerX;
    const baseY = this.startY;
    const topY = baseY - H;

    if (view === 'plan') {
      // Top-down compact columnar circle plan view
      const planRad = maxCapsuleWidth * 0.9;
      const ringCount = 5;
      for (let r = 1; r <= ringCount; r++) {
        const rad = (r / ringCount) * planRad;
        const count = r * 6;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + this.prng.jitter(0.1);
          const endX = trunkX + Math.cos(angle) * rad;
          const endY = (this.canvasHeight / 2) + Math.sin(angle) * rad;

          branches.push({
            id: `spire-plan-${r}-${i}`,
            x1: trunkX,
            y1: this.canvasHeight / 2,
            x2: endX,
            y2: endY,
            thickness: 1.5,
            depth: r,
            angle,
          });

          this.updateBounds(endX, endY);

          const fol = generateFoliageForBranch(
            endX,
            endY,
            angle,
            r,
            ringCount,
            this.config.foliageType || 'conifer',
            this.config.foliageDensity,
            this.config.foliageSize * 0.7,
            this.config.foliageOpacity,
            this.prng,
            this.palette.foliagePrimary,
            this.palette.foliageSecondary
          );
          foliage.push(...fol);
        }
      }
    } else {
      // Front & Side Elevation: Central trunk + Capsule-constrained steep branches
      // 1. Central Spire Trunk Axis
      branches.push({
        id: 'spire-trunk',
        x1: trunkX,
        y1: baseY,
        x2: trunkX,
        y2: topY,
        thickness: this.config.trunkThickness * 0.7,
        depth: 1,
        angle: -Math.PI / 2,
      });

      this.updateBounds(trunkX, baseY);
      this.updateBounds(trunkX, topY);

      // 2. High-Steepness Lateral Vectors constrained in Capsule Envelope
      const nodeStep = (H * 0.85) / nodeCount;
      const midY = baseY - H / 2;

      for (let i = 0; i < nodeCount; i++) {
        const nodeY = baseY - 15 - i * nodeStep;
        
        // Capsule width envelope math: W(y) = Wmax * sqrt(1 - 4((y - ymid)/H)^2)
        const normalizedY = (nodeY - midY) / (H / 2);
        const capsuleFactor = Math.sqrt(Math.max(0.05, 1 - Math.pow(normalizedY, 2)));
        const allowedWidth = maxCapsuleWidth * capsuleFactor;

        // Pair of steep left and right branches
        for (const side of [-1, 1]) {
          const branchLen = allowedWidth * (0.8 + this.prng.next() * 0.35);
          
          // Steep upward vector (elevationAngleRad pointing almost vertical)
          const angle = -Math.PI / 2 + side * (Math.PI / 2 - elevationAngleRad);
          const endX = trunkX + side * Math.cos(angle) * branchLen;
          const endY = nodeY + Math.sin(angle) * branchLen;

          branches.push({
            id: `spire-node-${i}-${side}`,
            x1: trunkX,
            y1: nodeY,
            x2: endX,
            y2: endY,
            thickness: Math.max(0.8, (1 - i / nodeCount) * 4),
            depth: 2,
            angle,
          });

          this.updateBounds(endX, endY);

          // Sub-vector branchlets
          const subEndX = endX + side * 5;
          const subEndY = endY - 12;

          branches.push({
            id: `spire-sub-${i}-${side}`,
            x1: endX,
            y1: endY,
            x2: subEndX,
            y2: subEndY,
            thickness: 0.8,
            depth: 3,
            angle,
          });

          // Foliage stippling along spire boundary
          const fol = generateFoliageForBranch(
            subEndX,
            subEndY,
            angle,
            3,
            3,
            this.config.foliageType || 'conifer',
            this.config.foliageDensity,
            this.config.foliageSize * 0.75,
            this.config.foliageOpacity,
            this.prng,
            this.palette.foliagePrimary,
            this.palette.foliageSecondary
          );
          foliage.push(...fol);
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
