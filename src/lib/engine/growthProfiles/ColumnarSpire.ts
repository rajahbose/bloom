import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';

/**
 * Growth Profile 4: Columnar Spire (Engine 2.0)
 * Realistic Italian Cypress / Poplar spire with capsule contour envelope and dense vertical foliage layering.
 */
export class ColumnarSpire extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];
    const customPaths: CustomPathEntity[] = [];

    const H = this.config.trunkLength * 1.45;
    const maxCapsuleWidth = (this.config.spireWidth || 65) / 2;
    const elevationAngleRad = ((this.config.spireBranchAngle || 80) * Math.PI) / 180;
    const nodeCount = Math.floor(22 + (this.config.maxDepth || 5) * 4);
    const trunkThick = this.config.trunkThickness || 14;

    const trunkX = this.centerX;
    const baseY = view === 'plan' ? this.canvasHeight / 2 : this.startY;
    const topY = baseY - H;

    if (view === 'plan') {
      // Top-Down Compact Columnar Plan View with Layered Foliage Rings
      const planRad = maxCapsuleWidth * 0.95;
      const ringCount = 6;
      for (let r = 1; r <= ringCount; r++) {
        const rad = (r / ringCount) * planRad;
        const count = r * 7;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + this.prng.jitter(0.08);
          const endX = trunkX + Math.cos(angle) * rad;
          const endY = baseY + Math.sin(angle) * rad;

          branches.push({
            id: `spire-plan-${r}-${i}`,
            x1: trunkX,
            y1: baseY,
            x2: endX,
            y2: endY,
            thickness: 1.2,
            depth: r,
            angle,
          });

          this.updateBounds(endX, endY);

          foliage.push({
            id: `spire-plan-fol-${r}-${i}`,
            x: endX,
            y: endY,
            size: this.config.foliageSize * 0.7,
            angle,
            type: 'conifer',
            color: this.prng.next() > 0.45 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            opacity: 0.9,
          });
        }
      }

      customPaths.push({
        id: 'plan-center-spire',
        pathData: `M ${trunkX - 6} ${baseY} L ${trunkX + 6} ${baseY} M ${trunkX} ${baseY - 6} L ${trunkX} ${baseY + 6}`,
        stroke: this.palette.outline,
        strokeWidth: 1.2,
        layer: 'details',
      });
    } else {
      // Front & Side Elevation: Central Trunk + Dense Interlocking Steep Boughs within Capsule Envelope
      
      // 1. Root Buttress Flares & Bark
      const rootFlares = this.generateRootFlares(trunkX, baseY, trunkThick * 0.8);
      const barkFissures = this.generateBarkFissures(trunkX, baseY, 40, trunkThick * 0.8);
      customPaths.push(...rootFlares, ...barkFissures);

      // 2. Central Spire Trunk Axis
      branches.push({
        id: 'spire-trunk',
        x1: trunkX,
        y1: baseY,
        x2: trunkX,
        y2: topY,
        thickness: trunkThick * 0.75,
        depth: 1,
        angle: -Math.PI / 2,
      });

      this.updateBounds(trunkX, baseY);
      this.updateBounds(trunkX, topY);

      // 3. Steep Lateral Boughs within Capsule Envelope
      const nodeStep = (H * 0.88) / nodeCount;
      const midY = baseY - H / 2;

      for (let i = 0; i < nodeCount; i++) {
        const nodeY = baseY - 18 - i * nodeStep;
        
        // Elliptical / Capsule Envelope Formula
        const normalizedY = (nodeY - midY) / (H / 2);
        const capsuleFactor = Math.sqrt(Math.max(0.04, 1 - Math.pow(normalizedY, 2)));
        const allowedWidth = maxCapsuleWidth * capsuleFactor;

        for (const side of [-1, 1]) {
          const branchLen = allowedWidth * (0.84 + this.prng.next() * 0.32);
          const angle = -Math.PI / 2 + side * (Math.PI / 2 - elevationAngleRad);
          const endX = trunkX + side * Math.cos(angle) * branchLen;
          const endY = nodeY + Math.sin(angle) * branchLen;

          const cpX = (trunkX + endX) / 2 + side * 2;
          const cpY = (nodeY + endY) / 2 - 3;

          branches.push({
            id: `spire-node-${i}-${side}`,
            x1: trunkX,
            y1: nodeY,
            x2: endX,
            y2: endY,
            cpX,
            cpY,
            thickness: Math.max(0.8, (1 - i / nodeCount) * 3.5),
            depth: 2,
            angle,
          });

          this.updateBounds(endX, endY);

          // Dense foliage clusters along the spire outer silhouette
          foliage.push({
            id: `spire-fol-${i}-${side}`,
            x: endX + side * 2,
            y: endY - 6,
            size: this.config.foliageSize * (0.7 + this.prng.next() * 0.4),
            angle,
            type: 'conifer',
            color: this.prng.next() > 0.4 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            opacity: this.config.foliageOpacity || 0.9,
          });
        }
      }
    }

    const bounds = this.getCalculatedBounds();
    const svgContent = this.buildSVGContent(branches, foliage, customPaths, bounds, view);

    return {
      branches,
      foliage,
      customPaths,
      bounds,
      svgContent,
    };
  }
}
