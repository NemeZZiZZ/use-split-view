import { type CSSProperties, type RefObject, useCallback, useEffect, useRef, useState } from "react"
import { type ViewState, useZoomPinch } from "use-zoom-pinch"

export type SplitViewDirection = "horizontal" | "vertical"

export interface UseSplitViewOptions {
  direction?: SplitViewDirection
  initialSplit?: number
  minScale?: number
  maxScale?: number
  panSpeed?: number
  zoomSpeed?: number
  viewState?: ViewState
  onViewStateChange?: (view: ViewState) => void
}

export interface SplitPaneState {
  /** CSS clip-path string for this pane */
  clipPath: string
  /** CSS transform string for the zoom/pan layer */
  transform: string
  /** Style for the content sizing layer */
  contentStyle: CSSProperties
}

export interface UseSplitViewReturn {
  /** Ref to attach to the container element */
  containerRef: RefObject<HTMLDivElement | null>
  /** Current split position (0-100) */
  split: number
  /** Set split position */
  setSplit: (value: number) => void
  /** Current view state */
  view: ViewState
  /** Set view state directly */
  setView: (v: ViewState) => void
  /** Zoom to a specific level, keeping the center */
  centerZoom: (targetZoom: number) => void
  /** Reset view to initial state */
  resetView: () => void
  /** Current direction */
  direction: SplitViewDirection
  /** Whether the handle is being dragged (zoom/pan disabled) */
  isLocked: boolean
  /** Lock/unlock zoom/pan (e.g. when hovering controls) */
  setIsLocked: (locked: boolean) => void
  /** Container size in pixels */
  containerSize: { w: number; h: number }
  /** Natural content size (set via setNaturalSize) */
  naturalSize: { w: number; h: number } | null
  /** Call when content loads to set its natural dimensions */
  setNaturalSize: (w: number, h: number) => void
  /** Scale factor to fit content into the container */
  fitScale: number
  /** Display dimensions of the content (naturalSize * fitScale) */
  displaySize: { w: number; h: number }
  /** Current zoom as a display percentage (zoom * fitScale * 100) */
  displayZoomPct: number
  /** Get props for a split pane */
  getPaneState: (part: "start" | "end") => SplitPaneState
  /** Props to spread on the drag handle element */
  handleProps: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerCancel: (e: React.PointerEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
  /** CSS custom property value for the split position */
  splitCSSValue: string
}

export function useSplitView({
  direction = "horizontal",
  initialSplit = 50,
  minScale = 0.1,
  maxScale = 50,
  panSpeed = 1,
  zoomSpeed = 1,
  viewState,
  onViewStateChange,
}: UseSplitViewOptions = {}): UseSplitViewReturn {
  const [split, setSplit] = useState(initialSplit)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(false)

  const { view, setView, centerZoom, resetView } = useZoomPinch({
    containerRef,
    minScale,
    maxScale,
    panSpeed,
    zoomSpeed,
    viewState,
    onViewStateChange,
    enabled: !isLocked,
  })

  const viewRef = useRef(view)
  useEffect(() => {
    viewRef.current = view
  }, [view])

  // Container size
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const containerSizeRef = useRef({ w: 0, h: 0 })

  // Natural content size
  const [naturalSize, setNaturalSizeState] = useState<{ w: number; h: number } | null>(null)
  const naturalSizeRef = useRef<{ w: number; h: number } | null>(null)

  // Track container size via ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      if (e) {
        const size = { w: e.contentRect.width, h: e.contentRect.height }
        containerSizeRef.current = size
        setContainerSize(size)
      }
    })
    ro.observe(el)
    const initialSize = { w: el.offsetWidth, h: el.offsetHeight }
    containerSizeRef.current = initialSize
    setContainerSize(initialSize)
    return () => ro.disconnect()
  }, [])

  // Fit scale computation
  const computeFitScale = (w: number, h: number, containerW: number, containerH: number) =>
    containerW && containerH ? Math.min(containerW / w, containerH / h, 1) : 1

  const hasDimensions = !!naturalSize
  const { w: cw, h: ch } = containerSize
  const naturalWidth = naturalSize?.w ?? 0
  const naturalHeight = naturalSize?.h ?? 0

  const fitScale =
    hasDimensions && cw && ch ? computeFitScale(naturalWidth, naturalHeight, cw, ch) : 1

  const dispW = hasDimensions ? Math.round(naturalWidth * fitScale) : 0
  const dispH = hasDimensions ? Math.round(naturalHeight * fitScale) : 0
  const displayZoomPct = Math.round(view.zoom * fitScale * 100)

  // setNaturalSize: compensates zoom+position when dimensions change
  const setNaturalSize = useCallback(
    (w: number, h: number) => {
      const oldDims = naturalSizeRef.current
      const { w: cW, h: cH } = containerSizeRef.current

      if (oldDims?.w === w && oldDims?.h === h) return

      if (oldDims && cW && cH) {
        const oldFit = computeFitScale(oldDims.w, oldDims.h, cW, cH)
        const newFit = computeFitScale(w, h, cW, cH)

        const dispW_old = oldDims.w * oldFit
        const dispW_new = w * newFit

        if (Math.abs(dispW_old - dispW_new) > 0.5) {
          const { zoom: z, x, y } = viewRef.current
          const ratio = dispW_old / dispW_new
          const newZoom = Math.max(0.1, Math.min(z * ratio, 50))

          setView({
            zoom: newZoom,
            x: x - (newZoom - z) * (cW / 2),
            y: y - (newZoom - z) * (cH / 2),
          })
        }
      }

      naturalSizeRef.current = { w, h }
      setNaturalSizeState({ w, h })
    },
    [setView],
  )

  // Handle drag logic
  const isDraggingRef = useRef(false)

  const handleProps = {
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      e.stopPropagation()
      isDraggingRef.current = true
      setIsLocked(true)
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return
      e.stopPropagation()
      const rect = containerRef.current.getBoundingClientRect()
      if (direction === "horizontal") {
        setSplit((Math.max(0, Math.min(e.clientX - rect.left, rect.width)) / rect.width) * 100)
      } else {
        setSplit((Math.max(0, Math.min(e.clientY - rect.top, rect.height)) / rect.height) * 100)
      }
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      isDraggingRef.current = false
      setIsLocked(false)
    },
    onPointerCancel: (e: React.PointerEvent) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      isDraggingRef.current = false
      setIsLocked(false)
    },
    onMouseEnter: () => setIsLocked(true),
    onMouseLeave: () => {
      if (!isDraggingRef.current) setIsLocked(false)
    },
  }

  // Pane state computation
  const getPaneState = useCallback(
    (part: "start" | "end"): SplitPaneState => {
      const splitPct = `${split}%`

      const clipPath =
        direction === "horizontal"
          ? part === "start"
            ? `inset(0 calc(100% - ${splitPct}) 0 0)`
            : `inset(0 0 0 ${splitPct})`
          : part === "start"
            ? `inset(0 0 calc(100% - ${splitPct}) 0)`
            : `inset(${splitPct} 0 0)`

      const transform = `translate(${view.x}px,${view.y}px) scale(${view.zoom})`

      const contentStyle: CSSProperties = hasDimensions
        ? { width: dispW, height: dispH }
        : { opacity: 0 }

      return { clipPath, transform, contentStyle }
    },
    [split, direction, view.x, view.y, view.zoom, hasDimensions, dispW, dispH],
  )

  return {
    containerRef,
    split,
    setSplit,
    view,
    setView,
    centerZoom,
    resetView,
    direction,
    isLocked,
    setIsLocked,
    containerSize,
    naturalSize,
    setNaturalSize,
    fitScale,
    displaySize: { w: dispW, h: dispH },
    displayZoomPct,
    getPaneState,
    handleProps,
    splitCSSValue: `${split}%`,
  }
}
