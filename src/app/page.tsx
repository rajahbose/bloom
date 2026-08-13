'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ParameterPanel } from '@/components/controls/ParameterPanel';
import { PlantCanvas } from '@/components/canvas/PlantCanvas';
import { DualViewport } from '@/components/canvas/DualViewport';
import { CodeViewer } from '@/components/canvas/CodeViewer';
import { ExportModal } from '@/components/export/ExportModal';
import { BASE_DEFAULT_CONFIG, PLANT_PRESETS } from '@/lib/engine/presets';
import { PlantConfig, ViewMode } from '@/lib/types/plant';

export default function Home() {
  const [plantConfig, setPlantConfig] = useState<PlantConfig>(BASE_DEFAULT_CONFIG);
  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [activeTab, setActiveTab] = useState<'chat' | 'params' | 'code'>('chat');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PLANT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPlantConfig((prev) => ({
        ...prev,
        ...found.config,
        id: found.id,
        name: found.name,
        seed: Math.floor(Math.random() * 100000),
      }));
    }
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Top Navigation Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onSelectPreset={handleSelectPreset}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Control Panel (Chat / Parameters / Script Code) */}
        <div className="w-full md:w-[420px] lg:w-[460px] h-full shrink-0 flex flex-col z-10 shadow-2xl">
          {activeTab === 'chat' && (
            <ChatPanel
              plantConfig={plantConfig}
              setPlantConfig={setPlantConfig}
              onPromptApplied={() => {}}
            />
          )}

          {activeTab === 'params' && (
            <ParameterPanel
              plantConfig={plantConfig}
              setPlantConfig={setPlantConfig}
            />
          )}

          {activeTab === 'code' && (
            <CodeViewer
              plantConfig={plantConfig}
              viewMode={viewMode === 'dual' ? 'front' : viewMode}
            />
          )}
        </div>

        {/* Right Side Main Canvas Viewport */}
        <main className="flex-1 h-full relative overflow-hidden bg-[var(--bg-primary)]">
          {viewMode === 'dual' ? (
            <DualViewport plantConfig={plantConfig} />
          ) : (
            <PlantCanvas
              plantConfig={plantConfig}
              viewMode={viewMode}
            />
          )}
        </main>
      </div>

      {/* CAD Export Pipeline Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        plantConfig={plantConfig}
        viewMode={viewMode}
      />
    </div>
  );
}
