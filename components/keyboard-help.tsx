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
    { keys: ['Shift', '↑↓'], description: 'Navigate between Qty and Price fields' },
    { keys: ['F9'], description: 'Checkout (process payment)' },
    { keys: ['Esc'], description: 'Clear cart / Close dialog' },
    { keys: ['Ctrl', '/'], description: 'Search products' },
    { keys: ['Alt', '1'], description: 'Go to POS' },
    { keys: ['Alt', '2'], description: 'Go to Admin' },
    { keys: ['Alt', '3'], description: 'Go to Inventory' },
    { keys: ['Alt', '4'], description: 'View bill history' },
    { keys: ['Alt', '5'], description: 'Logout' },
    { keys: ['Alt', 'H'], description: 'Show this help' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-gray-600">
            Quick keyboard shortcuts for POS system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
            >
              <span className="text-gray-900 font-medium">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <Kbd>{key}</Kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-gray-500">+</span>
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
