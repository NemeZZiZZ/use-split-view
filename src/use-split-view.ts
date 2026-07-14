import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  type AnimationOptions,
  type UseZoomPinchOptions,
  type UseZoomPinchReturn,
  type ViewState,
  useZoomPinch,
} from "use-zoom-pinch"

export type SplitViewDirection = "horizontal" | "vertical"

/**
 * Pass-through options forwarded to the underlying `useZoomPinch` instance.
 *
 * This omits the fields `useSplitView` owns (`containerRef`, scale/speed, view
 * state, `enabled`) so you can enable inertia, bounds, keyboard, rotation,
 * double-tap, snap, activation keys, etc. without losing the split-view wiring.
 */
export type SplitViewZoomOptions = Omit<
  UseZoomPinchOptions,
  | "containerRef"
  | "minScale"
  | "maxScale"
  | "panSpeed"
  | "zoomSpeed"
  | "viewState"
  | "onViewStateChange"
  | "enabled"
>

/**
 * Imperative helpers from the underlying `useZoomPinch` instance that aren't
 * already exposed directly on `UseSplitViewReturn`. Lets you call `zoomIn`,
 * `panTo`, `fitToRect`, `screenToContent`, etc. on the same instance that
 * drives the split panes.
 */
export type SplitViewZoomApi = Omit<
  UseZoomPinchReturn,
  "view" | "setView" | "centerZoom" | "resetView" | "isAnimating"
>

export interface UseSplitViewOptions {
  direction?: SplitViewDirection
  initialSplit?: number
  minScale?: number
  maxScale?: number
  panSpeed?: number
  zoomSpeed?: number
  viewState?: ViewState
  onViewStateChange?: (view: ViewState) => void
  /**
   * Pass-through options forwarded to the underlying `useZoomPinch` instance.
   * Use this to enable bounds, inertia, keyboard navigation, rotation,
   * double-tap, snap-to-grid, activation keys, etc. while keeping the
   * split-view container, scale limits, and view state wired up.
   */
  zoom?: SplitViewZoomOptions
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
  /** Set view state directly, optionally animated */
  setView: (v: ViewState, options?: AnimationOptions) => void
  /** Zoom to a specific level, keeping the center, optionally animated */
  centerZoom: (targetZoom: number, options?: AnimationOptions) => void
  /** Reset view to initial state, optionally animated */
  resetView: (options?: AnimationOptions) => void
  /** Whether an animation is currently running */
  isAnimating: boolean
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
    onPointerDown: (e: ReactPointerEvent) => void
    onPointerMove: (e: ReactPointerEvent) => void
    onPointerUp: (e: ReactPointerEvent) => void
    onPointerCancel: (e: ReactPointerEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
  /** CSS custom property value for the split position */
  splitCSSValue: string
  /**
   * Direct access to the advanced imperative helpers of the underlying
   * `useZoomPinch` instance (`zoomIn`, `zoomOut`, `zoomTo`, `panTo`, `panBy`,
   * `fitToRect`, `fitToContent`, `zoomToElement`, `rotateTo`, `rotateBy`,
   * `snapZoom`, `screenToContent`, `contentToScreen`).
   */
  zoomApi: SplitViewZoomApi
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
  zoom,
}: UseSplitViewOptions = {}): UseSplitViewReturn {
  const [split, setSplit] = useState(initialSplit)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(false)

  // Spread `zoom` first so the split-view's owned fields (container, scale/speed
  // limits, view state, enabled/lock) always win — a pass-through can never
  // clobber the wiring, even if a JS consumer bypasses the Omit<> type.
  const zoomOptions = useZoomPinch({
    ...zoom,
    containerRef,
    minScale,
    maxScale,
    panSpeed,
    zoomSpeed,
    viewState,
    onViewStateChange,
    enabled: !isLocked,
  })

  const { view, setView, centerZoom, resetView, isAnimating, ...zoomApi } = zoomOptions

  const viewRef = useRef(view)
  useEffect(() => {
    viewRef.current = view
  }, [view])

  // Keep scale limits in a ref so setNaturalSize can clamp with the live values
  const limitsRef = useRef({ minScale, maxScale })
  useEffect(() => {
    limitsRef.current = { minScale, maxScale }
  }, [minScale, maxScale])

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
        const dispH_old = oldDims.h * oldFit
        const dispH_new = h * newFit

        // Recompute only when the fitted display size actually changes
        if (Math.abs(dispW_old - dispW_new) > 0.5 || Math.abs(dispH_old - dispH_new) > 0.5) {
          const { zoom: z, x, y } = viewRef.current
          const ratioW = dispW_new > 0 ? dispW_old / dispW_new : 1
          const ratioH = dispH_new > 0 ? dispH_old / dispH_new : 1
          // Keep the previously zoomed region stable by matching the old display scale
          const ratio = (ratioW + ratioH) / 2
          const { minScale: mn, maxScale: mx } = limitsRef.current
          const newZoom = Math.max(mn, Math.min(z * ratio, mx))

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

  const handleProps = useMemo(
    () => ({
      onPointerDown: (e: ReactPointerEvent) => {
        // Only start dragging on the primary button — ignore right/middle clicks
        if (e.button !== 0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        e.stopPropagation()
        isDraggingRef.current = true
        setIsLocked(true)
      },
      onPointerMove: (e: ReactPointerEvent) => {
        if (!isDraggingRef.current || !containerRef.current) return
        e.stopPropagation()
        const rect = containerRef.current.getBoundingClientRect()
        if (direction === "horizontal") {
          setSplit((Math.max(0, Math.min(e.clientX - rect.left, rect.width)) / rect.width) * 100)
        } else {
          setSplit((Math.max(0, Math.min(e.clientY - rect.top, rect.height)) / rect.height) * 100)
        }
      },
      onPointerUp: (e: ReactPointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        isDraggingRef.current = false
        setIsLocked(false)
      },
      onPointerCancel: (e: ReactPointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        isDraggingRef.current = false
        setIsLocked(false)
      },
      onMouseEnter: () => setIsLocked(true),
      onMouseLeave: () => {
        if (!isDraggingRef.current) setIsLocked(false)
      },
    }),
    [direction],
  )

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
    isAnimating,
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
    zoomApi,
  }
}
