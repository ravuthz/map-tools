import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolsSidebar } from './ToolsSidebar'
import type { DrawMode, ToggleStyle } from '@/types/geojson'

interface FloatingToolsProps {
  expanded: boolean
  setExpanded: (v: boolean) => void
  activeMode: DrawMode
  onModeChange: (mode: DrawMode) => void
  onDeleteSelected: () => void
  onClearAll: () => void
  styleMode: ToggleStyle
}

export function FloatingTools({ expanded, setExpanded, styleMode, ...props }: FloatingToolsProps) {
  return (
    <div className="absolute left-4 top-4 z-10 space-y-2">
      <Button variant="default" onClick={() => setExpanded(!expanded)}>
        <Wrench className="h-4 w-4" />
        {styleMode !== 'icon-only' && <span className="ml-2">Tools</span>}
      </Button>
      {expanded && (
        <ToolsSidebar
          {...props}
          compact={styleMode !== 'sidebar'}
          showLabels={styleMode === 'sidebar'}
          className="w-64"
        />
      )}
    </div>
  )
}
