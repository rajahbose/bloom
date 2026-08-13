'use client';

import React from 'react';
import { PlantConfig } from '@/lib/types/plant';
import { PlantCanvas } from './PlantCanvas';

interface DualViewportProps {
  plantConfig: PlantConfig;
}

export const DualViewport: React.FC<DualViewportProps> = ({ plantConfig }) => {
  return (
    <div className="flex-1 h-full w-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)] overflow-hidden">
      {/* Viewport 1: Front Elevation */}
      <PlantCanvas
        plantConfig={plantConfig}
        viewMode="front"
        title="Viewport 1: Front Elevation"
      />

      {/* Viewport 2: Side View / Plan View */}
      <PlantCanvas
        plantConfig={plantConfig}
        viewMode="side"
        title="Viewport 2: Side Profile View"
      />
    </div>
  );
};
