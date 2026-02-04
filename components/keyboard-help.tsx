'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'

interface KeyboardHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardHelp({ open, onOpenChange }: KeyboardHelpProps) {
  const shortcuts = [
    { keys: ['ID', '+', 'Enter'], description: 'Type Product ID and press Enter to add' },
    { keys: ['+'], description: 'Increase quantity of last cart item' },
    { keys: ['-'], description: 'Decrease quantity of last cart item' },
    { keys: ['Delete'], description: 'Remove last item from cart' },
    { keys: ['Click Price'], description: 'Click on price in cart to edit' },
    { keys: ['F9'], description: 'Checkout (process payment)' },
    { keys: ['Ctrl', 'H'], description: 'View bill history' },
    { keys: ['Ctrl', 'I'], description: 'Go to inventory' },
    { keys: ['Ctrl', 'L'], description: 'Logout' },
    { keys: ['Ctrl', '?'], description: 'Show this help' },
    { keys: ['Esc'], description: 'Close dialog/Cancel price edit' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick keyboard shortcuts for POS system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-foreground">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <Kbd>{key}</Kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
