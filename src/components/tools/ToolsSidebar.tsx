import { MousePointer2, CircleDot, Slash, Pentagon, RectangleHorizontal, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DrawMode, ToggleStyle } from '@/types/geojson'
import { cn } from '@/lib/utils'

const tools = [
  { id: 'select', label: 'Select / Edit', icon: MousePointer2 },
  { id: 'point', label: 'Point', icon: CircleDot },
  { id: 'line_string', label: 'LineString', icon: Slash },
  { id: 'polygon', label: 'Polygon', icon: Pentagon },
  { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal },
] as const

interface ToolsSidebarProps {
  activeMode: DrawMode
  onModeChange: (mode: DrawMode) => void
  onDeleteSelected: () => void
  onClearAll: () => void
  className?: string
  compact?: boolean
  showLabels?: boolean
  toggleStyle?: ToggleStyle
}

export function ToolsSidebar({ activeMode, onModeChange, onDeleteSelected, onClearAll, className, compact, showLabels = true }: ToolsSidebarProps) {
  return (
    <Card className={cn('p-4', className)}>
      <h3 className="mb-3 text-sm font-semibold uppercase text-slate-700">Tools</h3>
      <div className="space-y-2">
        {tools.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="outline"
            className={cn('w-full justify-start gap-2', activeMode === id && 'border-blue-300 bg-blue-50 text-primary', compact && 'px-2')}
            onClick={() => onModeChange(id)}
          >
            <Icon className="h-4 w-4" />
            {showLabels && <span>{label}</span>}
          </Button>
        ))}
      </div>
      <div className="mt-5 space-y-2">
        <Button variant="destructive" className="w-full justify-start" onClick={onDeleteSelected}><Trash2 className="mr-2 h-4 w-4" />{showLabels ? 'Delete Selected' : ''}</Button>
        <Button variant="destructive" className="w-full justify-start" onClick={onClearAll}><Trash2 className="mr-2 h-4 w-4" />{showLabels ? 'Clear All' : ''}</Button>
      </div>
      {!compact && <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-600">Tip: Click a tool, then draw on map. Double-click to finish shapes.</div>}
    </Card>
  )
}
