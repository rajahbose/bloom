import { PRNG } from './prng';
import { FoliageType, RenderedFoliage, RenderTechnique } from '../types/plant';

export interface FoliageSVGOptions {
  technique?: RenderTechnique;
  highlightColor?: string;
  shadowColor?: string;
}

/**
 * Generates realistic SVG vector paths for various botanical foliage types.
 */
export function generateBotanicalFoliagePath(
  foliage: RenderedFoliage,
  options: FoliageSVGOptions = {}
): string {
  const { x, y, size, angle, type, color, opacity } = foliage;
  const technique = options.technique || 'botanical_vector';
  const deg = (angle * 180) / Math.PI;

  switch (type) {
    case 'deciduous':
    case 'broadleaf': {
      // Realistic 5-lobe / organic serrated leaf cluster with vein structure
      const shadowColor = options.shadowColor || 'rgba(0,0,0,0.2)';
      const highlight = options.highlightColor || 'rgba(255,255,255,0.25)';

      if (technique === 'architectural_ink') {
        // Hand-drafted architectural ink cluster with internal hatch lines
        return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
          <path d="M 0 ${(-size * 1.1).toFixed(1)} C ${(size * 0.7).toFixed(1)} ${(-size * 0.9).toFixed(1)}, ${(size * 1.1).toFixed(1)} ${(-size * 0.2).toFixed(1)}, ${(size * 0.8).toFixed(1)} ${(size * 0.6).toFixed(1)} C ${(size * 0.4).toFixed(1)} ${(size * 1.0).toFixed(1)}, ${(-size * 0.4).toFixed(1)} ${(size * 1.0).toFixed(1)}, ${(-size * 0.8).toFixed(1)} ${(size * 0.6).toFixed(1)} C ${(-size * 1.1).toFixed(1)} ${(-size * 0.2).toFixed(1)}, ${(-size * 0.7).toFixed(1)} ${(-size * 0.9).toFixed(1)}, 0 ${(-size * 1.1).toFixed(1)} Z" fill="none" stroke="${color}" stroke-width="1.2" />
          <line x1="0" y1="${(-size * 0.8).toFixed(1)}" x2="0" y2="${(size * 0.7).toFixed(1)}" stroke="${color}" stroke-width="0.8" />
          <line x1="0" y1="${(-size * 0.3).toFixed(1)}" x2="${(size * 0.5).toFixed(1)}" y2="${(-size * 0.1).toFixed(1)}" stroke="${color}" stroke-width="0.6" />
          <line x1="0" y1="${(size * 0.1).toFixed(1)}" x2="${(-size * 0.5).toFixed(1)}" y2="${(size * 0.3).toFixed(1)}" stroke="${color}" stroke-width="0.6" />
        </g>`;
      }

      if (technique === 'watercolor_wash') {
        // Translucent watercolor overlapping pools
        return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" opacity="${(opacity * 0.5).toFixed(2)}">
          <path d="M 0 ${(-size * 1.2).toFixed(1)} C ${(size * 1.2).toFixed(1)} ${(-size * 0.6).toFixed(1)}, ${(size * 0.9).toFixed(1)} ${(size * 0.8).toFixed(1)}, 0 ${(size * 1.1).toFixed(1)} C ${(-size * 0.9).toFixed(1)} ${(size * 0.8).toFixed(1)}, ${(-size * 1.2).toFixed(1)} ${(-size * 0.6).toFixed(1)}, 0 ${(-size * 1.2).toFixed(1)} Z" fill="${color}" filter="blur(1px)" />
          <circle cx="0" cy="0" r="${(size * 0.7).toFixed(1)}" fill="${highlight}" />
        </g>`;
      }

      // Rich Botanical Vector with 3D depth and lobe silhouette
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <!-- Shadow Base -->
        <path d="M 0 ${(-size * 1.1).toFixed(1)} C ${(size * 0.9).toFixed(1)} ${(-size * 0.8).toFixed(1)}, ${(size * 1.2).toFixed(1)} ${(size * 0.1).toFixed(1)}, ${(size * 0.7).toFixed(1)} ${(size * 0.8).toFixed(1)} C ${(size * 0.2).toFixed(1)} ${(size * 1.1).toFixed(1)}, ${(-size * 0.6).toFixed(1)} ${(size * 0.9).toFixed(1)}, ${(-size * 0.9).toFixed(1)} ${(size * 0.4).toFixed(1)} C ${(-size * 1.2).toFixed(1)} ${(-size * 0.3).toFixed(1)}, ${(-size * 0.8).toFixed(1)} ${(-size * 0.9).toFixed(1)}, 0 ${(-size * 1.1).toFixed(1)} Z" fill="${color}" />
        <!-- Top Light Lobe Highlight -->
        <path d="M 0 ${(-size * 0.9).toFixed(1)} C ${(size * 0.5).toFixed(1)} ${(-size * 0.6).toFixed(1)}, ${(size * 0.6).toFixed(1)} 0, 0 ${(size * 0.6).toFixed(1)} C ${(-size * 0.5).toFixed(1)} 0, ${(-size * 0.5).toFixed(1)} ${(-size * 0.6).toFixed(1)}, 0 ${(-size * 0.9).toFixed(1)} Z" fill="${highlight}" opacity="0.35" />
        <!-- Center Vein -->
        <path d="M 0 ${(-size * 0.8).toFixed(1)} Q ${(size * 0.1).toFixed(1)} 0 0 ${(size * 0.8).toFixed(1)}" stroke="${shadowColor}" stroke-width="0.9" fill="none" opacity="0.6" />
      </g>`;
    }

    case 'conifer': {
      // Radiating needle fascicle bundle with branchlet sheath
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <!-- Needle 1 -->
        <line x1="0" y1="0" x2="${(-size * 1.1).toFixed(1)}" y2="${(-size * 0.9).toFixed(1)}" stroke="${color}" stroke-width="1.3" stroke-linecap="round" />
        <!-- Needle 2 -->
        <line x1="0" y1="0" x2="${(-size * 0.5).toFixed(1)}" y2="${(-size * 1.3).toFixed(1)}" stroke="${color}" stroke-width="1.3" stroke-linecap="round" />
        <!-- Needle 3 (Center) -->
        <line x1="0" y1="0" x2="0" y2="${(-size * 1.4).toFixed(1)}" stroke="${options.highlightColor || color}" stroke-width="1.4" stroke-linecap="round" />
        <!-- Needle 4 -->
        <line x1="0" y1="0" x2="${(size * 0.5).toFixed(1)}" y2="${(-size * 1.3).toFixed(1)}" stroke="${color}" stroke-width="1.3" stroke-linecap="round" />
        <!-- Needle 5 -->
        <line x1="0" y1="0" x2="${(size * 1.1).toFixed(1)}" y2="${(-size * 0.9).toFixed(1)}" stroke="${color}" stroke-width="1.3" stroke-linecap="round" />
        <!-- Base Fascicle Sheath -->
        <circle cx="0" cy="0" r="1.5" fill="#3d2612" />
      </g>`;
    }

    case 'palm': {
      // Realistic Pinnate Palm Leaflet Frond
      const frondLen = size * 2.2;
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <!-- Central Rachis Spine -->
        <path d="M 0 0 Q ${(frondLen * 0.5).toFixed(1)} ${(-frondLen * 0.2).toFixed(1)} ${frondLen.toFixed(1)} 0" stroke="${color}" stroke-width="1.5" fill="none" />
        <!-- Left Pinnate Leaflets -->
        <line x1="${(frondLen * 0.2).toFixed(1)}" y1="${(-frondLen * 0.05).toFixed(1)}" x2="${(frondLen * 0.25).toFixed(1)}" y2="${(-frondLen * 0.35).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <line x1="${(frondLen * 0.4).toFixed(1)}" y1="${(-frondLen * 0.08).toFixed(1)}" x2="${(frondLen * 0.5).toFixed(1)}" y2="${(-frondLen * 0.42).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <line x1="${(frondLen * 0.6).toFixed(1)}" y1="${(-frondLen * 0.09).toFixed(1)}" x2="${(frondLen * 0.72).toFixed(1)}" y2="${(-frondLen * 0.38).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <line x1="${(frondLen * 0.8).toFixed(1)}" y1="${(-frondLen * 0.05).toFixed(1)}" x2="${(frondLen * 0.9).toFixed(1)}" y2="${(-frondLen * 0.25).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <!-- Right Pinnate Leaflets -->
        <line x1="${(frondLen * 0.2).toFixed(1)}" y1="${(-frondLen * 0.05).toFixed(1)}" x2="${(frondLen * 0.25).toFixed(1)}" y2="${(frondLen * 0.25).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <line x1="${(frondLen * 0.4).toFixed(1)}" y1="${(-frondLen * 0.08).toFixed(1)}" x2="${(frondLen * 0.5).toFixed(1)}" y2="${(frondLen * 0.3).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
        <line x1="${(frondLen * 0.6).toFixed(1)}" y1="${(-frondLen * 0.09).toFixed(1)}" x2="${(frondLen * 0.72).toFixed(1)}" y2="${(frondLen * 0.25).toFixed(1)}" stroke="${color}" stroke-width="1.1" />
      </g>`;
    }

    case 'weeping': {
      // Flowing Weeping Tendril with Leaflet Drops
      const dropLen = size * 2.5;
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <path d="M 0 0 C ${(size * 0.4).toFixed(1)} ${(dropLen * 0.3).toFixed(1)}, ${(-size * 0.4).toFixed(1)} ${(dropLen * 0.7).toFixed(1)}, 0 ${dropLen.toFixed(1)}" stroke="${color}" stroke-width="1.3" fill="none" stroke-linecap="round" />
        <!-- Hanging Teardrop Leaflets -->
        <circle cx="${(size * 0.2).toFixed(1)}" cy="${(dropLen * 0.35).toFixed(1)}" r="${(size * 0.25).toFixed(1)}" fill="${color}" />
        <circle cx="${(-size * 0.2).toFixed(1)}" cy="${(dropLen * 0.65).toFixed(1)}" r="${(size * 0.25).toFixed(1)}" fill="${color}" />
        <circle cx="0" cy="${dropLen.toFixed(1)}" r="${(size * 0.3).toFixed(1)}" fill="${color}" />
      </g>`;
    }

    case 'blossom': {
      // 5-Petal Botanical Blossom (Sakura / Magnolia / Plum)
      const r = size * 0.8;
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <!-- 5 Petals -->
        <circle cx="0" cy="${-r.toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${color}" opacity="0.9" />
        <circle cx="${(r * 0.95).toFixed(1)}" cy="${(-r * 0.31).toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${color}" opacity="0.9" />
        <circle cx="${(r * 0.59).toFixed(1)}" cy="${(r * 0.81).toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${color}" opacity="0.9" />
        <circle cx="${(-r * 0.59).toFixed(1)}" cy="${(r * 0.81).toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${color}" opacity="0.9" />
        <circle cx="${(-r * 0.95).toFixed(1)}" cy="${(-r * 0.31).toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${color}" opacity="0.9" />
        <!-- Pistil / Stamen Center -->
        <circle cx="0" cy="0" r="${(r * 0.28).toFixed(1)}" fill="#fbbf24" />
      </g>`;
    }

    case 'architectural_circle': {
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})" opacity="${opacity.toFixed(2)}">
        <circle cx="0" cy="0" r="${size.toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.2" />
        <circle cx="0" cy="0" r="${(size * 0.45).toFixed(1)}" fill="${color}" opacity="0.4" />
        <line x1="${(-size * 0.7).toFixed(1)}" y1="0" x2="${(size * 0.7).toFixed(1)}" y2="0" stroke="${color}" stroke-width="0.8" />
        <line x1="0" y1="${(-size * 0.7).toFixed(1)}" x2="0" y2="${(size * 0.7).toFixed(1)}" stroke="${color}" stroke-width="0.8" />
      </g>`;
    }

    case 'hatch':
    default: {
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`;
    }
  }
}
