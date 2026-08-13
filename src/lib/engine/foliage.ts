import { PRNG } from './prng';
import { FoliageType, RenderedFoliage } from '../types/plant';

export function generateFoliageForBranch(
  branchX: number,
  branchY: number,
  branchAngle: number,
  depth: number,
  maxDepth: number,
  foliageType: FoliageType,
  density: number,
  size: number,
  opacity: number,
  prng: PRNG,
  primaryColor: string,
  secondaryColor: string
): RenderedFoliage[] {
  if (foliageType === 'none' || density <= 0) return [];
  
  // Only add foliage to outer branches (depth >= maxDepth - 2)
  if (depth < Math.max(1, maxDepth - 2)) return [];

  const count = Math.floor((density / 20) * (depth === maxDepth ? 3 : 1.5));
  const foliageList: RenderedFoliage[] = [];

  for (let i = 0; i < count; i++) {
    const spreadRadius = size * (1.2 + prng.next() * 0.8);
    const offsetX = prng.jitter(spreadRadius);
    const offsetY = prng.jitter(spreadRadius);
    const itemSize = size * (0.6 + prng.next() * 0.8);
    const angle = branchAngle + prng.jitter(Math.PI / 4);
    const useSecondary = prng.next() > 0.4;
    const color = useSecondary ? secondaryColor : primaryColor;

    foliageList.push({
      id: `foliage-${depth}-${i}-${Math.floor(prng.next() * 100000)}`,
      x: branchX + offsetX,
      y: branchY + offsetY,
      size: itemSize,
      angle: angle,
      type: foliageType,
      color: color,
      opacity: Math.max(0.2, opacity * (0.8 + prng.next() * 0.4)),
    });
  }

  return foliageList;
}

export function renderFoliageSVGElement(foliage: RenderedFoliage): string {
  const { x, y, size, angle, type, color, opacity } = foliage;

  switch (type) {
    case 'conifer': {
      // Pine needle bundle
      const deg = (angle * 180) / Math.PI;
      return `<g transform="translate(${x},${y}) rotate(${deg})" opacity="${opacity}">
        <line x1="0" y1="0" x2="${-size * 0.8}" y2="${-size * 0.6}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="0" y2="${-size * 0.9}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="${size * 0.8}" y2="${-size * 0.6}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
      </g>`;
    }

    case 'deciduous': {
      // Soft organic leaf cluster
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity * 0.7}" />`;
    }

    case 'weeping': {
      // Drooping tendril leaf
      return `<path d="M ${x} ${y} Q ${x + size * 0.4} ${y + size} ${x} ${y + size * 1.8}" stroke="${color}" stroke-width="1.5" fill="none" opacity="${opacity}" stroke-linecap="round" />`;
    }

    case 'palm': {
      // Palm frond leaf blade
      const deg = (angle * 180) / Math.PI;
      return `<path transform="translate(${x},${y}) rotate(${deg})" d="M 0 0 C ${size * 0.5} ${-size * 0.5}, ${size * 1.2} ${-size * 0.2}, ${size * 1.8} 0 C ${size * 1.2} ${size * 0.2}, ${size * 0.5} ${size * 0.5}, 0 0 Z" fill="${color}" opacity="${opacity}" />`;
    }

    case 'broadleaf': {
      // Oval leaf with center line
      const deg = (angle * 180) / Math.PI;
      return `<g transform="translate(${x},${y}) rotate(${deg})" opacity="${opacity}">
        <ellipse cx="0" cy="${-size * 0.5}" rx="${size * 0.5}" ry="${size * 0.9}" fill="${color}" />
        <line x1="0" y1="0" x2="0" y2="${-size * 1.2}" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
      </g>`;
    }

    case 'architectural_circle': {
      // Architectural clean double circle
      return `<g opacity="${opacity}">
        <circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="${color}" stroke-width="1" />
        <circle cx="${x}" cy="${y}" r="${size * 0.4}" fill="${color}" />
      </g>`;
    }

    case 'hatch': {
      // CAD stipple / cross-hatch dot
      return `<circle cx="${x}" cy="${y}" r="${Math.max(1, size * 0.25)}" fill="${color}" opacity="${opacity}" />`;
    }

    default:
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity}" />`;
  }
}
