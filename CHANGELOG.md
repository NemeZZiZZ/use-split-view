# Changelog

## 0.2.0 (2026-04-16)

### Features

- Bump `use-zoom-pinch` peer to `^0.3.0` — unlocks rotation, inertia, bounds, keyboard navigation, zoom snap levels, snap-to-grid, double-tap, activation keys, animated transitions, coordinate conversion, and imperative methods (`zoomIn`, `zoomOut`, `zoomTo`, `panTo`, `panBy`, `fitToRect`, `fitToContent`, `zoomToElement`, `rotateTo`, `rotateBy`, `snapZoom`, `screenToContent`, `contentToScreen`) via the re-exported `useZoomPinch`
- Re-export new types: `AnimationOptions`, `EasingFunction`, `BoundsOptions`, `GesturesOptions`, `InertiaOptions`, `DoubleTapOptions`, `RotationOptions`, `KeyboardOptions`, `CursorOptions`, `ActivationKeyOptions`, `SnapToGridOptions`, `ZoomSnapLevel`
- Re-export easing helpers: `easeInOut`, `easeOut`, `linear`
- Starlight/Astro documentation site under `docs/`

### Notes

- Fully backward compatible — no changes to `useSplitView` API
- `setView` now accepts an optional second argument `AnimationOptions` for animated transitions (passthrough from `use-zoom-pinch`)

## 0.1.0 (2026-04-07)

### Features

- `useSplitView` headless hook with full split-view state management
- Horizontal and vertical split directions
- Drag handle with pointer capture
- Fit-to-container scaling with `setNaturalSize`
- Zoom compensation on content dimension changes
- `getPaneState()` returning `clipPath`, `transform`, `contentStyle`
- `handleProps` for spreading on custom handle elements
- Controlled and uncontrolled view state via `use-zoom-pinch`
- Re-exports `useZoomPinch` and related types for convenience
