export type StateSelection = {
  isSingleLine?: boolean
  isBackward?: boolean
  startRect: null | DOMRect
  endRect: null | DOMRect
  locateRect: null | DOMRect
  text?: string
}

export type ConfigContentSelection = {
  scrollDetect?: boolean
  onSelect?: (data: StateSelection) => void
  onDeselect?: (data: StateSelection) => void
}
