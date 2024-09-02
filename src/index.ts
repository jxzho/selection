import { ConfigContentSelection, StateSelection } from './types'

export const contentSelection = ({
  scrollDetect,
  onSelect,
  onDeselect
}: ConfigContentSelection = {}) => {
  const ts = Object.create(null) as {
    on: Function
    off: Function
  }

  const state: StateSelection = {
    isSingleLine: undefined,
    isBackward: undefined,
    startRect: null,
    endRect: null,
    locateRect: null
  }

  let __selection__: null | Selection
  let __eleLocate__: null | HTMLElement

  const clearState = () => {
    state.isBackward = undefined
    state.startRect = null
    state.endRect = null
    state.locateRect = null
    __selection__ = null
    __eleLocate__?.remove()
  }

  const deselect = () => {
    if (__selection__) {
      onDeselect?.(state)
      clearState()
    }
  }

  const onScroll = () => {
    deselect()
  }

  const onSelectEnd = () => {
    const selection = getSelection()

    /** No Selection */
    if (!selection || selection?.isCollapsed || selection.rangeCount <= 0 || selection.type !== 'Range') {
      return
    }

    __selection__ = selection
    const isBackward = __isBackwards__(selection)
    const range = selection.getRangeAt(0)
    const rangeRects = range.getClientRects()

    const isSingleLine = rangeRects.length === 1 || (
      rangeRects[0].top === rangeRects[rangeRects.length - 1].top
    )

    /**
     * Forward: get last
     * Backward: get first
     */
    if (isSingleLine) {
      const _rect = rangeRects[0]
      const _rectLast = rangeRects[rangeRects.length - 1]
      state.startRect = {
        ..._rect.toJSON(),
        width: Array.from(rangeRects).reduce((acc, rect) => acc + rect.width, 0),
        x: isBackward ? _rectLast.x + _rectLast.width : _rect.x,
        left: isBackward ? _rectLast.left + _rectLast.width : _rect.left
      }

      state.endRect = {
        ..._rect.toJSON(),
        width: Array.from(rangeRects).reduce((acc, rect) => acc + rect.width, 0),
        x: isBackward ? _rect.x : _rectLast.x + _rectLast.width,
        left: isBackward ? _rect.left : _rectLast.left + _rectLast.width
      }
    } else {
      state.startRect = isBackward
        ? {
          ...rangeRects[rangeRects.length - 1].toJSON(),
          x: rangeRects[rangeRects.length - 1].x + rangeRects[rangeRects.length - 1].width,
          left: rangeRects[rangeRects.length - 1].left + rangeRects[rangeRects.length - 1].width
        }
        : rangeRects[0]

      state.endRect = isBackward
        ? rangeRects[0]
        : {
          ...rangeRects[rangeRects.length - 1].toJSON(),
          x: rangeRects[rangeRects.length - 1].x + rangeRects[rangeRects.length - 1].width,
          left: rangeRects[rangeRects.length - 1].left + rangeRects[rangeRects.length - 1].width
        }
    }

    const rangeCloned = range.cloneRange()
    rangeCloned.collapse(!!isBackward)
    rangeCloned.insertNode(__eleLocate__!)

    state.locateRect = __eleLocate__?.getBoundingClientRect() ?? null
    state.text = selection.toString()
    state.isSingleLine = isSingleLine
    state.isBackward = isBackward

    onSelect?.(state)
  }

  const onSelectChange = () => {
    if (__isUnSelected__(getSelection())) {
      deselect()
    }
  }

  ts.on = () => {
    if (!document) {
      throw new Error('Need Dom Mounted to use `.on`.')
    }

    __eleLocate__ = document.createElement('i')
    __eleLocate__.style.visibility = 'hidden'

    document.addEventListener('selectionchange', onSelectChange)
    document.addEventListener('mouseup', onSelectEnd)
    
    if (scrollDetect) {
      document.addEventListener('scroll', onScroll)
    }
  }

  ts.off = () => {
    document.removeEventListener('selectionchange', onSelectChange)
    document.removeEventListener('mouseup', onSelectEnd)
    document.removeEventListener('scroll', onScroll)
  }

  return ts
}

function __isUnSelected__ (s: Selection | null) {
  return !s || !s.rangeCount || s.type !== 'Range'
}

function __isBackwards__ ({ anchorNode, anchorOffset, focusNode, focusOffset }: Selection) {
  let range = document.createRange()
  range.setStart(anchorNode!, anchorOffset)
  range.setEnd(focusNode!, focusOffset)

  let backwards = range.collapsed
  range.detach()
  return backwards
}

function getSelection () {
  return document.getSelection() || null
}
