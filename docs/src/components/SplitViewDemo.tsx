import { useEffect, useState, type ReactNode } from "react"
import { useSplitView, type SplitViewDirection } from "use-split-view"

type ContentMode = "html" | "image" | "video"

interface SplitViewDemoProps {
  initialDirection?: SplitViewDirection
  initialMode?: ContentMode
  height?: number
  showControls?: boolean
}

const IMAGE_URL = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
const VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"

export default function SplitViewDemo({
  initialDirection = "horizontal",
  initialMode = "html",
  height = 420,
  showControls = true,
}: SplitViewDemoProps) {
  const [direction, setDirection] = useState<SplitViewDirection>(initialDirection)
  const [mode, setMode] = useState<ContentMode>(initialMode)

  const {
    containerRef,
    split,
    getPaneState,
    handleProps,
    resetView,
    centerZoom,
    view,
    displayZoomPct,
    setNaturalSize,
  } = useSplitView({ direction })

  useEffect(() => {
    if (mode === "html") {
      setNaturalSize(1600, 1000)
      resetView()
    }
    // image/video report size from onLoad/onLoadedData handlers
  }, [mode, setNaturalSize, resetView])

  const startPane = getPaneState("start")
  const endPane = getPaneState("end")

  const handlePos = direction === "horizontal" ? { left: `${split}%` } : { top: `${split}%` }

  let startContent: ReactNode
  let endContent: ReactNode
  let startLabel: string
  let endLabel: string

  if (mode === "html") {
    startContent = (
      <div className="sv-demo-content sv-demo-content-a" style={startPane.contentStyle}>
        BEFORE
      </div>
    )
    endContent = (
      <div className="sv-demo-content sv-demo-content-b" style={endPane.contentStyle}>
        AFTER
      </div>
    )
    startLabel = "Before"
    endLabel = "After"
  } else if (mode === "image") {
    startContent = (
      <div style={startPane.contentStyle}>
        <img
          src={IMAGE_URL}
          alt="Original"
          draggable={false}
          crossOrigin="anonymous"
          className="sv-demo-media"
          onLoad={(e) => {
            setNaturalSize(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
          }}
        />
      </div>
    )
    endContent = (
      <div style={endPane.contentStyle}>
        <img
          src={IMAGE_URL}
          alt="Grayscale"
          draggable={false}
          crossOrigin="anonymous"
          className="sv-demo-media sv-demo-media-grayscale"
        />
      </div>
    )
    startLabel = "Original"
    endLabel = "Grayscale"
  } else {
    startContent = (
      <div style={startPane.contentStyle}>
        <video
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          className="sv-demo-media"
          onLoadedData={(e) => {
            setNaturalSize(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
          }}
        />
      </div>
    )
    endContent = (
      <div style={endPane.contentStyle}>
        <video
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          className="sv-demo-media sv-demo-media-sepia"
        />
      </div>
    )
    startLabel = "Normal"
    endLabel = "Sepia"
  }

  return (
    <div className="sv-demo-wrapper not-content">
      {showControls && (
        <div className="sv-demo-toolbar">
          <span className="sv-demo-toolbar-label">Content</span>
          <select
            className="sv-demo-btn sv-demo-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as ContentMode)}
            aria-label="Content type"
          >
            <option value="html">HTML</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <span className="sv-demo-toolbar-label" style={{ marginLeft: 8 }}>
            Split
          </span>
          <button
            type="button"
            className="sv-demo-btn"
            onClick={() => setDirection(direction === "horizontal" ? "vertical" : "horizontal")}
          >
            {direction === "horizontal" ? "Horizontal" : "Vertical"}
          </button>
          <span className="sv-demo-toolbar-label" style={{ marginLeft: 8 }}>
            Zoom
          </span>
          <button
            type="button"
            className="sv-demo-btn"
            onClick={() => centerZoom(view.zoom / 1.5)}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className="sv-demo-btn"
            onClick={() => centerZoom(view.zoom * 1.5)}
            aria-label="Zoom in"
          >
            +
          </button>
          <button type="button" className="sv-demo-btn" onClick={resetView}>
            Reset
          </button>
          <span className="sv-demo-info">
            split {split.toFixed(0)}% · zoom {displayZoomPct}%
          </span>
        </div>
      )}

      <div ref={containerRef} className="sv-demo-canvas" style={{ height }}>
        <div className="sv-demo-pane" style={{ clipPath: startPane.clipPath }}>
          <div className="sv-demo-layer" style={{ transform: startPane.transform }}>
            {startContent}
          </div>
        </div>

        <div className="sv-demo-pane" style={{ clipPath: endPane.clipPath }}>
          <div className="sv-demo-layer" style={{ transform: endPane.transform }}>
            {endContent}
          </div>
        </div>

        <div className={`sv-demo-label sv-demo-label-${direction === "horizontal" ? "left" : "top"}`}>
          {startLabel}
        </div>
        <div className={`sv-demo-label sv-demo-label-${direction === "horizontal" ? "right" : "bottom"}`}>
          {endLabel}
        </div>

        <div
          {...handleProps}
          className={direction === "horizontal" ? "sv-demo-handle-h" : "sv-demo-handle-v"}
          style={handlePos}
        >
          <div
            className={
              direction === "horizontal" ? "sv-demo-handle-line-h" : "sv-demo-handle-line-v"
            }
          />
          <div className="sv-demo-handle-grip" />
        </div>
      </div>
    </div>
  )
}
