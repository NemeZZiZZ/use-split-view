# Changelog

## 0.3.0 (2026-07-13)

### Features

- **Pass-through zoom options** — new `zoom` option forwards extra config (bounds, inertia, keyboard, rotation, double-tap, snap-to-grid, activation keys, gestures, axis, wheelMode, cursor, contentRect, shouldHandleEvent, lifecycle callbacks) to the underlying `useZoomPinch` instance driving the split panes. Previously these features of `use-zoom-pinch` were unreachable from `useSplitView`. The owned fields (`containerRef`, scale/speed limits, view-state, `enabled`) are always applied after the spread, so the pass-through can never clobber the split-view wiring.
- **`zoomApi`** — the return object now exposes the advanced imperative helpers of the same `useZoomPinch` instance (`zoomIn`, `zoomOut`, `zoomTo`, `panTo`, `panBy`, `fitToRect`, `fitToContent`, `zoomToElement`, `rotateTo`, `rotateBy`, `snapZoom`, `screenToContent`, `contentToScreen`) via `sv.zoomApi`, so they operate on the real container rather than a separate instance.
- **Correct animation signatures** — `setView`, `centerZoom`, and `resetView` now expose their real `(options?: AnimationOptions)` second argument in TypeScript (they already forwarded to `useZoomPinch` at runtime; the types were just narrowed).
- **`isAnimating`** — exposed on the return object so UI can reflect running animations.
- **Bump `use-zoom-pinch` to `^0.4.0`** — the pass-through `zoom` option and `zoomApi` automatically pick up everything new upstream: `AnimationOptions.skipConstraints` (precise positioning outside bounds) and the re-exported geometry helpers `clamp`, `distance`, `angleBetween` (handy for measurement overlays and snap logic).

### Bug Fixes

- `setNaturalSize` now clamps the compensating zoom with the live `minScale`/`maxScale` instead of hardcoded `0.1`/`50`, and triggers compensation when **either** the fitted width or height changes (previously only width was considered, so height-only changes were ignored).
- The drag handle now ignores non-primary mouse buttons (right/middle click no longer start a drag).

### Improvements

- `handleProps` is memoized (stable reference unless `direction` changes), consistent with `getPaneState` — prevents spurious effect re-runs in consumer code.

### Breaking

- Type-only: `setView`, `centerZoom`, and `resetView` signatures widened to accept `AnimationOptions`. Code passing them directly as event handlers (e.g. `onClick={sv.resetView}`) must now wrap the call (`onClick={() => sv.resetView()}`) — the previous "works by accident" behavior passed a React event as the options argument.
- Dependency: `use-zoom-pinch` bumped from `^0.3.0` to `^0.4.0`. Upstream changed `zoomApi.panBy` to apply screen-space pixels directly to `x`/`y`; call sites are unaffected unless they relied on the old content-space scaling.

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
