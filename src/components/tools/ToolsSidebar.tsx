import { MousePointer2, CircleDot, Slash, Pentagon, RectangleHorizontal, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { DrawMode, ToggleStyle, ToolButtonLayout } from '@/types/geojson'
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
  iconOnly?: boolean
  toolButtonLayout?: ToolButtonLayout
  showLabels?: boolean
  toggleStyle?: ToggleStyle
}

export function ToolsSidebar({
  activeMode,
  onModeChange,
  onDeleteSelected,
  onClearAll,
  className,
  compact,
  iconOnly,
  toolButtonLayout = 'horizontal',
  showLabels = true,
}: ToolsSidebarProps) {
  const iconButtonGroupClass = toolButtonLayout === 'horizontal' ? 'flex items-center gap-2' : 'flex flex-col gap-2'
  const tooltipSide = toolButtonLayout === 'horizontal' ? 'bottom' : 'right'

  const toolButtons = (
    <div className={cn(iconOnly ? iconButtonGroupClass : 'space-y-2')}>
      {tools.map(({ id, label, icon: Icon }) => (
        <MaybeTooltip key={id} label={label} side={tooltipSide} enabled={iconOnly}>
          <Button
            variant="outline"
            size={iconOnly ? 'icon' : 'default'}
            aria-label={label}
            className={cn(
              iconOnly ? 'h-10 w-10 p-0' : 'w-full justify-start gap-2',
              activeMode === id && 'border-blue-300 bg-blue-50 text-primary',
              compact && !iconOnly && 'px-2',
            )}
            onClick={() => onModeChange(id)}
          >
            <Icon className="h-4 w-4" />
            {showLabels && <span>{label}</span>}
          </Button>
        </MaybeTooltip>
      ))}
    </div>
  )

  const actionButtons = (
    <div className={cn(iconOnly ? iconButtonGroupClass : 'mt-5 space-y-2')}>
      <MaybeTooltip label="Delete Selected" side={tooltipSide} enabled={iconOnly}>
        <Button
          variant="destructive"
          size={iconOnly ? 'icon' : 'default'}
          aria-label="Delete selected"
          className={cn(iconOnly ? 'h-10 w-10 p-0' : 'w-full justify-start')}
          onClick={onDeleteSelected}
        >
          <Trash2 className={cn('h-4 w-4', showLabels && 'mr-2')} />
          {showLabels && 'Delete Selected'}
        </Button>
      </MaybeTooltip>
      <MaybeTooltip label="Clear All" side={tooltipSide} enabled={iconOnly}>
        <Button
          variant="destructive"
          size={iconOnly ? 'icon' : 'default'}
          aria-label="Clear all"
          className={cn(iconOnly ? 'h-10 w-10 p-0' : 'w-full justify-start')}
          onClick={onClearAll}
        >
          <Trash2 className={cn('h-4 w-4', showLabels && 'mr-2')} />
          {showLabels && 'Clear All'}
        </Button>
      </MaybeTooltip>
    </div>
  )

  return (
    <Card className={cn(iconOnly ? 'border-0 bg-transparent p-0 shadow-none' : 'p-4', className)}>
      {!iconOnly && !compact && <h3 className="mb-3 text-sm font-semibold uppercase text-slate-700">Tools</h3>}
      {iconOnly ? (
        <TooltipProvider delayDuration={150}>
          <div className={cn(toolButtonLayout === 'horizontal' ? 'flex items-center gap-2' : 'flex flex-col gap-2')}>
            {toolButtons}
            {actionButtons}
          </div>
        </TooltipProvider>
      ) : (
        <>
          {toolButtons}
          {actionButtons}
        </>
      )}
      {!compact && <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-600">Tip: Click a tool, then draw on map. Double-click to finish shapes.</div>}
    </Card>
  )
}

interface MaybeTooltipProps {
  label: string
  side: 'bottom' | 'right'
  enabled?: boolean
  children: React.ReactElement
}

function MaybeTooltip({ label, side, enabled, children }: MaybeTooltipProps) {
  if (!enabled) return children

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}
