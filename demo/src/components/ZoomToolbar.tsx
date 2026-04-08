import type { UseSplitViewReturn } from "use-split-view"

export function ZoomToolbar({ sv }: { sv: UseSplitViewReturn }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-zinc-900 inline-flex items-center rounded-lg">
        <button
          onClick={() => sv.centerZoom(sv.view.zoom / 1.5)}
          className="text-zinc-400 hover:text-white px-2.5 py-1.5 text-sm transition-colors"
        >
          -
        </button>
        <button
          onClick={sv.resetView}
          className="text-zinc-300 hover:text-white min-w-14 px-2 py-1.5 text-center text-xs font-medium transition-colors"
        >
          {sv.displayZoomPct}%
        </button>
        <button
          onClick={() => sv.centerZoom(sv.view.zoom * 1.5)}
          className="text-zinc-400 hover:text-white px-2.5 py-1.5 text-sm transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
