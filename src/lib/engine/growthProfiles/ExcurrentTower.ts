import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';

/**
 * Growth Profile 2: Excurrent Tower (Engine 2.0)
 * Monopodial conifer axis with organic root buttresses, bark fissures, tiered boughs, and needle fascicles.
 */
export class ExcurrentTower extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];
    const customPaths: CustomPathEntity[] = [];

    const H = this.config.trunkLength * 1.35;
    const maxHalfWidth = (this.config.spireWidth || 150) / 2;
    const tierCount = Math.floor(9 + (this.config.maxDepth || 5) * 2);
    const trunkThick = this.config.trunkThickness || 18;

    const trunkX = this.centerX;
    const baseY = view === 'plan' ? this.canvasHeight / 2 : this.startY;
    const topY = baseY - H;

    if (view === 'plan') {
      // Top-Down Conifer Plan View with Concentric Needle Whorls
      const tierRadiusStep = maxHalfWidth / tierCount;
      for (let t = 1; t <= tierCount; t++) {
        const r = t * tierRadiusStep;
        const branchesInTier = 7 + (t % 3) * 2;
        for (let b = 0; b < branchesInTier; b++) {
          const angle = (b / branchesInTier) * Math.PI * 2 + this.prng.jitter(0.08);
          const endX = trunkX + Math.cos(angle) * r;
          const endY = baseY + Math.sin(angle) * r;

          branches.push({
            id: `ex-plan-${t}-${b}`,
            x1: trunkX,
            y1: baseY,
            x2: endX,
            y2: endY,
            thickness: Math.max(1, (1 - t / tierCount) * 4),
            depth: t,
            angle,
          });

          this.updateBounds(endX, endY);

          foliage.push({
            id: `ex-plan-fol-${t}-${b}`,
            x: endX,
            y: endY,
            size: this.config.foliageSize * (0.8 + this.prng.next() * 0.5),
            angle,
            type: 'conifer',
            color: this.prng.next() > 0.4 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            opacity: this.config.foliageOpacity || 0.9,
          });
        }
      }

      customPaths.push({
        id: 'plan-center-core',
        pathData: `M ${trunkX - 8} ${baseY} L ${trunkX + 8} ${baseY} M ${trunkX} ${baseY - 8} L ${trunkX} ${baseY + 8}`,
        stroke: this.palette.outline,
        strokeWidth: 1.5,
        layer: 'details',
      });
    } else {
      // Front & Side Elevation: Monopodial Trunk + Root Flare + Whorled Tier Boughs
      
      // 1. Root Flare & Bark Textures
      const rootFlares = this.generateRootFlares(trunkX, baseY, trunkThick);
      const barkFissures = this.generateBarkFissures(trunkX, baseY, H * 0.7, trunkThick);
      customPaths.push(...rootFlares, ...barkFissures);

      // 2. Central Tapered Trunk Line
      branches.push({
        id: 'ex-main-trunk',
        x1: trunkX,
        y1: baseY,
        x2: trunkX,
        y2: topY,
        thickness: trunkThick,
        depth: 1,
        angle: -Math.PI / 2,
      });

      this.updateBounds(trunkX, baseY);
      this.updateBounds(trunkX, topY);

      // 3. Conical Envelope Bough Generations
      const tierStep = (H * 0.84) / tierCount;
      for (let i = 0; i < tierCount; i++) {
        const branchY = baseY - 22 - i * tierStep;
        const heightRatio = (baseY - branchY) / H;
        const envelopeWidth = maxHalfWidth * Math.pow(1 - heightRatio, 0.82);

        const droopRad = ((this.config.baseAngle || 28) * Math.PI) / 180;
        const droopAmount = Math.sin(droopRad) * (this.config.gravity < 0 ? 18 : -8);

        for (const side of [-1, 1]) {
          const branchLen = envelopeWidth * (0.86 + this.prng.next() * 0.28);
          const endX = trunkX + side * branchLen;
          const endY = branchY + droopAmount + this.prng.jitter(4);

          const branchThickness = Math.max(1.0, (1 - heightRatio) * (trunkThick * 0.45));

          // Curved Bough Control Point (Natural downward bow)
          const midX = (trunkX + endX) / 2;
          const midY = (branchY + endY) / 2 + (side * 4 + 6);

          branches.push({
            id: `ex-tier-${i}-${side}`,
            x1: trunkX,
            y1: branchY,
            x2: endX,
            y2: endY,
            cpX: midX,
            cpY: midY,
            thickness: branchThickness,
            depth: 2,
            angle: Math.atan2(endY - branchY, endX - trunkX),
          });

          this.updateBounds(endX, endY);

          // Sub-branchlet needle nodes along the bough
          const subCount = Math.floor(2 + (1 - heightRatio) * 3);
          for (let sub = 0; sub < subCount; sub++) {
            const subRatio = (sub + 1) / (subCount + 1);
            const subX = trunkX + side * (branchLen * subRatio);
            const subY = branchY + droopAmount * subRatio;

            const subAngle = Math.atan2(endY - branchY, endX - trunkX) + side * (0.35 + this.prng.jitter(0.1));
            const subLen = 18 * (1 - heightRatio * 0.45);

            const subEndX = subX + Math.cos(subAngle) * subLen;
            const subEndY = subY + Math.sin(subAngle) * subLen;

            branches.push({
              id: `ex-sub-${i}-${side}-${sub}`,
              x1: subX,
              y1: subY,
              x2: subEndX,
              y2: subEndY,
              thickness: Math.max(0.8, branchThickness * 0.6),
              depth: 3,
              angle: subAngle,
            });

            // Needle Fascicle Clusters
            foliage.push({
              id: `ex-fol-${i}-${side}-${sub}`,
              x: subEndX,
              y: subEndY,
              size: this.config.foliageSize * (0.8 + this.prng.next() * 0.4),
              angle: subAngle,
              type: 'conifer',
              color: this.prng.next() > 0.4 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
              opacity: this.config.foliageOpacity || 0.9,
            });
          }
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
