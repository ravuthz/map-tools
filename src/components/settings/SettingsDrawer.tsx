import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import type { ToggleStyle, ToolButtonLayout } from '@/types/geojson'

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  floatingSidebar: boolean
  setFloatingSidebar: (v: boolean) => void
  toggleStyle: ToggleStyle
  setToggleStyle: (v: ToggleStyle) => void
  toolButtonLayout: ToolButtonLayout
  setToolButtonLayout: (v: ToolButtonLayout) => void
}

const options: { value: ToggleStyle; title: string; desc: string }[] = [
  { value: 'icon-only', title: 'Icon Only', desc: 'Show icon only on the toggle button.' },
  { value: 'sidebar', title: 'Icon & Label (Sidebar)', desc: 'Show icon and label inside sidebar.' },
]

const toolButtonLayoutOptions: { value: ToolButtonLayout; title: string; desc: string }[] = [
  { value: 'horizontal', title: 'Horizontal', desc: 'Show icon tools beside the toggle button.' },
  { value: 'vertical', title: 'Vertical', desc: 'Stack icon tools below the toggle button.' },
]

export function SettingsDrawer(props: SettingsDrawerProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <h2 className="text-3xl font-semibold">Settings</h2>
        </SheetHeader>
        <h3 className="text-2xl font-semibold">Sidebar Display</h3>
        <p className="mb-3 text-sm text-slate-500">Choose how the tools sidebar appears.</p>
        <Separator className="mb-4" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">Floating Sidebar</div>
            <div className="text-sm text-slate-500">Show tools as a floating sidebar instead of fixed.</div>
          </div>
          <Switch checked={props.floatingSidebar} onCheckedChange={props.setFloatingSidebar} />
        </div>
        <Separator className="mb-4" />
        <div>
          <div className="font-medium">Toggle Button Style</div>
          <p className="mb-3 text-sm text-slate-500">Choose the toggle button appearance.</p>
          <RadioGroup value={props.toggleStyle} onValueChange={(v) => props.setToggleStyle(v as ToggleStyle)} className="space-y-3">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-start gap-2">
                <RadioGroupItem value={opt.value} />
                <div>
                  <div>{opt.title}</div>
                  <div className="text-sm text-slate-500">{opt.desc}</div>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
        {props.toggleStyle === 'icon-only' && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="font-medium">Tool Button Layout</div>
              <p className="mb-3 text-sm text-slate-500">Choose the Icon Only floating tools direction.</p>
              <RadioGroup value={props.toolButtonLayout} onValueChange={(v) => props.setToolButtonLayout(v as ToolButtonLayout)} className="space-y-3">
                {toolButtonLayoutOptions.map((opt) => (
                  <label key={opt.value} className="flex items-start gap-2">
                    <RadioGroupItem value={opt.value} />
                    <div>
                      <div>{opt.title}</div>
                      <div className="text-sm text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
