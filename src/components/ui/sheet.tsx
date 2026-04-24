import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger

export function SheetContent({ className, children, ...props }: Dialog.DialogContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/20" />
      <Dialog.Content className={cn('fixed right-0 top-0 h-full w-[320px] border-l border-border bg-white p-6', className)} {...props}>
        {children}
        <Dialog.Close className="absolute right-4 top-4 rounded p-1 hover:bg-muted">
          <X className="h-4 w-4" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-5', className)} {...props} />
)
