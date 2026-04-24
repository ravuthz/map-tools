import { useRef, useState } from 'react'
import type MapboxDraw from '@mapbox/mapbox-gl-draw'
import { toast } from 'sonner'
import type { FeatureCollection } from 'geojson'
import { TopBar } from '@/components/layout/TopBar'
import { MapDraw } from '@/components/map/MapDraw'
import { ToolsSidebar } from '@/components/tools/ToolsSidebar'
import { GeoJsonPanel } from '@/components/geojson/GeoJsonPanel'
import { SettingsDrawer } from '@/components/settings/SettingsDrawer'
import { FloatingTools } from '@/components/tools/FloatingTools'
import { sampleGeoJson } from '@/lib/geojson'
import type { DrawMode, ToggleStyle } from '@/types/geojson'

const emptyCollection: FeatureCollection = { type: 'FeatureCollection', features: [] }

function App() {
  const [activeMode, setActiveMode] = useState<DrawMode>('select')
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(sampleGeoJson)
  const [floatingSidebar, setFloatingSidebar] = useState(true)
  const [toggleStyle, setToggleStyle] = useState<ToggleStyle>('icon-label')
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [floatingExpanded, setFloatingExpanded] = useState(true)
  const drawRef = useRef<MapboxDraw | null>(null)

  function deleteSelected() {
    drawRef.current?.trash()
    const next = drawRef.current?.getAll() as FeatureCollection
    setFeatureCollection(next ?? emptyCollection)
  }

  function clearAll() {
    drawRef.current?.deleteAll()
    setFeatureCollection(emptyCollection)
  }

  function loadSample() {
    drawRef.current?.deleteAll()
    sampleGeoJson.features.forEach((f) => drawRef.current?.add(f))
    setFeatureCollection(sampleGeoJson)
  }

  function importPrompt() {
    const input = prompt('Paste GeoJSON (Feature or FeatureCollection):')
    if (!input) return
    try {
      const parsed = JSON.parse(input) as FeatureCollection
      setFeatureCollection(parsed)
      drawRef.current?.deleteAll()
      parsed.features.forEach((f) => drawRef.current?.add(f))
      toast.success('Imported GeoJSON')
    } catch {
      toast.error('Invalid JSON')
    }
  }

  function exportGeoJson() {
    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], { type: 'application/geo+json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.geojson'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-4">
      <TopBar
        onUndo={() => toast.info('Undo requires history integration.')}
        onRedo={() => toast.info('Redo requires history integration.')}
        onClearAll={clearAll}
        onImport={importPrompt}
        onSample={loadSample}
        onExport={exportGeoJson}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="grid h-[calc(100vh-116px)] grid-cols-[260px_1fr_520px] gap-4">
        {!floatingSidebar && (
          <ToolsSidebar
            activeMode={activeMode}
            onModeChange={setActiveMode}
            onDeleteSelected={deleteSelected}
            onClearAll={clearAll}
          />
        )}
        {floatingSidebar && <div className="hidden" />}
        <div className="relative rounded-xl border border-border bg-white p-2 shadow-soft">
          <MapDraw mode={activeMode} featureCollection={featureCollection} onChange={setFeatureCollection} drawRef={drawRef} />
          {floatingSidebar && (
            <FloatingTools
              expanded={floatingExpanded}
              setExpanded={setFloatingExpanded}
              activeMode={activeMode}
              onModeChange={setActiveMode}
              onDeleteSelected={deleteSelected}
              onClearAll={clearAll}
              styleMode={toggleStyle}
            />
          )}
        </div>
        <GeoJsonPanel featureCollection={featureCollection} onImport={setFeatureCollection} />
      </div>
      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        floatingSidebar={floatingSidebar}
        setFloatingSidebar={setFloatingSidebar}
        toggleStyle={toggleStyle}
        setToggleStyle={setToggleStyle}
      />
    </div>
  )
}

export default App
