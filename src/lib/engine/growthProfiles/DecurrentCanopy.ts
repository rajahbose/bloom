import { PlantSymbol, PlantRenderResult, CustomPathEntity } from './PlantSymbol';
import { RenderedBranch, RenderedFoliage } from '../../types/plant';

/**
 * Growth Profile 3: Decurrent Canopy (Engine 2.0)
 * Realistic sympodial organic branching with root flare, bark fissures, and multi-depth foliage.
 */
export class DecurrentCanopy extends PlantSymbol {
  generateGeometry(view: 'front' | 'side' | 'plan' = 'front'): PlantRenderResult {
    const branches: RenderedBranch[] = [];
    const foliage: RenderedFoliage[] = [];
    const customPaths: CustomPathEntity[] = [];

    const angleSpreadRad = ((this.config.baseAngle || 38) * Math.PI) / 180;
    const maxDepth = Math.min(7, Math.max(1, this.config.maxDepth || 5));
    const trunkLen = this.config.trunkLength || 130;
    const trunkThick = this.config.trunkThickness || 18;
    const windDrift = this.config.windDrift || 0;
    const asymmetry = this.config.asymmetry !== undefined ? this.config.asymmetry : 0.3;

    const rootX = this.centerX;
    const rootY = view === 'plan' ? this.canvasHeight / 2 : this.startY;

    if (view === 'plan') {
      // Architectural Masterplan Top-Down Plan View with Layered Canopy Rings
      const planRadius = trunkLen * 1.35;
      const mainRadials = 10;

      // 1. Trunk center core
      this.updateBounds(rootX - planRadius, rootY - planRadius);
      this.updateBounds(rootX + planRadius, rootY + planRadius);

      // 2. Structural radial branches in plan view
      for (let r = 0; r < mainRadials; r++) {
        const angle = (r / mainRadials) * Math.PI * 2 + this.prng.jitter(0.2);
        const len = planRadius * (0.65 + this.prng.next() * 0.4);
        const endX = rootX + Math.cos(angle) * len;
        const endY = rootY + Math.sin(angle) * len;

        const cpDist = len * 0.5;
        const cpAngle = angle + this.prng.jitter(0.25);
        const cpX = rootX + Math.cos(cpAngle) * cpDist;
        const cpY = rootY + Math.sin(cpAngle) * cpDist;

        branches.push({
          id: `dec-plan-b-${r}`,
          x1: rootX,
          y1: rootY,
          x2: endX,
          y2: endY,
          cpX,
          cpY,
          thickness: Math.max(1.5, trunkThick * 0.35),
          depth: 1,
          angle,
        });

        // Foliage canopy clusters in plan view
        const folCount = Math.floor((this.config.foliageDensity / 15) + 3);
        for (let f = 0; f < folCount; f++) {
          const folRad = len * (0.5 + this.prng.next() * 0.5);
          const folAng = angle + this.prng.jitter(0.4);
          const folX = rootX + Math.cos(folAng) * folRad;
          const folY = rootY + Math.sin(folAng) * folRad;

          foliage.push({
            id: `dec-plan-fol-${r}-${f}`,
            x: folX,
            y: folY,
            size: this.config.foliageSize * (0.8 + this.prng.next() * 0.6),
            angle: folAng,
            type: this.config.foliageType || 'deciduous',
            color: this.prng.next() > 0.4 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
            opacity: this.config.foliageOpacity || 0.85,
          });
        }
      }

      // 3. Architectural CAD Center Crosshair
      customPaths.push({
        id: 'plan-center-crosshair',
        pathData: `M ${rootX - 12} ${rootY} L ${rootX + 12} ${rootY} M ${rootX} ${rootY - 12} L ${rootX} ${rootY + 12}`,
        stroke: this.palette.outline,
        strokeWidth: 1.5,
        layer: 'details',
      });
    } else {
      // Front & Side Elevation: Organic Sympodial Curved Branching with Root Flare & Bark
      
      // 1. Generate Root Buttress Flares & Bark Fissures
      const rootFlares = this.generateRootFlares(rootX, rootY, trunkThick);
      const barkFissures = this.generateBarkFissures(rootX, rootY, trunkLen, trunkThick);
      customPaths.push(...rootFlares, ...barkFissures);

      // 2. Recursive Organic Branching Function with Quadratic Bezier Curves
      const buildBranch = (
        x: number,
        y: number,
        currentAngle: number,
        length: number,
        thickness: number,
        depth: number
      ) => {
        if (depth > maxDepth || length < 5 || thickness < 0.6) return;

        const sidePerspective = view === 'side' ? (depth % 2 === 0 ? 0.75 : 1.2) : 1.0;

        // Apply natural wind drift and gravity bending
        let adjustedAngle = currentAngle + (windDrift * 0.12);
        if (depth > 1) {
          const targetGravity = this.config.gravity < 0 ? Math.PI / 2 : -Math.PI / 2;
          const gravityStrength = Math.abs(this.config.gravity) * 0.15 * (depth / maxDepth);
          adjustedAngle += (targetGravity - adjustedAngle) * gravityStrength;
        }

        // Biological asymmetry & jitter
        const jitterSpread = angleSpreadRad * ((this.config.angleJitter || 0.4) + asymmetry * 0.2) * 0.4;
        const finalAngle = adjustedAngle + this.prng.jitter(jitterSpread);

        const endX = x + Math.cos(finalAngle) * length * sidePerspective;
        const endY = y + Math.sin(finalAngle) * length;

        // Organic Bezier Curve Control Point (slight organic natural bow)
        const bow = this.prng.jitter(length * 0.15);
        const midX = (x + endX) / 2 - Math.sin(finalAngle) * bow;
        const midY = (y + endY) / 2 + Math.cos(finalAngle) * bow;

        this.updateBounds(x, y);
        this.updateBounds(endX, endY);

        branches.push({
          id: `dec-b-${depth}-${branches.length}`,
          x1: x,
          y1: y,
          x2: endX,
          y2: endY,
          cpX: midX,
          cpY: midY,
          thickness,
          depth,
          angle: finalAngle,
        });

        // 3. Foliage & Flowering Blossom Generation along Branch Nodes
        if (depth >= Math.max(1, maxDepth - 2)) {
          const folCount = Math.floor((this.config.foliageDensity / 18) * (depth === maxDepth ? 3.5 : 1.8));
          for (let f = 0; f < folCount; f++) {
            const spreadRad = this.config.foliageSize * (1.2 + this.prng.next() * 0.8);
            const offsetX = this.prng.jitter(spreadRad);
            const offsetY = this.prng.jitter(spreadRad);

            foliage.push({
              id: `dec-fol-${depth}-${f}-${Math.floor(this.prng.next() * 10000)}`,
              x: endX + offsetX,
              y: endY + offsetY,
              size: this.config.foliageSize * (0.65 + this.prng.next() * 0.7),
              angle: finalAngle + this.prng.jitter(Math.PI / 4),
              type: this.config.foliageType || 'deciduous',
              color: this.prng.next() > 0.45 ? this.palette.foliagePrimary : this.palette.foliageSecondary,
              opacity: this.config.foliageOpacity || 0.85,
            });
          }

          // Optional Blossom Flowers (e.g. Cherry Blossom Sakura / Magnolia)
          if ((this.config.blossomDensity || 0) > 10 && this.prng.next() * 100 < this.config.blossomDensity) {
            foliage.push({
              id: `blossom-${depth}-${Math.floor(this.prng.next() * 10000)}`,
              x: endX + this.prng.jitter(15),
              y: endY + this.prng.jitter(15),
              size: this.config.foliageSize * 0.7,
              angle: this.prng.next() * Math.PI * 2,
              type: 'blossom',
              color: this.config.blossomColor || this.palette.accent || '#f472b6',
              opacity: 0.95,
            });
          }
        }

        // 4. Split into spreading child limbs
        const numBranches = depth === 1 ? (this.config.splitsPerNode || 2) : (this.prng.next() > 0.3 ? (this.config.splitsPerNode || 2) : 2);
        const nextLength = length * (this.config.lengthRatio || 0.73) * (0.85 + this.prng.next() * 0.3);
        const nextThickness = Math.max(0.7, thickness * (this.config.taperRatio || 0.75));

        const startSplitAngle = finalAngle - angleSpreadRad / 2;
        const stepAngle = numBranches > 1 ? angleSpreadRad / (numBranches - 1) : 0;

        for (let i = 0; i < numBranches; i++) {
          const childAngle = numBranches === 1 ? finalAngle : startSplitAngle + stepAngle * i;
          buildBranch(endX, endY, childAngle, nextLength, nextThickness, depth + 1);
        }
      };

      // Initial Trunk Base
      buildBranch(
        rootX,
        rootY,
        -Math.PI / 2,
        trunkLen,
        trunkThick,
        1
      );
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
