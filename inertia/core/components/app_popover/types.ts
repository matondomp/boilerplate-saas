export type PopoverPlacement = 'top' | 'bottom' | 'right' | 'left'

export type PopoverProps = {
  id: string | number
  title?: string
  popoverPlacement?: PopoverPlacement
}
