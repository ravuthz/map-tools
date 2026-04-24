import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { FeatureCollection, GeoJsonObject } from 'geojson'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toFormattedGeoJson, validateGeoJson } from '@/lib/geojson'

interface GeoJsonPanelProps {
  featureCollection: FeatureCollection
  onImport: (fc: FeatureCollection) => void
}

export function GeoJsonPanel({ featureCollection, onImport }: GeoJsonPanelProps) {
  const [editorValue, setEditorValue] = useState('')
  const formatted = useMemo(() => toFormattedGeoJson(featureCollection), [featureCollection])

  function onValidate(raw: string) {
    try {
      const parsed = JSON.parse(raw || formatted) as GeoJsonObject
      const result = validateGeoJson(parsed)
      if (!result.valid || !result.normalized) {
        toast.error(result.errors.join('\n'))
        return
      }
      toast.success('GeoJSON valid (EPSG:4326 lon/lat).')
      onImport(result.normalized)
    } catch {
      toast.error('JSON parse error.')
    }
  }

  function onDownload() {
    const blob = new Blob([formatted], { type: 'application/geo+json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'features.geojson'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-y-auto p-4">
      <div className="mb-2 text-lg font-semibold">GEOJSON</div>
      <Tabs defaultValue="viewer" className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList className="shrink-0">
            <TabsTrigger value="viewer">Viewer</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" onClick={() => onValidate(editorValue)}>Validate</Button>
            <Button size="sm" onClick={onDownload}>Download .geojson</Button>
          </div>
        </div>
        <TabsContent value="viewer" className="min-h-0 flex-1">
          <pre className="h-full min-h-[320px] overflow-auto rounded-md border border-border bg-slate-50 p-3 text-xs leading-6">{formatted}</pre>
        </TabsContent>
        <TabsContent value="editor" className="min-h-0 flex-1">
          <textarea
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
            placeholder="Paste Feature or FeatureCollection..."
            className="h-full min-h-[420px] w-full rounded-md border border-border p-3 font-mono text-xs"
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
