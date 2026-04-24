import { useMemo, useState } from 'react'
import { Download, Eye, FileCheck2, PencilLine } from 'lucide-react'
import { toast } from 'sonner'
import type { FeatureCollection, GeoJsonObject } from 'geojson'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
      {/* <div className="mb-2 text-lg font-semibold">GEOJSON</div> */}
      <Tabs defaultValue="viewer" className="flex min-h-0 flex-1 flex-col">
        <TooltipProvider delayDuration={150}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList className="shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="viewer"
                    className="flex h-8 w-8 items-center justify-center p-0 text-slate-600 hover:bg-white/70 hover:text-slate-900 data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-sm"
                    aria-label="Viewer"
                    title="Viewer"
                  >
                    <Eye className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Viewer</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="editor"
                    className="flex h-8 w-8 items-center justify-center p-0 text-slate-600 hover:bg-white/70 hover:text-slate-900 data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-sm"
                    aria-label="Editor"
                    title="Editor"
                  >
                    <PencilLine className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Editor</TooltipContent>
              </Tooltip>
            </TabsList>
            <div className="flex shrink-0 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Validate GeoJSON"
                    title="Validate GeoJSON"
                    onClick={() => onValidate(editorValue)}
                  >
                    <FileCheck2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Validate GeoJSON</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" aria-label="Download .geojson" title="Download .geojson" onClick={onDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download .geojson</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
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
