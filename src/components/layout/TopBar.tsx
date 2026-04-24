import { Download, FileUp, RotateCcw, RotateCw, Settings2, Trash2, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onUndo: () => void
  onRedo: () => void
  onClearAll: () => void
  onImport: () => void
  onSample: () => void
  onExport: () => void
  onOpenSettings: () => void
}

export function TopBar(props: TopBarProps) {
  return (
    <header className="mb-4 flex items-center justify-between rounded-xl border border-border bg-white px-5 py-3 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">🗺️</div>
        <div>
          <h1 className="text-3xl font-semibold">Map Draw</h1>
          <p className="text-sm text-slate-500">Draw and edit GeoJSON (SRID 4326)</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={props.onUndo}><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={props.onRedo}><RotateCw className="h-4 w-4" /></Button>
        <Button variant="destructive" onClick={props.onClearAll}><Trash2 className="mr-2 h-4 w-4" />Clear All</Button>
        <Button variant="outline" onClick={props.onExport}><Download className="mr-2 h-4 w-4" />Export</Button>
        <Button variant="outline" onClick={props.onImport}><FileUp className="mr-2 h-4 w-4" />Import</Button>
        <Button variant="outline" onClick={props.onSample}><FileCode2 className="mr-2 h-4 w-4" />Sample</Button>
        <Button variant="outline" size="icon" onClick={props.onOpenSettings}><Settings2 className="h-4 w-4" /></Button>
      </div>
    </header>
  )
}
