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
import type { DrawMode, ToggleStyle, ToolButtonLayout } from '@/types/geojson'

const emptyCollection: FeatureCollection = { type: 'FeatureCollection', features: [] }
const leftSidebarBounds = { min: 200, max: 420 }
const rightSidebarBounds = { min: 360, max: 760 }

function clampWidth(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function App() {
  const [activeMode, setActiveMode] = useState<DrawMode>('select')
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(sampleGeoJson)
  const [floatingSidebar, setFloatingSidebar] = useState(true)
  const [toggleStyle, setToggleStyle] = useState<ToggleStyle>('icon-only')
  const [toolButtonLayout, setToolButtonLayout] = useState<ToolButtonLayout>('horizontal')
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [floatingExpanded, setFloatingExpanded] = useState(true)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(260)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(520)
  const drawRef = useRef<MapboxDraw | null>(null)

  function startResize(panel: 'left' | 'right', startX: number) {
    const startWidth = panel === 'left' ? leftSidebarWidth : rightSidebarWidth
    const bounds = panel === 'left' ? leftSidebarBounds : rightSidebarBounds
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function onPointerMove(event: PointerEvent) {
      const delta = event.clientX - startX
      const nextWidth = panel === 'left' ? startWidth + delta : startWidth - delta
      const clampedWidth = clampWidth(nextWidth, bounds.min, bounds.max)

      if (panel === 'left') {
        setLeftSidebarWidth(clampedWidth)
        return
      }

      setRightSidebarWidth(clampedWidth)
    }

    function onPointerUp() {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  function nudgeWidth(panel: 'left' | 'right', delta: number) {
    if (panel === 'left') {
      setLeftSidebarWidth((width) => clampWidth(width + delta, leftSidebarBounds.min, leftSidebarBounds.max))
      return
    }

    setRightSidebarWidth((width) => clampWidth(width + delta, rightSidebarBounds.min, rightSidebarBounds.max))
  }

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
      <div
        className="grid h-[calc(100vh-116px)] gap-4"
        style={{
          gridTemplateColumns: floatingSidebar
            ? `minmax(0, 1fr) ${rightSidebarWidth}px`
            : `${leftSidebarWidth}px minmax(0, 1fr) ${rightSidebarWidth}px`,
        }}
      >
        {!floatingSidebar && (
          <div className="relative min-w-0">
            <ToolsSidebar
              activeMode={activeMode}
              onModeChange={setActiveMode}
              onDeleteSelected={deleteSelected}
              onClearAll={clearAll}
            />
            <ResizeHandle
              label="Resize tools sidebar"
              position="right"
              onPointerDown={(clientX) => startResize('left', clientX)}
              onKeyboardResize={(delta) => nudgeWidth('left', delta)}
            />
          </div>
        )}
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
              toolButtonLayout={toolButtonLayout}
            />
          )}
        </div>
        <div className="relative min-h-0 min-w-0">
          <ResizeHandle
            label="Resize GeoJSON sidebar"
            position="left"
            onPointerDown={(clientX) => startResize('right', clientX)}
            onKeyboardResize={(delta) => nudgeWidth('right', -delta)}
          />
          <GeoJsonPanel featureCollection={featureCollection} onImport={setFeatureCollection} />
        </div>
      </div>
      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        floatingSidebar={floatingSidebar}
        setFloatingSidebar={setFloatingSidebar}
        toggleStyle={toggleStyle}
        setToggleStyle={setToggleStyle}
        toolButtonLayout={toolButtonLayout}
        setToolButtonLayout={setToolButtonLayout}
      />
    </div>
  )
}

export default App

interface ResizeHandleProps {
  label: string
  position: 'left' | 'right'
  onPointerDown: (clientX: number) => void
  onKeyboardResize: (delta: number) => void
}

function ResizeHandle({ label, position, onPointerDown, onKeyboardResize }: ResizeHandleProps) {
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onKeyboardResize(-16)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      onKeyboardResize(16)
    }
  }

  return (
    <div
      aria-label={label}
      aria-orientation="vertical"
      className={`${position === 'left' ? '-left-3' : '-right-3'} group absolute top-0 z-20 flex h-full w-6 cursor-col-resize items-center justify-center focus:outline-none`}
      role="separator"
      tabIndex={0}
      title={label}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        event.preventDefault()
        onPointerDown(event.clientX)
      }}
    >
      <div className="h-12 w-1 rounded-full bg-slate-300 opacity-70 transition group-hover:bg-blue-400 group-hover:opacity-100 group-focus:bg-blue-500 group-focus:opacity-100" />
    </div>
  )
}
