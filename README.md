# use-split-view

Headless React hook for building split-view side-by-side comparison interfaces with built-in zoom, pan, and pinch-to-zoom support.

**Zero styling opinions** — you bring the markup, the hook manages all the state and interaction logic.

[![npm](https://img.shields.io/npm/v/use-split-view)](https://www.npmjs.com/package/use-split-view)
[![bundle size](https://img.shields.io/bundlephobia/minzip/use-split-view)](https://bundlephobia.com/package/use-split-view)

[Live Demo](https://nemezzizz.github.io/use-split-view/)

## Features

- Headless — no DOM output, no CSS dependencies, full control over markup
- Split handle dragging with pointer capture
- Synchronized zoom/pan across both panes via [use-zoom-pinch](https://www.npmjs.com/package/use-zoom-pinch)
- Trackpad scroll, mouse wheel zoom, touch pinch-to-zoom
- Horizontal and vertical split directions
- Fit-to-container scaling with natural size tracking
- Controlled and uncontrolled view state
- TypeScript-first with full type exports

## Installation

```bash
npm install use-split-view
# or
pnpm add use-split-view
# or
yarn add use-split-view
```

> `react >= 18` is a peer dependency.

## Quick Start

```tsx
import { useSplitView } from "use-split-view"

function ImageComparison() {
  const {
    containerRef,
    getPaneState,
    handleProps,
    setNaturalSize,
    displayZoomPct,
    resetView,
    split,
  } = useSplitView({ direction: "horizontal" })

  const startPane = getPaneState("start")
  const endPane = getPaneState("end")

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: 500,
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Start pane */}
      <div style={{ position: "absolute", inset: 0, clipPath: startPane.clipPath }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "top left",
            transform: startPane.transform,
          }}
        >
          <div style={startPane.contentStyle}>
            <img
              src="/before.jpg"
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
              draggable={false}
              onLoad={(e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget
                setNaturalSize(naturalWidth, naturalHeight)
              }}
            />
          </div>
        </div>
      </div>

      {/* End pane */}
      <div style={{ position: "absolute", inset: 0, clipPath: endPane.clipPath }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "top left",
            transform: endPane.transform,
          }}
        >
          <div style={endPane.contentStyle}>
            <img
              src="/after.jpg"
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Drag handle */}
      <div
        {...handleProps}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${split}%`,
          width: 24,
          transform: "translateX(-50%)",
          cursor: "col-resize",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 2,
            height: "100%",
            margin: "0 auto",
            backgroundColor: "white",
            boxShadow: "0 0 4px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* Zoom indicator */}
      <button onClick={resetView} style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        {displayZoomPct}%
      </button>
    </div>
  )
}
```

## API Reference

### `useSplitView(options?)`

```ts
import { useSplitView } from "use-split-view"
```

#### Options

| Option              | Type                         | Default        | Description                            |
| ------------------- | ---------------------------- | -------------- | -------------------------------------- |
| `direction`         | `"horizontal" \| "vertical"` | `"horizontal"` | Split direction                        |
| `initialSplit`      | `number`                     | `50`           | Initial split position (0-100)         |
| `minScale`          | `number`                     | `0.1`          | Minimum zoom level                     |
| `maxScale`          | `number`                     | `50`           | Maximum zoom level                     |
| `panSpeed`          | `number`                     | `1`            | Pan speed multiplier (mouse wheel)     |
| `zoomSpeed`         | `number`                     | `1`            | Zoom speed multiplier (mouse wheel)    |
| `viewState`         | `ViewState`                  | —              | Controlled view state `{ x, y, zoom }` |
| `onViewStateChange` | `(view: ViewState) => void`  | —              | Callback for controlled mode           |

#### Return Value

| Property         | Type                           | Description                                   |
| ---------------- | ------------------------------ | --------------------------------------------- |
| `containerRef`   | `RefObject<HTMLDivElement>`    | Attach to the container element               |
| `split`          | `number`                       | Current split position (0-100)                |
| `setSplit`       | `(value: number) => void`      | Set split position programmatically           |
| `view`           | `ViewState`                    | Current `{ x, y, zoom }`                      |
| `setView`        | `(v: ViewState) => void`       | Set view state directly                       |
| `centerZoom`     | `(targetZoom: number) => void` | Zoom keeping center as anchor                 |
| `resetView`      | `() => void`                   | Reset to `{ x: 0, y: 0, zoom: 1 }`            |
| `direction`      | `SplitViewDirection`           | Current direction                             |
| `isLocked`       | `boolean`                      | Whether zoom/pan is locked (handle drag)      |
| `setIsLocked`    | `(locked: boolean) => void`    | Lock/unlock zoom/pan manually                 |
| `containerSize`  | `{ w, h }`                     | Container dimensions in pixels                |
| `naturalSize`    | `{ w, h } \| null`             | Natural content dimensions                    |
| `setNaturalSize` | `(w, h) => void`               | Set natural dimensions (call on content load) |
| `fitScale`       | `number`                       | Scale to fit content in container             |
| `displaySize`    | `{ w, h }`                     | Display dimensions (`naturalSize * fitScale`) |
| `displayZoomPct` | `number`                       | Zoom as display percentage                    |
| `getPaneState`   | `(part) => SplitPaneState`     | Get clip/transform/style for a pane           |
| `handleProps`    | `object`                       | Spread on the drag handle element             |
| `splitCSSValue`  | `string`                       | CSS value like `"50%"`                        |

#### `SplitPaneState`

Returned by `getPaneState("start" | "end")`:

```ts
interface SplitPaneState {
  clipPath: string // CSS clip-path for this pane
  transform: string // CSS transform for zoom/pan layer
  contentStyle: CSSProperties // Width/height for content sizing
}
```

#### `ViewState`

Re-exported from [use-zoom-pinch](https://www.npmjs.com/package/use-zoom-pinch):

```ts
interface ViewState {
  x: number
  y: number
  zoom: number
}
```

### Re-exports

The package re-exports everything from `use-zoom-pinch` for convenience:

```ts
import { useZoomPinch, type UseZoomPinchOptions, type UseZoomPinchReturn } from "use-split-view"
```

## Architecture

The hook follows a layered approach matching the original SplitView component:

```
Container (containerRef)
├── Pane "start" (clipPath clips to left/top half)
│   └── Transform layer (translate + scale from view)
│       └── Content layer (sized by contentStyle)
├── Pane "end" (clipPath clips to right/bottom half)
│   └── Transform layer (same transform)
│       └── Content layer (same contentStyle)
└── Handle (drag to change split, uses handleProps)
```

Both panes share the same `view` state, so zoom and pan are always synchronized. The `clipPath` on each pane creates the split effect by revealing only the relevant portion.

### Content Sizing

When you call `setNaturalSize(width, height)` (typically in an `onLoad` handler), the hook:

1. Computes `fitScale` — the scale needed to fit the content within the container without exceeding its natural size
2. Returns `displaySize` — the rendered dimensions at `fitScale`
3. If the natural size changes (e.g., a higher-res image loads), automatically compensates zoom and position to maintain visual continuity

### Handle Interaction

The `handleProps` object includes:

- Pointer capture for smooth dragging even when the cursor leaves the handle
- Automatic zoom/pan locking during drag to prevent conflicts
- Mouse enter/leave locking for hover states

## Examples

### Vertical Split

```tsx
const sv = useSplitView({ direction: "vertical" })
// The handle becomes horizontal, content splits top/bottom
```

### Controlled View State

```tsx
const [view, setView] = useState({ x: 0, y: 0, zoom: 1 })

const sv = useSplitView({
  viewState: view,
  onViewStateChange: setView,
})
```

### Video Comparison

```tsx
<video
  src="/video-a.mp4"
  autoPlay
  loop
  muted
  playsInline
  style={{ width: "100%", height: "100%", objectFit: "fill" }}
  onLoadedData={(e) => {
    const { videoWidth, videoHeight } = e.currentTarget
    sv.setNaturalSize(videoWidth, videoHeight)
  }}
/>
```

### Zoom Controls

```tsx
<button onClick={() => sv.centerZoom(sv.view.zoom * 2)}>Zoom In</button>
<button onClick={() => sv.centerZoom(sv.view.zoom / 2)}>Zoom Out</button>
<button onClick={sv.resetView}>Reset</button>
<span>{sv.displayZoomPct}%</span>
```

### Lock Zoom During UI Interaction

```tsx
<div onMouseEnter={() => sv.setIsLocked(true)} onMouseLeave={() => sv.setIsLocked(false)}>
  {/* Toolbar, dropdown, etc. */}
</div>
```

## License

MIT
