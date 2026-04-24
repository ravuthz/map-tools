import type { ToggleStyle } from '@/types/geojson'

export function SidebarPreview({ styleMode }: { styleMode: ToggleStyle }) {
  return (
    <div className="rounded-lg border border-border bg-sky-50 p-3">
      <div className="text-xs font-medium text-slate-600">Preview</div>
      <div className="mt-3 flex items-start gap-2">
        <div className="rounded-lg border border-blue-500 bg-white p-2 text-xs font-medium text-primary">
          {styleMode === 'icon-only' ? '⚙️' : '⚙️ Tools'}
        </div>
        {styleMode === 'sidebar' && <div className="rounded-lg border bg-white p-2 text-xs">Select/Edit<br/>Point<br/>LineString</div>}
      </div>
    </div>
  )
}
