import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ToolsSidebar } from './ToolsSidebar'
import type { DrawMode, ToggleStyle, ToolButtonLayout } from '@/types/geojson'
import { cn } from '@/lib/utils'

interface FloatingToolsProps {
  expanded: boolean
  setExpanded: (v: boolean) => void
  activeMode: DrawMode
  onModeChange: (mode: DrawMode) => void
  onDeleteSelected: () => void
  onClearAll: () => void
  styleMode: ToggleStyle
  toolButtonLayout: ToolButtonLayout
}

export function FloatingTools({ expanded, setExpanded, styleMode, toolButtonLayout, ...props }: FloatingToolsProps) {
  const iconOnly = styleMode === 'icon-only'
  const horizontalIconTools = iconOnly && toolButtonLayout === 'horizontal'

  return (
    <div className={cn('absolute left-4 top-4 z-10', horizontalIconTools ? 'flex items-start gap-2' : 'flex flex-col items-start gap-2')}>
      {iconOnly ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="icon" aria-label="Toggle tools" onClick={() => setExpanded(!expanded)}>
                <Wrench className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Tools</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button variant="default" aria-label="Toggle tools" onClick={() => setExpanded(!expanded)}>
          <Wrench className="h-4 w-4" />
          <span className="ml-2">Tools</span>
        </Button>
      )}
      {expanded && (
        <ToolsSidebar
          {...props}
          compact={styleMode !== 'sidebar'}
          iconOnly={iconOnly}
          toolButtonLayout={toolButtonLayout}
          showLabels={styleMode === 'sidebar'}
          className={iconOnly ? 'w-fit' : 'w-64'}
        />
      )}
    </div>
  )
}
